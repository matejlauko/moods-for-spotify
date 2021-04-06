import { styled } from '@/styles';
import { SupportingLayout } from '@/ui';
import { ErrorType, ErrorTypes } from '@/utils/error-handler';
import { shell } from 'electron';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as React from 'react';

const Error = () => {
  const {
    query: { error },
    replace,
    back,
  } = useRouter();

  const knownError = ErrorTypes[error as ErrorType];

  const redirectHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    // When app reloaded on error page
    if (window.history?.length === 1) {
      replace((event.target as HTMLAnchorElement).getAttribute('href')!);
      return;
    }

    back();
  };

  const redirectToSpotify = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    shell.openExternal('https://www.spotify.com/premium/');
  };

  return (
    <>
      <Head>
        <title>Error 🙈</title>
      </Head>

      <SupportingLayout>
        <Container>
          <h1>Error</h1>
          <Message>{knownError?.message || error}</Message>

          {error === 'non_premium' && (
            <>
              <Link href="/home" onClick={redirectToSpotify}>
                Spotify Premium
              </Link>
              <br />
              <br />
            </>
          )}

          <Link href="/home" onClick={redirectHome}>
            Try again
          </Link>
        </Container>
      </SupportingLayout>
    </>
  );
};

export default Error;

const Container = styled('div', {
  p: '$4',
});

const Message = styled('pre', {
  whiteSpace: 'normal',
  userSelect: 'text',
});

const Link = styled('a', {
  '&:hover': {
    color: '$spotify',
  },
});
