import { useAppState } from '@/app-state';
import { MoodSettings, MoodsMenu } from '@/mood-settings';
import { MoodsProvider } from '@/moods';
import { styled } from '@/styles';
import { PageLayout } from '@/ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

const Settings = () => {
  const { replace } = useRouter();
  const { isLoggedIn, setInitialized } = useAppState();

  React.useEffect(() => {
    if (!isLoggedIn) {
      replace('/login');
    }
  }, []);

  if (!isLoggedIn) return null;

  return (
    <>
      <Head>
        <title>Settings</title>
      </Head>

      <MoodsProvider onInit={setInitialized} isSettings>
        <PageLayout hasLoading title="Settings">
          <Main>
            <MoodsMenu />

            <MoodSettings />
          </Main>
        </PageLayout>
      </MoodsProvider>
    </>
  );
};

export default Settings;

const Main = styled('main', {
  display: 'grid',
  height: '100%',
  gridTemplateRows: 'auto 1fr',
  p: '$4',
  pt: '$2',
  fontSize: '$sm',
  bg: '$bg_other',
});
