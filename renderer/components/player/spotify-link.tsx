import { useAppState } from '@/app-state';
import { styled } from '@/styles';
import { shell } from 'electron';
import * as React from 'react';
import { usePlayer } from './player-provider';

const SpotifyLink: React.FC = () => {
  const {
    state: { currentPlayback },
  } = usePlayer();
  const { isMiniMode } = useAppState();

  const url = React.useMemo(() => {
    if (currentPlayback?.context) {
      return currentPlayback.context.uri;
    }

    if (currentPlayback?.item) {
      return currentPlayback?.item.uri;
    }

    return 'spotify://';
  }, [currentPlayback]);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    shell.openExternal(url);
  };

  return (
    <Box>
      <Link
        href={url}
        target="_blank"
        aria-label="Open Spotify"
        onClick={handleClick}
      >
        {isMiniMode ? (
          <img
            src="/images/spotify-icon-green.png"
            width="24px"
            height="24px"
            alt="Spotify"
          />
        ) : (
          <img
            src="/images/spotify-logo-green.png"
            width="80px"
            height="24px"
            alt="Spotify"
          />
        )}
      </Link>
    </Box>
  );
};

export default SpotifyLink;

const Box = styled('div', {
  display: 'flex',
});

const Link = styled('a', {
  p: '$2',
  borderRadius: '$def',
  '&:hover': {
    bg: '$bg_hover',
  },
});
