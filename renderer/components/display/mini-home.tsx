import { MoodsPlayer, PlayButton } from '@/player';
import { styled } from '@/styles';
import * as React from 'react';

const MiniHome = () => {
  return (
    <Layout>
      <PlayButton />

      <MoodsPlayer />
    </Layout>
  );
};

export default MiniHome;

const Layout = styled('div', {
  display: 'grid',
  gridColumnGap: '$2',
  gridTemplateColumns: 'auto 1fr',
});
