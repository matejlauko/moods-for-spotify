import { logReducer } from '@/utils/log-reducer';
import * as React from 'react';
import { Mood } from './mood';
import { initialState, moodsReducer, MoodsState } from './state';
import * as moodsStore from './store';

interface MoodsContextValue {
  state: MoodsState;
  actions: {
    addMood: () => void;
    deleteCurrentMood: () => void;
    updateCurrentMood: (mood: Partial<Mood>) => void;
    setCurrentMood: (id: number) => void;
  };
  currentMood: Mood | null;
}

// @ts-ignore no default val
const MoodsContext = React.createContext<MoodsContextValue>();

interface Props {
  onInit?: () => void;
  isSettings?: boolean;
}

export const MoodsProvider: React.FC<Props> = ({
  onInit,
  isSettings,
  children,
}) => {
  const [state, dispatch] = React.useReducer(
    logReducer(moodsReducer),
    initialState
  );

  async function loadMoods() {
    dispatch({
      type: 'MODES_LOADED',
      moods: moodsStore.loadMoods(),
      isSettings: !!isSettings,
    });

    onInit && onInit();
  }

  const currentMood = React.useMemo(
    () =>
      (state.currentMoodId &&
        state.moods.find(({ id }) => id === state.currentMoodId)) ||
      null,
    [state.moods, state.currentMoodId]
  );

  /* Init moods on mount */
  React.useEffect(() => {
    loadMoods();
  }, []);

  /* Subscribe to moods updates and update state (only in player) */
  React.useEffect(() => {
    if (isSettings) return;

    return moodsStore.subscribe((moods) =>
      dispatch({
        type: 'MODES_LOADED',
        moods,
        isSettings: false, // reset currentMood
      })
    );
  }, []);

  /* Save moods to store when they change (only in settings) */
  React.useEffect(() => {
    if (!isSettings || !state.isLoaded) return;

    if (moodsStore.moodsChanged(state.moods)) {
      moodsStore.saveMoods(state.moods);
    }
  }, [state.moods]);

  const actions: MoodsContextValue['actions'] = {
    addMood: () => dispatch({ type: 'MODE_ADD' }),
    deleteCurrentMood: () => dispatch({ type: 'MODE_DELETE' }),
    updateCurrentMood: (mood) => dispatch({ type: 'MODE_UPDATE', mood }),
    setCurrentMood: (id) => dispatch({ type: 'SET_CURRENT_MODE', id }),
  };

  const contextValue = {
    state,
    actions,
    currentMood,
  };

  return (
    <MoodsContext.Provider value={contextValue}>
      {children}
    </MoodsContext.Provider>
  );
};

export const useMoods = () => React.useContext<MoodsContextValue>(MoodsContext);
