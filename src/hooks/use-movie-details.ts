import { useEffect, useState } from 'react';

import { Movie } from '@/domain/movie';
import { getMovieDetails } from '@/services/omdb';

interface State {
  movie: Movie | null;
  loading: boolean;
  error: string | null;
}

export function useMovieDetails(imdbID: string): State {
  const [state, setState] = useState<State>({ movie: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    setState({ movie: null, loading: true, error: null });

    getMovieDetails(imdbID)
      .then(movie => {
        if (!cancelled) setState({ movie, loading: false, error: null });
      })
      .catch(() => {
        if (!cancelled)
          setState({ movie: null, loading: false, error: 'Failed to load movie details.' });
      });

    return () => {
      cancelled = true;
    };
  }, [imdbID]);

  return state;
}
