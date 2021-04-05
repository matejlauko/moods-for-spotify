import { styled } from '@/styles';
import * as React from 'react';
import MoodItem from './item';
import { ableToPlay } from './mood';
import { useMoods } from './moods-provider';

interface Props {
  withManagement?: boolean;
}

const MoodsList: React.FC<Props> = ({ withManagement, children }) => {
  const {
    state: { moods },
    actions: { setCurrentMood },
    currentMood,
  } = useMoods();

  const activeMoods = withManagement
    ? moods
    : moods.filter((mood) => ableToPlay(mood));

  return (
    <MoodsRow>
      {activeMoods.map((mood) => (
        <MoodItem
          key={mood.id}
          mood={mood}
          isCurrent={mood.id === currentMood?.id}
          onSelect={setCurrentMood}
          withManagement={withManagement}
        />
      ))}

      {children}
    </MoodsRow>
  );
};

export default MoodsList;

const MoodsRow = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',

  '& div': {
    mx: '$1',
  },
});
