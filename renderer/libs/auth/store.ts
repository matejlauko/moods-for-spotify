import log from '@/utils/logger';
import { ipcRenderer } from 'electron';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}
const emptyState = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

export function loadAuth(): AuthState {
  if (!ipcRenderer) return emptyState;

  const state = ipcRenderer.sendSync('store-get', 'auth') as AuthState;

  log.debug('[auth][state-store] loaded', { state });

  return state || emptyState;
}

export function saveAuth(
  state: (Omit<AuthState, 'expiresAt'> & { expiresIn: number }) | null
) {
  const storedState: AuthState = state
    ? {
        ...state,
        expiresAt: Date.now() + state.expiresIn * 1000,
      }
    : emptyState;

  log.debug('[auth][state-store] saving', { storedState });

  ipcRenderer.send('store-set', ['auth', storedState]);
}
