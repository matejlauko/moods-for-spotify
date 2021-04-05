import { BrowserWindow, ipcMain, Rectangle, screen } from 'electron';
import Store from 'electron-store';
import { MAIN_WINDOW_OPTIONS, WINDOW_SIZES } from './setup';

type WindowState = Pick<Rectangle, 'width' | 'height'> &
  Partial<Pick<Rectangle, 'x' | 'y'>>;

const store = new Store({ name: 'window-state' });

function loadPosition() {
  // return defaultSize;
  return store.get('home-size', WINDOW_SIZES['home']) as WindowState;
}

function windowWithinBounds(windowState: WindowState, bounds: Rectangle) {
  const { x = 0, y = 0, width = 0, height = 0 } = windowState;

  return (
    x >= bounds.x &&
    y >= bounds.y &&
    x + width <= bounds.x + bounds.width &&
    y + height <= bounds.y + bounds.height
  );
}

function resetToDefaults() {
  const bounds = screen.getPrimaryDisplay().bounds;
  const defaultSize = WINDOW_SIZES['home'];

  return Object.assign({}, defaultSize, {
    x: (bounds.width - (defaultSize.width || 0)) / 2,
    y: (bounds.height - (defaultSize.height || 0)) / 2,
  });
}

export function getWindowPosition() {
  const windowState = loadPosition();

  const visible = screen.getAllDisplays().some((display) => {
    return windowWithinBounds(windowState, display.bounds);
  });

  if (!visible) {
    // Window is partially or fully not visible now.
    // Reset it to safe defaults.
    return resetToDefaults();
  }

  return windowState;
}

export function getCurrentPosition(window: BrowserWindow): WindowState {
  const position = window.getPosition();
  const size = window.getSize();
  return {
    x: position[0],
    y: position[1],
    width: size[0],
    height: size[1],
  };
}

export function saveWindowState(window: BrowserWindow) {
  if (window.isMinimized() || window.isMaximized()) return;

  store.set('home-size', getCurrentPosition(window));
}

export function setupDisplayHandlers(window: BrowserWindow) {
  /* send focus event to renderer */
  window.on('focus', () => {
    window.webContents.send('focus');
  });

  ipcMain.on('pinned-get', (event) => {
    event.returnValue = window.isAlwaysOnTop();
  });

  ipcMain.handle('pinned-set', (_event, isPinned) => {
    window.setAlwaysOnTop(isPinned);
  });

  ipcMain.handle('minimode-set', (_event, isMini) => {
    if (isMini) {
      window.setMinimumSize(300, 100);
      window.setSize(420, 110, true);
    } else {
      window.setMinimumSize(400, 300);
      window.setSize(450, 350, true);
    }
  });

  // ipcMain.handle('size-set', (_event, size: number[]) => {
  //   console.log('setting size');
  //   const minSize = window.getMinimumSize();
  //   window.setMinimumSize(
  //     Math.ceil(size[0] < minSize[0] ? size[0] : minSize[0]),
  //     Math.ceil(size[1] < minSize[1] ? size[1] : minSize[1])
  //   );
  //   window.setSize(Math.ceil(size[0]), Math.ceil(size[1]), true);
  // });
}
