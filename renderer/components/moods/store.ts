import log from '@/utils/logger';
import equal from 'deep-equal';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import { Mood, MoodConfigType } from './mood';

const initialMoods: Mood[] = [
  {
    id: 1,
    emoji: 'guitar',
    configType: MoodConfigType.PLAYLIST,
    playlistId: '3HzoQP1aQwrLB5VqxUgVO5',
  },
  {
    id: 2,
    emoji: 'cool',
    configType: MoodConfigType.RECOMMEND,
    genre: 'house',
    energy: ['low', 'max'],
  },
  {
    id: 3,
    emoji: 'headphones',
    configType: MoodConfigType.RECOMMEND,
    artist: {
      id: '2cusgVvXlY17oMoDAbcdqD',
      name: 'something',
    },
  },
];

export function loadMoods(): Mood[] {
  if (!ipcRenderer) return [];

  const state = ipcRenderer.sendSync('store-get', 'moods') as Mood[];

  log.debug('[moods][state-store] loaded', { state });

  return state || [];
}

export function saveMoods(moods: Mood[]) {
  log.debug('[moods][state-store] saving', { moods });

  ipcRenderer.send('store-set', ['moods', moods]);
}

export function subscribe(cb: (moods: Mood[]) => void) {
  const listener = (_event: IpcRendererEvent, entry: [string, Mood[]]) => {
    // Wrong event arg
    if (!Array.isArray(entry) || entry[0] !== 'moods') return;

    cb(entry[1]);
  };

  ipcRenderer.on('store-saved', listener);

  return () => {
    ipcRenderer.off('store-saved', listener);
  };
}

export function moodsChanged(moods: Mood[]) {
  const savedMoods = loadMoods();

  return !equal(savedMoods, moods);
}
