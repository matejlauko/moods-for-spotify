import * as React from 'react';
import { useControls, useRefresher } from './playback';

const TRACK_ENDING_TIMEOUT_BUFFER = 500;

export interface PlayerState {
  activeDeviceId: string | null;
  currentPlayback: SpotifyApi.CurrentPlaybackResponse | null;
}

interface PlayerContextValue {
  state: PlayerState;
  refresh: () => void;
  controls: ReturnType<typeof useControls>;
}

// @ts-ignore no default val
const PlayerContext = React.createContext<PlayerContextValue>();

interface Props {
  onInit: () => void;
}

export const PlayerProvider: React.FC<Props> = ({ children, onInit }) => {
  const [state, setState] = React.useState<PlayerState>({
    activeDeviceId: null,
    currentPlayback: null,
  });
  const { refresh, subscribe: subscribeRefresher } = useRefresher(setState);

  const controls = useControls(state, refresh);

  const trackEndingTimeout: React.MutableRefObject<
    number | null
  > = React.useRef<number>(null);

  /* Subscribe refresher on mount */
  React.useEffect(() => {
    return subscribeRefresher(onInit);
  }, []);

  function unsubscribeTrackEnding() {
    if (trackEndingTimeout.current !== null) {
      window.clearTimeout(trackEndingTimeout.current);
      trackEndingTimeout.current = null;
    }
  }

  function subscribeTrackEnding() {
    unsubscribeTrackEnding();

    const track = state.currentPlayback?.item;
    if (state.currentPlayback?.is_playing && track) {
      const trackEndingIn = track
        ? track.duration_ms -
          (state.currentPlayback.progress_ms || 0) +
          TRACK_ENDING_TIMEOUT_BUFFER
        : 0;
      trackEndingTimeout.current = window.setTimeout(
        refresh,
        // Guard requests too fast
        Math.max(trackEndingIn, 1)
      );
    }

    return unsubscribeTrackEnding;
  }

  React.useEffect(() => {
    if (state.currentPlayback?.is_playing) {
      return subscribeTrackEnding();
    }
  }, [state.currentPlayback]);

  const contextValue = {
    state,
    refresh,
    controls,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () =>
  React.useContext<PlayerContextValue>(PlayerContext);
