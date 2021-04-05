import { useAppState } from '@/app-state';
import { Emoji } from '@/mood-settings';
import { usePlayer } from '@/player';
import { styled } from '@/styles';
import { Button as BaseButton } from '@/ui';
import * as React from 'react';
import DeleteMoodButton from './delete-button';
import { ableToPlay, Mood } from './mood';

interface Props {
  mood: Mood;
  isCurrent: boolean;
  onSelect: (id: number) => void;
  withManagement?: boolean;
}

const MoodItem: React.FC<Props> = ({
  mood,
  isCurrent,
  onSelect,
  withManagement,
}) => {
  const { isMiniMode } = useAppState();
  const player = usePlayer();

  const isAbleToPlay = ableToPlay(mood);

  const handleClick = async () => {
    if (player && !isAbleToPlay) return;

    onSelect(mood.id);

    if (player) {
      player.controls.play(mood);
    }
  };

  return (
    <Box inactive={!isCurrent}>
      <Button
        onClick={handleClick}
        unplayable={player && !isAbleToPlay}
        aria-label="Select mood"
        selected={withManagement && isCurrent}
      >
        <Emoji
          emoji={mood.emoji}
          size={
            withManagement || isMiniMode
              ? isCurrent
                ? 36
                : 28
              : isCurrent
              ? 56
              : 36
          }
        />
      </Button>

      {withManagement && <DeleteMoodButton />}
    </Box>
  );
};

export default MoodItem;

const Box = styled('div', {
  position: 'relative',
  transition: 'transform 0.2s ease-in-out',

  '&:hover .delete-mood': {
    opacity: 1,
  },

  variants: {
    inactive: {
      true: {
        '&:hover': {
          transform: 'scale(1.1)',
        },
      },
    },
  },
});

const Button = styled(BaseButton, {
  borderRadius: '$full',
  p: '$2',
  '&:hover': {
    bg: '$bg_hover',
  },
  '&:focus-visible': {
    boxShadow: '0 0 5px 1px $colors$spotify_focus',
  },
  variants: {
    size: {
      normal: {
        size: '$10',
      },
      active: {
        size: '$16',
      },
    },
    unplayable: {
      true: {
        cursor: 'not-allowed',
        '&:focus-visible': { boxShadow: 'none' },
      },
    },
    selected: {
      true: {
        boxShadow: '0 0 5px 1px $colors$spotify_focus',
      },
    },
  },
});
