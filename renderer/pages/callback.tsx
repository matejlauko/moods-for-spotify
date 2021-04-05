import { useAppState } from '@/app-state';
import { useLoginCallback } from '@/libs/auth';
import { styled } from '@/styles';
import { SupportingLayout } from '@/ui';
import { useRouter } from 'next/router';
import * as React from 'react';

const Callback = () => {
  const { query } = useRouter();
  const { replace } = useRouter();
  const { isLoggedIn } = useAppState();

  useLoginCallback({
    code: query?.code as string,
    state: query?.state as string,
    error: query?.error as string,
  });

  React.useEffect(() => {
    if (isLoggedIn) {
      replace('/home');
    }
  }, []);

  return (
    <SupportingLayout>
      <Main>
        <Heading>Moods</Heading>

        <Status>
          <img
            src="/images/spotify-icon-white.png"
            width="20px"
            height="20px"
            alt="Spotify"
          />
          Logging in...
        </Status>
      </Main>
    </SupportingLayout>
  );
};

export default Callback;

const Main = styled('main', {
  display: 'grid',
  alignContent: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
});
const Heading = styled('h1', {
  mt: '0',
});

const Status = styled('div', {
  fontSize: '$lg',
  borderRadius: '500px',
  height: '$12',
  px: '$8',
  minWidth: '250px',
  borderColor: '$spotify',
  borderWidth: '2px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '& img': {
    mr: '$2',
  },
});
