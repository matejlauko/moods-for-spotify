import { useApiQuery } from '@/libs/api';
import * as React from 'react';

// @ts-ignore
const GenresContext = React.createContext<string[]>();

export const GenresProvider: React.FC = ({ children }) => {
  const query = useApiQuery();
  const [genres, setGenres] = React.useState<string[]>([]);

  async function load() {
    const genresPayload = await query((api) => api.getAvailableGenreSeeds());

    if (genresPayload?.genres) {
      setGenres(genresPayload.genres);
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>
  );
};

export const useGenres = () => React.useContext(GenresContext);
