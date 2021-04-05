import { Mood, MoodConfigType, PlaylistMood } from './mood';

export type MoodsState = {
  moods: Mood[];
  isLoaded: boolean;
  currentMoodId: number | null;
};

export const initialState: MoodsState = {
  moods: [],
  isLoaded: false,
  currentMoodId: null,
};

export function moodsReducer(
  state: MoodsState,
  action:
    | { type: 'MODES_LOADED'; moods: Mood[]; isSettings: boolean }
    | { type: 'MODE_ADD' }
    | { type: 'MODE_DELETE' }
    | { type: 'MODE_UPDATE'; mood: Partial<Mood> }
    | { type: 'SET_CURRENT_MODE'; id: number }
): MoodsState {
  switch (action.type) {
    case 'MODES_LOADED': {
      return {
        ...state,
        moods: action.moods,
        currentMoodId: (action.isSettings && action.moods[0]?.id) || null,
        isLoaded: true,
      };
    }
    case 'MODE_ADD': {
      const newMood: PlaylistMood = {
        id: (state.moods[state.moods.length - 1]?.id || 0) + 1,
        emoji: ':sunglasses:',
        configType: MoodConfigType.PLAYLIST,
        playlistId: undefined,
      };
      return {
        ...state,
        moods: state.moods.concat(newMood),
        currentMoodId: newMood.id,
      };
    }
    case 'MODE_DELETE': {
      const moodIndex = state.moods.findIndex(
        (mood) => mood.id === state.currentMoodId
      );
      if (moodIndex === -1) return state;

      const updatedMoods = [...state.moods];
      updatedMoods.splice(moodIndex, 1);

      const nextOrPrevMood =
        state.moods[
          state.moods.length - 1 === moodIndex ? moodIndex - 1 : moodIndex + 1
        ];

      return {
        ...state,
        moods: updatedMoods,
        currentMoodId: nextOrPrevMood?.id || null,
      };
    }
    case 'MODE_UPDATE': {
      const moodIndex = state.moods.findIndex(
        (mood) => mood.id === state.currentMoodId
      );
      if (moodIndex === -1) return state;

      // Copy old
      let updatedMood = { ...state.moods[moodIndex] };

      // Add updated settings
      updatedMood = { ...updatedMood, ...action.mood } as Mood;

      return {
        ...state,
        moods: [
          ...state.moods.slice(0, moodIndex),
          updatedMood,
          ...state.moods.slice(moodIndex + 1),
        ],
      };
    }
    case 'SET_CURRENT_MODE': {
      return {
        ...state,
        currentMoodId: action.id,
      };
    }
    default: {
      return state;
    }
  }
}
