import { styled } from '@/styles';
import * as React from 'react';

const About = () => {
  return (
    <Box>
      <img src="/images/logo.png" width="72px" height="72px" alt="Logo" />

      <div>
        <p>
          <strong>Moods for Spotify</strong>
        </p>
        <p>Version 0.1.0</p>
        <p>Copyright © 2021</p>
      </div>
    </Box>
  );
};

export default About;

const Box = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gridColumnGap: '$4',
  alignItems: 'center',

  '& p': {
    mt: '0',
    mb: '$1',
  },
});
