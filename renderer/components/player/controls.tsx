import { styled } from '@/styles';
import { Button as BaseButton, Icon } from '@/ui';
import * as React from 'react';
import PlayButton from './play-button';
import { usePlayer } from './player-provider';
import Repeat from './repeat';

const Controls: React.FC = () => {
  const { state, controls } = usePlayer();

  if (!state.activeDeviceId) {
    return (
      <>
        <div>
          <Pointer>👈</Pointer>
          <strong>Open Spotify</strong>
        </div>
        <div />
      </>
    );
  }

  return (
    <>
      <ControlsContainer>
        <PrevButton onClick={() => controls.prev()} />

        <PlayButton />

        <NextButton onClick={() => controls.next()} />
      </ControlsContainer>

      <ControlsContainer css={{ justifySelf: 'start', ml: '$2' }}>
        <Repeat />
      </ControlsContainer>
    </>
  );
};

export default Controls;

const ControlsContainer = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  placeItems: 'center',
});

interface Props {
  onClick: () => void;
  isPlaying?: boolean;
}

export const PrevButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <Icon size="5">
        <path
          d="M19.7563 20.7085L9.75635 12.7085L19.7563 4.7085V20.7085Z"
          fill="#fff"
        />
        <path
          d="M5.75635 19.7085V5.7085"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    </Button>
  );
};

export const NextButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <Icon size="5">
        <path
          d="M5.67566 4.39087L15.6757 12.3909L5.67566 20.3909V4.39087Z"
          fill="#fff"
        />
        <path
          d="M19.6757 5.39087V19.3909"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Icon>
    </Button>
  );
};

const Button = styled(BaseButton, {
  px: '$2',
  opacity: 0.7,

  '&:hover': {
    transform: 'scale(1.05)',
    opacity: 1,
  },
});

const Pointer = styled('span', {
  fontSize: '28px',
  lineHeight: 1,
  verticalAlign: 'middle',
  display: 'inline-block',
  m: '$2',
});
