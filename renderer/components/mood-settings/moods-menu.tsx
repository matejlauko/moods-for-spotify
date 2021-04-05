import { MoodsList, useMoods } from '@/moods';
import { styled } from '@/styles';
import { Button as BaseButton } from '@/ui';
import * as React from 'react';

const MAX_MOODS = 20;

const MoodsMenu = () => {
  const {
    state: { moods },
    actions: { addMood },
  } = useMoods();

  return (
    <Container>
      <MoodsList withManagement>
        {moods.length <= MAX_MOODS && (
          <AddMoodButton
            onClick={() => addMood()}
            aria-label="Add Mood"
            new={moods.length === 0}
          >
            +
          </AddMoodButton>
        )}
      </MoodsList>

      {moods.length === 0 && (
        <NoMoods>
          <Pointer>👆</Pointer>
          <br />
          Add your first mood
        </NoMoods>
      )}
    </Container>
  );
};

export default MoodsMenu;

const Container = styled('div', {
  mb: '$2',
});

const AddMoodButton = styled(BaseButton, {
  lineHeight: '1',
  fontWeight: '300',
  borderRadius: '$full',
  borderWidth: '1px',
  borderColor: '$white',
  ml: '$2',

  '&:hover': {
    bg: '$bg_hover_reversed',
    color: '$text_reversed',
  },

  variants: {
    new: {
      true: {
        size: '$10',
        fontSize: '32px',
      },
      false: {
        size: '$6',
        fontSize: '20px',
      },
    },
  },
});

const NoMoods = styled('p', {
  textAlign: 'center',
  fontWeight: '$bold',
  fontSize: '$lg',
});

const Pointer = styled('span', {
  fontSize: '28px',
  display: 'inline-block',
  lineHeight: 1,
  m: '$2',
});
