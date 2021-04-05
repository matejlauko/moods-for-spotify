import { shell } from 'electron';
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateStateHash,
} from './code';
import {
  REDIRECT_URI,
  SPOTIFY_AUTHORIZE_URL,
  SPOTIFY_SCOPES,
} from './constants';

export async function authorize() {
  const codeVerifier = generateCodeVerifier();
  const state = generateStateHash();
  const code_challenge = await generateCodeChallenge(codeVerifier);

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge,
    state,
    scope: encodeURIComponent(SPOTIFY_SCOPES.join(' ')),
  });

  shell.openExternal(`${SPOTIFY_AUTHORIZE_URL}?${params}`);
}
