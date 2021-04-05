import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import { BASE_URL, IS_PROD } from './constants';
import { initDeepLinks } from './links';
import { MAIN_WINDOW_OPTIONS, WINDOW_SIZES } from './setup';
import { initStore } from './store';
import {
  getWindowPosition,
  saveWindowState,
  setupDisplayHandlers,
} from './window';

let mainWindow: BrowserWindow;

function getOrCreateMainWindow(create = true) {
  if (create && (!mainWindow || BrowserWindow.getAllWindows().length === 0)) {
    mainWindow = new BrowserWindow({
      ...MAIN_WINDOW_OPTIONS,
      ...getWindowPosition(),
    });

    mainWindow.on('close', () => saveWindowState(mainWindow));
  }

  return mainWindow;
}

function loadWindow(window: BrowserWindow, url: string) {
  log.debug('[window] loading url', url);

  if (IS_PROD) {
    return window.loadURL(`${BASE_URL}${url}.html`);
  } else {
    return window.loadURL(`${BASE_URL}${url}`);
  }
}

initDeepLinks(() => getOrCreateMainWindow(false));

async function loadApp() {
  await app.whenReady();

  getOrCreateMainWindow();

  initStore(mainWindow);

  setupDisplayHandlers(mainWindow);

  await loadWindow(mainWindow, '/home');

  /* Make sure window is created at activate */
  app.on('activate', () => {
    getOrCreateMainWindow();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const urlSplit = url.split('/');
    const winName = urlSplit[urlSplit.length - 1].replace('.html', '');

    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        minimizable: false,
        ...WINDOW_SIZES[winName],
      },
    };
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  log.info("[app] don't got the lock -> quiting");
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      log.info('[window] focusing second instance');

      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  loadApp();
}

app.on('window-all-closed', () => {
  app.quit();
});
