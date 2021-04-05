import { useAppState } from '@/app-state';
import { About, Contact } from '@/help';
import { Profile } from '@/profile';
import { styled } from '@/styles';
import { PageLayout } from '@/ui';
import Head from 'next/head';
import * as React from 'react';

const AboutPage = () => {
  const { isLoggedIn, setInitialized } = useAppState();

  return (
    <>
      <Head>
        <title>About Moods</title>
      </Head>

      <PageLayout title="About">
        <Main>
          <Section>
            <About />
          </Section>

          {isLoggedIn && (
            <Section>
              <Heading>Profile</Heading>
              <Profile onInit={setInitialized} />
            </Section>
          )}

          <Section>
            <Heading>Contact</Heading>
            <Contact />
          </Section>
        </Main>
      </PageLayout>
    </>
  );
};

export default AboutPage;

const Main = styled('main', {
  display: 'grid',
  justifyContent: 'center',
  px: '$4',
  py: '$4',
  userSelect: 'text',
});

const Section = styled('div', {
  fontSize: '$sm',

  '&:not(:last-child)': {
    mb: '$10',
  },
});
const Heading = styled('h2', {
  fontSize: '$md',
  mt: '0',
  textAlign: 'center',
});
