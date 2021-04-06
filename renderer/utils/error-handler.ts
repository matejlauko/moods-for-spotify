import log from '@/utils/logger';
import { useLogout } from '@/libs/auth';
import Router, { useRouter } from 'next/router';

export const ErrorTypes = {
  non_premium: {
    message:
      "Moods uses Spotify APIs which are only available to Spotify premium users. Please buy Spotify - it's worth it! Here:",
  },
  offline: {
    message:
      'This app requires the magic of the internet to work. Trying to reconnect..',
  },
  rate_limit: {
    message: 'Too many requests',
  },
  query: {
    message: 'Error fetching data',
  },
  mutation: {
    message: "Coudln't perform the action",
  },
} as const;

export type ErrorTypes = typeof ErrorTypes;
export type ErrorType = keyof ErrorTypes;

/* Make router "push" available on window - so child windows can use it */
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.push = Router.push;
}

export const useErrorHandler = () => {
  const { push } = useRouter();
  const logout = useLogout();

  function handleError(
    errorType: Exclude<ErrorType, 'query' | 'mutation'>,
    error?: Error | string
  ): void;
  function handleError(
    errorType: 'query' | 'mutation',
    error: Error | XMLHttpRequest
  ): void;
  function handleError(
    errorType: ErrorType,
    error?: Error | XMLHttpRequest | string
  ) {
    log.error(`[app] "${errorType}" error handled`, {
      request: error instanceof XMLHttpRequest ? error : null,
      error:
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : null,
      textErr: JSON.stringify(error),
    });

    if (error instanceof XMLHttpRequest) {
      // User is not logged in
      if (error.status === 401) {
        logout();
        return;
      }

      let responsePayload: Record<string, any> = {};
      try {
        responsePayload = JSON.parse(error.response);
      } catch (e) {
        /* noop */
      }

      // User doesn't have premium subscription (needed for Playback API)
      if (
        error.status === 403 &&
        responsePayload.error.reason === 'PREMIUM_REQUIRED'
      ) {
        push({ pathname: '/error', query: { error: 'non_premium' } });
        return;
      }

      if (error.status === 429) {
        push({ pathname: '/error', query: { error: 'rate_limit' } });
        return;
      }
    }

    if (errorType !== 'mutation') {
      // Redirect to error page where error message will be displayed
      push({ pathname: '/error', query: { error: errorType } });
    }
  }

  return handleError;
};
