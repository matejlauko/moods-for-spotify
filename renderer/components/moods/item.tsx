import { useAppState } from '@/app-state';
import { Emoji } from '@/mood-settings';
import { usePlayer } from '@/player';
import { styled, keyframes } from '@/styles';
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
        playing={!withManagement && isCurrent}
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

const playingAnim = keyframes({
  '0%': { transform: 'scale(0)' },
  '25%': { opacity: 0.4 },
  '50%': { transform: 'scale(1)' },
  '100%': { opacity: 0 },
});

const Button = styled(BaseButton, {
  position: 'relative',
  zIndex: 1,
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
        bg: '$bg_hover',
      },
    },
    playing: {
      true: {
        '&:after': {
          content: '""',
          position: 'absolute',
          top: 'calc(50% - 125% / 2)',
          left: 'calc(50% - 125% / 2)',
          width: '125%',
          height: '125%',
          bg: '$spotify_focus',
          borderRadius: '$full',
          zIndex: -1,
          opacity: 0,
          animation: `${playingAnim} 2s 0.25s infinite ease-out`,
        },
      },
    },
  },
});
