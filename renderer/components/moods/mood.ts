export enum MoodConfigType {
  PLAYLIST = 'playlist',
  RECOMMEND = 'recommend',
}

export interface PlaylistMood {
  id: number;
  emoji: string;
  configType: MoodConfigType.PLAYLIST;
  playlistId?: string;
}

export type MoodEnergy = 'low' | 'medium' | 'max';
export const MoodEnergyVals: MoodEnergy[] = ['low', 'medium', 'max'];

export type MoodVocals = 'none' | 'low' | 'high';
export const MoodVocalVals: MoodVocals[] = ['none', 'low', 'high'];

export type MoodPositiveness = 'sad' | 'normal' | 'happy';
export const MoodPositivenessVals: MoodPositiveness[] = [
  'sad',
  'normal',
  'happy',
];

export interface RecommendationsMood {
  id: number;
  emoji: string;
  configType: MoodConfigType.RECOMMEND;
  genre?: string;
  artist?: { id: string; name: string };
  energy?: [MoodEnergy, MoodEnergy];
  vocals?: [MoodVocals, MoodVocals];
  positiveness?: [MoodPositiveness, MoodPositiveness];
}

export type Mood = PlaylistMood | RecommendationsMood;
export const isPlaylistMood = (mood: Mood): mood is PlaylistMood =>
  mood.configType === MoodConfigType.PLAYLIST;

export const ableToPlay = (mood: Mood) =>
  (isPlaylistMood(mood) && !!mood.playlistId) ||
  (!isPlaylistMood(mood) && !!(mood.genre || mood.artist));
