import AppState from '@/app-state';
import log from '@/utils/logger';
import { useOfflineCheck } from '@/utils/offline';
import { globalStyles } from '@/styles';
import { AppProps } from 'next/app';
import * as React from 'react';

log.transports.console.level = 'debug';

function App({ Component, pageProps }: AppProps) {
  useOfflineCheck();
  globalStyles();

  return (
    <AppState>
      <Component {...pageProps} />
    </AppState>
  );
}

export default App;
