import { useErrorHandler } from '@/utils/error-handler';
import { getToken } from '@/libs/auth';
import SpotifyWebApi from 'spotify-web-api-js';

const client = new SpotifyWebApi();
export type ApiClient = typeof client;

async function refreshAccess() {
  const accessToken = await getToken();

  if (!accessToken) {
    throw new Error('Missing access token to initialize Spotify API client');
  }

  client.setAccessToken(accessToken);
}

export const useApiQuery = () => {
  const handleError = useErrorHandler();

  async function query<Data = unknown>(
    queryFn: (apiClient: ApiClient) => Promise<Data | undefined>
  ) {
    try {
      await refreshAccess();

      return await queryFn(client);
    } catch (error) {
      handleError('query', error);
    }
  }

  return query;
};

export const useApiMutation = (callbacks?: {
  onResolve?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  cbDelay?: number;
}) => {
  const { onResolve, onSuccess, onError, cbDelay = 0 } = callbacks || {};
  const handleError = useErrorHandler();

  async function mutate<Response = unknown>(
    mutateFn: (apiClient: ApiClient) => Promise<Response>
  ) {
    try {
      await refreshAccess();

      const response = await mutateFn(client);
      onSuccess && setTimeout(onSuccess, cbDelay);

      return response;
    } catch (error) {
      handleError('mutation', error);
      onError && setTimeout(onError, cbDelay);
    } finally {
      onResolve && setTimeout(onResolve, cbDelay);
    }
  }

  return mutate;
};

// export function getApiClient() {
//   // const accessToken = await getToken();
//   // initApiClient(accessToken);

//   // if (!client.getAccessToken()) {
//   //   throw new Error('Spotify API client is not initialized with access token');
//   // }

//   return client;
// }
