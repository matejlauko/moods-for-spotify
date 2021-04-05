import { useAppState } from '@/app-state';
import { LoginButton } from '@/auth';
import { styled } from '@/styles';
import { SupportingLayout } from '@/ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

const Login = () => {
  const { replace } = useRouter();
  const { isLoggedIn, setInitialized } = useAppState();

  React.useEffect(() => {
    if (isLoggedIn) {
      replace('/home');
      return;
    }
    setInitialized();
  }, []);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <SupportingLayout hasLoading>
        <Main>
          <Heading>Moods</Heading>
          <Description>The right music for your every mood</Description>

          <LoginButton />
        </Main>
      </SupportingLayout>
    </>
  );
};

export default Login;

const Main = styled('main', {
  display: 'grid',
  alignContent: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
});

const Heading = styled('h1', {
  m: '0',
});
const Description = styled('p', {
  mt: '0',
  fontSize: '$xl',
  mb: '$10',
});
