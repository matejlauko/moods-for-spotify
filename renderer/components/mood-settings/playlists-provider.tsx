import { useApiQuery } from '@/libs/api';
import * as React from 'react';

// @ts-ignore
const PlaylistsContext = React.createContext<
  SpotifyApi.PlaylistObjectSimplified[]
>();

export const PlaylistsProvider: React.FC = ({ children }) => {
  const query = useApiQuery();
  const [playlists, setPlaylists] = React.useState<
    SpotifyApi.PlaylistObjectSimplified[]
  >([]);

  async function load() {
    const playlistsPayload = await query((api) =>
      // @ts-ignore
      api.getUserPlaylists({ limit: 50 })
    );

    if (playlistsPayload?.items) {
      setPlaylists(playlistsPayload.items);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <PlaylistsContext.Provider value={playlists}>
      {children}
    </PlaylistsContext.Provider>
  );
};

export const usePlaylists = () => React.useContext(PlaylistsContext);
