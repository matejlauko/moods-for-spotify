import { BrowserWindow, ipcMain } from 'electron';
import log from 'electron-log';
import Store from 'electron-store';
import { Mood } from '../renderer/components/moods';

interface StoreData {
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  moods: Mood[];
}

const store = new Store<StoreData>({ name: 'data' });

export function initStore(mainWindow: BrowserWindow) {
  // Listen to 'store-get' events from renderer
  ipcMain.on('store-get', (event, key: keyof StoreData) => {
    // Retrieve data from store
    const data = store.get(key);

    // log.debug(`[store] retrieving ${key} =>`, data);
    log.debug(`[store] retrieving ${key}`);

    // Return the data to the event emitter (or empty obj)
    event.returnValue = data;
  });

  // Listen to 'store-set' events from renderer
  ipcMain.on(
    'store-set',
    (_event, entry: [keyof StoreData, StoreData[keyof StoreData]]) => {
      if (!Array.isArray(entry)) {
        log.error(
          '[store] setting data in wrong format, must be tuple [key, data]'
        );
        return;
      }

      const [key, data] = entry;

      log.debug(`[store] setting ${key} =>`, data);

      // Save data to store under key
      store.set(key, data);

      // Emit 'store-saved' event to the main window - to update moods in player
      mainWindow.webContents.send('store-saved', entry);
    }
  );
}
