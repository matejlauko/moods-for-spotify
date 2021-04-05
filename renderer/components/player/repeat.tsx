import { useApiMutation } from '@/libs/api';
import { styled } from '@/styles';
import { Button as BaseButton, Icon } from '@/ui';
import * as React from 'react';
import { usePlayer } from './player-provider';

const Repeat: React.FC = () => {
  const {
    state: { currentPlayback },
    refresh,
  } = usePlayer();

  const currentTrackId = currentPlayback?.item?.id;
  const isCurrentTrackRepeated = currentPlayback?.repeat_state === 'track';

  const mutateToggleRepeat = useApiMutation({
    onResolve: refresh,
    cbDelay: 250,
  });

  const handleClick = () => {
    if (!currentTrackId) return;

    mutateToggleRepeat((api) =>
      api.setRepeat(isCurrentTrackRepeated ? 'off' : 'track')
    );
  };

  return (
    <Button onClick={handleClick} active={isCurrentTrackRepeated}>
      <Icon size="5" color={isCurrentTrackRepeated ? '$spotify' : '#fff'}>
        <polyline points="17 1 21 5 17 9"></polyline>
        <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
        <polyline points="7 23 3 19 7 15"></polyline>
        <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
      </Icon>
    </Button>
  );
};

export default Repeat;

const Button = styled(BaseButton, {
  px: '$2',

  '&:hover': {
    transform: 'scale(1.05)',
    opacity: 1,
  },

  variants: {
    active: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0.7,
      },
    },
  },
});
