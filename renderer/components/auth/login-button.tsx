import { useStartLogin } from '@/libs/auth';
import { styled } from '@/styles';
import { Button as BaseButton } from '@/ui';
import * as React from 'react';

const LoginButton: React.FC = () => {
  const login = useStartLogin();

  return (
    <Button role="link" onClick={() => login()}>
      <img
        src="/images/spotify-icon-white.png"
        width="20px"
        height="20px"
        alt="Spotify"
      />
      Login to Spotify
    </Button>
  );
};

export default LoginButton;

const Button = styled(BaseButton, {
  bg: '$spotify',
  fontSize: '$lg',
  borderRadius: '500px',
  height: '$12',
  px: '$8',
  minWidth: '250px',

  '&:hover': {
    bg: '$spotify_hover',
  },

  '& img': {
    mr: '$2',
  },
});
