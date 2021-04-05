import packageConfig from '../../../package.json';

export const SPOTIFY_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize';
export const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';

export const SPOTIFY_SCOPES = [
  // Current Playback
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-recently-played',
  // List Playlists
  'playlist-read-private',
  // Like Song
  'user-library-modify',
  // Recommendations
  'user-top-read', // recommend based on top song
  'user-library-read', // recommend based on saved songs
];

const APP_PROTOCOL = packageConfig.build.protocols.schemes[0];
export const REDIRECT_URI = `${APP_PROTOCOL}://callback`;
