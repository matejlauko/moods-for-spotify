import { useAppState } from '@/app-state';
import { MiniHome } from '@/display';
import { MoodSettingsButton } from '@/mood-settings';
import { MoodsProvider } from '@/moods';
import {
  Controls,
  MoodsPlayer,
  PlayerProvider,
  SpotifyLink,
  Track,
} from '@/player';
import { RecommendationsProvider } from '@/recommendations';
import { styled } from '@/styles';
import { HomeLayout } from '@/ui';
import { useRouter } from 'next/router';
import * as React from 'react';

const Home = () => {
  const { replace } = useRouter();
  const { isLoggedIn, setInitialized, isMiniMode } = useAppState();

  React.useEffect(() => {
    if (!isLoggedIn) {
      replace('/login');
    }
  }, []);

  if (!isLoggedIn) return null;

  return (
    <MoodsProvider>
      <RecommendationsProvider>
        <PlayerProvider onInit={setInitialized}>
          <HomeLayout title={isMiniMode ? <SpotifyLink /> : null}>
            {isMiniMode ? (
              <MiniHome />
            ) : (
              <Main>
                <Track />

                <MoodsPlayer />

                <BottomBar>
                  <SpotifyLink />

                  <Controls />

                  <Right>
                    <MoodSettingsButton />
                  </Right>
                </BottomBar>
              </Main>
            )}
          </HomeLayout>
        </PlayerProvider>
      </RecommendationsProvider>
    </MoodsProvider>
  );
};

export default Home;

const Main = styled('main', {
  display: 'grid',
  height: '100%',
  gridTemplateRows: 'auto 1fr auto',
  // bg: '$bg_home',
});

const BottomBar = styled('div', {
  display: 'grid',
  gridTemplateColumns: '2fr auto 1fr 1fr',
  alignItems: 'center',
  alignSelf: 'end',
  px: '$4',
  py: '$2',
  bg: '$bg_bar',
  width: '100%',
  height: '$18',
});

const Right = styled('div', {
  justifySelf: 'end',
});
