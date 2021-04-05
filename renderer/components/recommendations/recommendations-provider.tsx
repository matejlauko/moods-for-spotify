import {
  ableToPlay,
  isPlaylistMood,
  RecommendationsMood,
  useMoods,
} from '@/moods';
import log from '@/utils/logger';
import * as React from 'react';
import { useRecommendationsQuery } from './recommendations';

// @ts-ignore
const RecommendationsContext = React.createContext<{
  loadRecommendations: (
    mood: RecommendationsMood
  ) =>
    | Promise<SpotifyApi.RecommendationsFromSeedsResponse | undefined>
    | undefined;
  getRecommendations: (
    mood: RecommendationsMood
  ) => Promise<SpotifyApi.RecommendationsFromSeedsResponse | undefined>;
}>();

interface Props {
  isSettings?: boolean;
}

interface State {
  [MoodId: number]: SpotifyApi.RecommendationsFromSeedsResponse;
}

export const RecommendationsProvider: React.FC<Props> = ({
  isSettings,
  children,
}) => {
  const {
    state: { moods, isLoaded: areMoodsLoaded },
  } = useMoods();
  const queryRecommendations = useRecommendationsQuery(isSettings ? 5 : 20);
  const [recommendationsState, setRecommendationsState] = React.useState<State>(
    {}
  );

  function loadRecommendations(mood: RecommendationsMood) {
    if (!mood.genre && !mood.artist) {
      return undefined;
    }
    log.debug('[recomm] loading', { mood });

    return queryRecommendations(mood);
  }

  async function getRecommendations(mood: RecommendationsMood) {
    log.debug('[recomm] gettin', {
      mood,
      saved: recommendationsState[mood.id],
    });

    if (recommendationsState[mood.id]) {
      return recommendationsState[mood.id];
    }

    const recommendationsResponse = await loadRecommendations(mood);
    if (recommendationsResponse) {
      setRecommendationsState((s) => ({
        ...s,
        [mood.id]: recommendationsResponse,
      }));
    }
    return recommendationsResponse;
  }

  async function load() {
    log.debug('[recomm] load init', { moods });

    const results = (
      await Promise.all(
        moods.map(async (mood) => {
          if (isPlaylistMood(mood)) return null;

          const response = await loadRecommendations(mood);

          return response ? [mood, response] : null;
        })
      )
    ).filter(Boolean) as Array<
      [RecommendationsMood, SpotifyApi.RecommendationsFromSeedsResponse]
    >;

    setRecommendationsState(
      results.reduce<State>(
        (res, [mood, recommendations]) => ({
          ...res,
          [mood.id]: recommendations,
        }),
        {}
      )
    );
  }

  /* Preload recommendations for all moods & reload when they change (only in player) */
  React.useEffect(() => {
    if (isSettings) return;

    if (areMoodsLoaded) {
      load();
    }
  }, [moods]);

  const contextValue = {
    getRecommendations,
    loadRecommendations,
  };

  return (
    <RecommendationsContext.Provider value={contextValue}>
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendations = (mood?: RecommendationsMood | null) => {
  const { getRecommendations, loadRecommendations } = React.useContext(
    RecommendationsContext
  );

  const [
    recommendations,
    setRecommendations,
  ] = React.useState<SpotifyApi.RecommendationsFromSeedsResponse>();

  async function load() {
    if (mood) {
      setRecommendations(await loadRecommendations(mood));
    }
  }

  React.useEffect(() => {
    if (!mood) return;

    if (ableToPlay(mood)) {
      // Clear recommendations from previous mood
      setRecommendations(undefined);

      load();
    }
  }, [mood]);

  const recommendationsCount = recommendations?.seeds.reduce(
    (res, seed) => res + seed.afterFilteringSize,
    0
  );

  return { recommendations, recommendationsCount, getRecommendations };
};
