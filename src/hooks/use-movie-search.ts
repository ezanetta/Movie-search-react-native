import { useEffect, useRef, useState } from 'react';

import { MovieSummary } from '@/domain/movie';
import { searchMovies } from '@/services/omdb';

const DEBOUNCE_MS = 400;

interface State {
  movies: MovieSummary[];
  loading: boolean;
  error: string | null;
}

export function useMovieSearch(query: string): State {
  const [state, setState] = useState<State>({ movies: [], loading: false, error: null });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setState({ movies: [], loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    timerRef.current = setTimeout(async () => {
      try {
        const movies = await searchMovies(query);
        setState({ movies, loading: false, error: null });
      } catch {
        setState({ movies: [], loading: false, error: 'Search failed. Please try again.' });
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return state;
}
