import log from '@/utils/logger';
import { request } from '@/libs/api';
import Router from 'next/router';
import { REDIRECT_URI, SPOTIFY_TOKEN_URL } from './constants';
import * as authStore from './store';

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

let tokenRefreshinPromise: Promise<TokenResponse> | null = null;

export async function getToken() {
  const { accessToken, expiresAt } = authStore.loadAuth();

  if (!accessToken || expiresAt === null) {
    log.info('[auth][token] access token not in store');

    return null;
  }

  if (expiresAt <= Date.now() + 1000 * 30) {
    log.info('[auth][token] refreshing');

    try {
      /**
       * If two requests tried to refresh token at the same time it would fail
       * This ensoures theres every only one token refresh in progress
       * tokenRefreshinPromise var is cleaned after refresh finishes
       */
      if (!tokenRefreshinPromise) {
        tokenRefreshinPromise = requestTokenRefresh();
      }

      return (await tokenRefreshinPromise).accessToken;
    } catch (error) {
      log.error('[auth][token] refreshing -> clearing auth store', error);
      authStore.saveAuth(null);
      Router.push('/login');
    } finally {
      tokenRefreshinPromise = null;
    }
  }

  return accessToken || null;
}

/* Requests */

interface TokenData {
  access_token: string; // An access token that can be provided in subsequent calls to Spotify’s Web API.
  token_type: string; // How the access token may be used: always “Bearer”.
  scope: string; // A space-separated list of scopes which have been granted for this access_token
  expires_in: number; //	The time period (in seconds) for which the access token is valid.
  refresh_token: string; // A token that can be sent to the Spotify Accounts service in place of an authorization code.
}

interface RequestTokenBody {
  client_id: string; // The client ID for your app, available from the developer dashboard.
  grant_type: 'authorization_code'; // This field must contain the value authorization_code.
  code: string; // The authorization code obtained in step 3.
  redirect_uri: string; // The value of this parameter must match the value of the redirect_uri parameter your app supplied when requesting the authorization code.
  code_verifier: string; // The value of this parameter must match the value of the code_verifier that your app generated in step 1.
}

export async function requestToken({
  code,
  codeVerifier,
}: {
  code: string;
  codeVerifier: string;
}) {
  const payload = await request<TokenData, RequestTokenBody>({
    uri: SPOTIFY_TOKEN_URL,
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    },
  });

  return handleTokenResponse(payload);
}

interface RefreshTokenBody {
  grant_type: 'refresh_token'; // Set it to refresh_token.
  refresh_token: string; // The refresh token returned from the authorization code exchange.
  client_id: string; // The client ID for your app, as displayed in the developer dashboard.
}

export async function requestTokenRefresh() {
  const { refreshToken } = authStore.loadAuth();

  if (!refreshToken) {
    throw new Error("refresh token not in store -> can't refresh auth token");
  }

  const payload = await request<TokenData, RefreshTokenBody>({
    uri: SPOTIFY_TOKEN_URL,
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: {
      client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    },
  });

  return handleTokenResponse(payload);
}

function handleTokenResponse(payload?: TokenData): TokenResponse {
  if (!payload?.access_token) {
    throw new Error('missing acces token in request token response');
  }

  authStore.saveAuth({
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresIn: payload.expires_in,
  });

  return {
    accessToken: payload.access_token,
    refreshToken: payload?.refresh_token,
    expiresIn: payload?.expires_in,
  };
}
