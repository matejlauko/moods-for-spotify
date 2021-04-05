import { app, BrowserWindow, shell } from 'electron';
import { Deeplink } from 'electron-deeplink';
import log from 'electron-log';
import { APP_PROTOCOL, BASE_URL, IS_PROD } from './constants';

export function initDeepLinks(getWindow: () => BrowserWindow) {
  const deeplink = new Deeplink({
    // @ts-ignore
    app,
    mainWindow: getWindow(),
    protocol: APP_PROTOCOL,
    isDev: !IS_PROD,
    debugLogging: true,
    electronPath: '/node_modules/electron/dist/Electron.app',
  });

  deeplink.on('received', (link: string) => {
    log.debug('[deep link] received', { link });
    shell.beep();

    if (link.includes('//callback')) {
      const query = new URL(link).search;
      const path = link.replace(`${APP_PROTOCOL}://`, '');
      let url = IS_PROD
        ? `${BASE_URL}/callback.html${query}`
        : `${BASE_URL}/${path}`;

      log.debug('[deep link] redirecting to', { url });

      getWindow().loadURL(url);
    }
  });
}
