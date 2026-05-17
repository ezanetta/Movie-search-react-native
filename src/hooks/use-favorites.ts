import { useCallback, useEffect, useState } from 'react';

import { FavMovie } from '@/domain/movie';
import { getFavorites, saveFavorites } from '@/storage/favorites';

interface UseFavoritesResult {
  favorites: FavMovie[];
  isFavorite: (imdbID: string) => boolean;
  toggle: (movie: FavMovie) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<FavMovie[]>([]);

  const refresh = useCallback(async () => {
    const data = await getFavorites();
    setFavorites(data);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorite = useCallback(
    (imdbID: string) => favorites.some(m => m.imdbID === imdbID),
    [favorites]
  );

  const toggle = useCallback(
    async (movie: FavMovie) => {
      const updated = favorites.some(m => m.imdbID === movie.imdbID)
        ? favorites.filter(m => m.imdbID !== movie.imdbID)
        : [...favorites, movie];
      setFavorites(updated);
      await saveFavorites(updated);
    },
    [favorites]
  );

  return { favorites, isFavorite, toggle, refresh };
}
