import log from '@/utils/logger';
import { useRouter } from 'next/router';
import * as React from 'react';
import { authorize } from './authorize';
import { loadCodeVerifier, loadStateHash } from './code';
import * as authStore from './store';
import { requestToken } from './token';

export const useStartLogin = () => {
  function login() {
    try {
      authorize();
      log.info('[auth][authorization] started');
    } catch (error) {
      log.error('[auth][authorization]', error);
    }
  }

  return login;
};

function checkState(state?: string) {
  const savedState = loadStateHash();

  if (!state || !savedState) {
    throw new Error('state missing');
  }

  if (savedState !== state) {
    throw new Error("state hash doesn't match");
  }
}

async function retrieveToken(code?: string) {
  if (!code) {
    throw new Error('code missing');
  }
  const codeVerifier = loadCodeVerifier();
  if (!codeVerifier) {
    throw new Error('codeVerifier missing');
  }

  const payload = await requestToken({
    code,
    codeVerifier,
  });

  log.debug('[auth][token] retrieved', { payload });
}

export const useLoginCallback = ({
  code,
  state,
  error,
}: {
  code?: string;
  state?: string;
  error?: string;
}) => {
  const { replace } = useRouter();

  async function handleCallback() {
    log.info('[auth][callback] handling');

    try {
      if (error) {
        throw new Error(error);
      }

      checkState(state);
      await retrieveToken(code);

      replace({ pathname: '/home', query: { login: 1 } });
    } catch (error) {
      log.error('[auth][callback]', error);
    }
  }

  React.useEffect(() => {
    // Handle when query parameters appear
    if (code || error) {
      handleCallback();
    }
  }, [code, state, error]);
};

export const useLogout = () => {
  const { push } = useRouter();

  function logout() {
    authStore.saveAuth(null);

    if (window.opener) {
      window.opener.push && window.opener.push('/login');
      window.close();
    } else {
      push('/login');
    }
  }

  return logout;
};
