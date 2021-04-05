import { useRouter } from 'next/router';
import * as React from 'react';
import { useErrorHandler } from './error-handler';

export const useOfflineCheck = () => {
  const handleError = useErrorHandler();
  const { pathname, query, replace } = useRouter();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    /* Redirect to app when back online */
    function handleOnline() {
      if (pathname === '/error' && query.error === 'offline') {
        replace('/home');
      }
    }

    /* Redirect to error when offline */
    function handleOffline() {
      handleError('offline');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pathname, query]);
};
