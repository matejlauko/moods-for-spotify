import { RecommendationsMood } from '@/moods';

type States<Setting extends 'energy' | 'vocals' | 'positiveness'> = [
  RecommendationsMood[Setting],
  SpotifyApi.RecommendationsOptionsObject
][];

export const ENERGY_STATES: States<'energy'> = [
  [['low', 'low'], { max_energy: 0.3 }],
  [['low', 'medium'], { max_energy: 0.6 }],
  [['medium', 'medium'], { min_energy: 0.3, max_energy: 0.6 }],
  [['medium', 'max'], { min_energy: 0.3 }],
  [['max', 'max'], { min_energy: 0.6 }],
];

export const VOCAL_STATES: States<'vocals'> = [
  [['none', 'none'], { target_instrumentalness: 1.0 }],
  [['none', 'low'], { min_instrumentalness: 0.7 }],
  [['low', 'low'], { min_instrumentalness: 0.7, max_instrumentalness: 0.9 }],
  [['low', 'high'], { max_instrumentalness: 0.9 }],
  [['high', 'high'], { max_instrumentalness: 0.3 }],
];

export const POSITIVENESS_STATES: States<'positiveness'> = [
  [['sad', 'sad'], { max_valence: 0.3 }],
  [['sad', 'normal'], { max_valence: 0.6 }],
  [['normal', 'normal'], { min_valence: 0.3, max_valence: 0.6 }],
  [['normal', 'happy'], { min_valence: 0.3 }],
  [['happy', 'happy'], { min_valence: 0.6 }],
];
