import { useAppState } from '@/app-state';
import { styled } from '@/styles';
import { Button as BaseButton, Icon } from '@/ui';
import * as React from 'react';
import { usePlayer } from './player-provider';

const PlayButton: React.FC = () => {
  const { state, controls } = usePlayer();
  const { isMiniMode } = useAppState();

  const isPlaying = !!state.currentPlayback?.is_playing;

  return (
    <Button onClick={() => (isPlaying ? controls.pause() : controls.play())}>
      {isPlaying ? (
        <Icon size={isMiniMode ? '10' : '12'} strokeWidth={1}>
          <circle cx="12" cy="12" r="10" fill="#fff" strokeWidth={0}></circle>
          <line x1="10" y1="15" x2="10" y2="9" stroke="black"></line>
          <line x1="14" y1="15" x2="14" y2="9" stroke="black"></line>
        </Icon>
      ) : (
        <Icon size={isMiniMode ? '10' : '12'} strokeWidth={0}>
          <circle cx="12" cy="12" r="10" fill="#fff"></circle>
          <polygon points="10 8 16 12 10 16 10 8" fill="black"></polygon>
        </Icon>
      )}
    </Button>
  );
};

export default PlayButton;

const Button = styled(BaseButton, {
  px: '$2',

  '&:hover': {
    transform: 'scale(1.05)',
    opacity: 1,
  },

  variants: {
    mini: {},
  },
});
