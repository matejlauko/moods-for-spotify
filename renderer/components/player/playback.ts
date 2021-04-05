import { useApiMutation, useApiQuery } from '@/libs/api';
import { isPlaylistMood, Mood } from '@/moods';
import { useRecommendations } from '@/recommendations';
import log from '@/utils/logger';
import { ipcRenderer } from 'electron';
import * as React from 'react';
import { PlayerState } from './player-provider';

const REFRESH_INTERVAL: number | null = 5000;

export async function fetchPlayerState(
  query: ReturnType<typeof useApiQuery>
): Promise<PlayerState> {
  const currentPlayback =
    (await query((api) => api.getMyCurrentPlaybackState())) || null;
  const devicesData = await query((api) => api.getMyDevices());

  const activeDeviceId = getActiveDeviceId(devicesData?.devices);

  return {
    currentPlayback,
    activeDeviceId,
  };
}

export const useRefresher = (setState: (state: PlayerState) => void) => {
  const query = useApiQuery();
  const intervalRef: React.MutableRefObject<
    number | null
  > = React.useRef<number>(null);

  const refreshPlayerState = React.useCallback(
    async (typeOrEvent?: unknown) => {
      const refreshType =
        typeof typeOrEvent === 'object' ? 'focus' : typeOrEvent || 'manual';

      log.debug('[player][state] refreshing', { refreshType });

      const data = await fetchPlayerState(query);

      setState(data);

      log.debug('[player][state] refreshed', { refreshType, data });
    },
    []
  );

  const unsubscribe = React.useCallback(() => {
    log.debug('[player][state] unsubscribing refreshers');

    ipcRenderer.off('focus', refreshPlayerState);

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const subscribe = React.useCallback((onInit?: () => void) => {
    log.debug('[player][state] subscribing refreshers');

    // Unsuscribe possible old listeners first
    unsubscribe();

    // Refresh immediatelly
    refreshPlayerState('init').finally(() => {
      onInit && onInit();
    });

    ipcRenderer.on('focus', refreshPlayerState);

    if (typeof REFRESH_INTERVAL === 'number') {
      intervalRef.current = window.setInterval(
        () => refreshPlayerState('interval'),
        REFRESH_INTERVAL
      );
    }

    return unsubscribe;
  }, []);

  return {
    subscribe,
    refresh: refreshPlayerState,
  };
};

const usePlayParameters = () => {
  const { getRecommendations } = useRecommendations();

  async function getPlayParameters(
    mood: Mood
  ): Promise<SpotifyApi.PlayParameterObject | null> {
    if (isPlaylistMood(mood)) {
      return {
        context_uri: `spotify:playlist:${mood.playlistId}`,
      };
    }

    const recommendation = await getRecommendations(mood);

    const trackUris = recommendation?.tracks.map((track) => track.uri);
    if (!trackUris?.length) return null;

    return {
      uris: trackUris,
    };
  }

  return getPlayParameters;
};

interface Controls {
  play: (mood?: Mood) => void;
  pause: () => void;
  prev: () => void;
  next: () => void;
}

export const useControls = (
  state: PlayerState,
  refresh: () => void
): Controls => {
  const getPlayParameters = usePlayParameters();
  const mutateRefresh = useApiMutation({ onResolve: refresh, cbDelay: 200 });
  const mutateRefreshDelay = useApiMutation({
    onResolve: refresh,
    cbDelay: 500,
  });

  const controlOptions = !state.currentPlayback
    ? { device_id: state.activeDeviceId || undefined }
    : undefined;

  return {
    play: (mood) => {
      if (mood) {
        mutateRefreshDelay(async (client) => {
          const playParams = await getPlayParameters(mood);

          if (!playParams) {
            log.debug('[player][control] !play -> nothing to play', { mood });
            return;
          }

          const options: SpotifyApi.PlayParameterObject = {
            ...controlOptions,
            ...playParams,
          };
          log.debug('[player][control] play (mood)', { options, mood });

          return client.play(options);
        });
      } else {
        mutateRefresh(async (client) => {
          log.debug('[player][control] play', { options: controlOptions });

          return client.play(controlOptions);
        });
      }
    },
    pause: () =>
      mutateRefresh((client) => {
        log.debug('[player][control] pause', { options: controlOptions });

        return client.pause(controlOptions);
      }),
    prev: () =>
      mutateRefresh((client) => {
        log.debug('[player][control] prev', { options: controlOptions });

        return client.skipToPrevious(controlOptions);
      }),
    next: () =>
      mutateRefresh((client) => {
        log.debug('[player][control] next', { options: controlOptions });

        return client.skipToNext(controlOptions);
      }),
  };
};

function getActiveDeviceId(devices?: SpotifyApi.UserDevice[]) {
  if (!devices) return null;

  const devicesSorted = devices
    .filter((device) => !device.is_restricted)
    .sort((a) => (a.is_active ? -1 : 0));

  return devicesSorted[0]?.id || null;
}
