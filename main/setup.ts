import { app, BrowserWindowConstructorOptions } from 'electron';
import log from 'electron-log';
import serve from 'electron-serve';
import { IS_PROD } from './constants';

log.transports.console.level = 'debug';

if (IS_PROD) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

export const MAIN_WINDOW_OPTIONS: BrowserWindowConstructorOptions = {
  visualEffectState: 'active',
  frame: false,
  transparent: true,
  titleBarStyle: 'hidden',
  autoHideMenuBar: true,
  fullscreenable: false,
  enableLargerThanScreen: false,
  maximizable: false,
  webPreferences: {
    nodeIntegration: true,
    nodeIntegrationInSubFrames: true,
    nativeWindowOpen: true,
    enablePreferredSizeMode: true,
    contextIsolation: false,
  },
};

export const WINDOW_SIZES: Record<
  string,
  Partial<BrowserWindowConstructorOptions>
> = {
  home: {
    minWidth: 400,
    minHeight: 300,
    width: 450,
    height: 350,
  },
  about: {
    resizable: false,
    width: 350,
    height: 530,
  },
  settings: {
    minWidth: 400,
    minHeight: 400,
    width: 600,
    height: 800,
  },
};
