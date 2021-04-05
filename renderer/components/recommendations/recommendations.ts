import { useApiQuery } from '@/libs/api';
import { RecommendationsMood } from '@/moods';
import { ENERGY_STATES, POSITIVENESS_STATES, VOCAL_STATES } from './config';

export function useRecommendationsQuery(limit?: number) {
  const query = useApiQuery();

  function queryRecommendations(mood: RecommendationsMood) {
    return query((api) =>
      api.getRecommendations(getRecommendationOptions(mood, limit))
    );
  }

  return queryRecommendations;
}

export function getRecommendationOptions(
  mood: RecommendationsMood,
  limit: number = 5
): SpotifyApi.RecommendationsOptionsObject {
  let options: SpotifyApi.RecommendationsOptionsObject = { limit };

  if (mood.genre) {
    options.seed_genres = [mood.genre];
  }
  if (mood.artist) {
    options.seed_artists = [mood.artist.id];
  }
  if (mood.energy) {
    const stateConfig =
      ENERGY_STATES.find(
        ([vals]) => vals![0] == mood.energy![0] && vals![1] === mood.energy![1]
      )?.[1] || {};
    options = { ...options, ...stateConfig };
  }
  if (mood.vocals) {
    const stateConfig =
      VOCAL_STATES.find(
        ([vals]) => vals![0] == mood.vocals![0] && vals![1] === mood.vocals![1]
      )?.[1] || {};
    options = { ...options, ...stateConfig };
  }
  if (mood.positiveness) {
    const stateConfig =
      POSITIVENESS_STATES.find(
        ([vals]) =>
          vals![0] == mood.positiveness![0] &&
          vals![1] === mood.positiveness![1]
      )?.[1] || {};
    options = { ...options, ...stateConfig };
  }

  return options;
}
