import log from '@/utils/logger';

const CODE_VERIFIER_KEY = 'code-verifier';
const STATE_HASH_KEY = 'state-hash';

function urlEncode(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function getRandomString() {
  return urlEncode(crypto.getRandomValues(new Uint8Array(96)));
}

export function generateCodeVerifier() {
  const codeVerifier = getRandomString();
  sessionStorage.setItem(CODE_VERIFIER_KEY, codeVerifier);
  log.debug('[auth][code-verifier] generated and saved', { codeVerifier });

  return codeVerifier;
}

export function loadCodeVerifier() {
  const codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
  sessionStorage.removeItem(CODE_VERIFIER_KEY);
  log.debug('[auth][code-verifier] loaded and cleaned', { codeVerifier });

  return codeVerifier;
}

export async function generateCodeChallenge(codeVerifier: string) {
  const codeVerifierBytes = new TextEncoder().encode(codeVerifier);
  const hashBuffer = await crypto.subtle.digest('SHA-256', codeVerifierBytes);
  return urlEncode(new Uint8Array(hashBuffer));
}

export function generateStateHash() {
  const stateHash = getRandomString();
  sessionStorage.setItem(STATE_HASH_KEY, stateHash);
  log.debug('[auth][state-hash] generated and saved', { stateHash });

  return stateHash;
}

export function loadStateHash() {
  const stateHash = sessionStorage.getItem(STATE_HASH_KEY);
  sessionStorage.removeItem(STATE_HASH_KEY);
  log.debug('[auth][state-hash] loaded and cleaned', { stateHash });

  return stateHash;
}
