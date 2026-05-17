import { renderHook, waitFor } from '@testing-library/react-native';

import { useMovieDetails } from '@/hooks/use-movie-details';
import { getMovieDetails } from '@/services/omdb';

jest.mock('@/services/omdb');

const mockGet = getMovieDetails as jest.MockedFunction<typeof getMovieDetails>;

const mockMovie = {
  imdbID: 'tt0372784',
  Title: 'Batman Begins',
  Year: '2005',
  Rated: 'PG-13',
  Released: '15 Jun 2005',
  Runtime: '140 min',
  Genre: 'Action, Drama',
  Director: 'Christopher Nolan',
  Writer: 'Bob Kane',
  Actors: 'Christian Bale',
  Plot: 'After training with his mentor...',
  Language: 'English',
  Country: 'USA',
  Awards: 'Nominated for 1 Oscar',
  Poster: 'https://example.com/poster.jpg',
  imdbRating: '8.2',
  imdbVotes: '1,500,000',
  Type: 'movie',
};

beforeEach(() => mockGet.mockReset());

// ─── initial state ─────────────────────────────────────────────────────────────

describe('initial state', () => {
  it('starts with loading=true and movie=null', () => {
    // Never-resolving promise keeps the hook in loading state for the duration
    // of this synchronous test, preventing an out-of-act state update.
    mockGet.mockReturnValueOnce(new Promise(() => {}));
    const { result } = renderHook(() => useMovieDetails('tt0372784'));
    expect(result.current.loading).toBe(true);
    expect(result.current.movie).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

// ─── success ──────────────────────────────────────────────────────────────────

describe('success', () => {
  it('resolves movie data and clears loading', async () => {
    mockGet.mockResolvedValueOnce(mockMovie);
    const { result } = renderHook(() => useMovieDetails('tt0372784'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.movie).toEqual(mockMovie);
      expect(result.current.error).toBeNull();
    });
  });

  it('calls getMovieDetails with the correct imdbID', async () => {
    mockGet.mockResolvedValueOnce(mockMovie);
    renderHook(() => useMovieDetails('tt0372784'));

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('tt0372784'));
  });
});

// ─── error ────────────────────────────────────────────────────────────────────

describe('error', () => {
  it('sets error and keeps movie=null when API throws', async () => {
    mockGet.mockRejectedValueOnce(new Error('Not found'));
    const { result } = renderHook(() => useMovieDetails('bad-id'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.movie).toBeNull();
      expect(result.current.error).toBe('Failed to load movie details.');
    });
  });
});

// ─── refetch on id change ─────────────────────────────────────────────────────

describe('refetch on id change', () => {
  it('re-runs the fetch when imdbID changes', async () => {
    mockGet.mockResolvedValue(mockMovie);
    const { rerender } = renderHook(({ id }) => useMovieDetails(id), {
      initialProps: { id: 'tt1' },
    });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('tt1'));

    rerender({ id: 'tt2' });

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('tt2'));
    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it('resets to loading when imdbID changes', async () => {
    mockGet.mockResolvedValueOnce(mockMovie);
    // Second call never resolves so we can assert the loading reset synchronously.
    mockGet.mockReturnValueOnce(new Promise(() => {}));
    const { result, rerender } = renderHook(({ id }) => useMovieDetails(id), {
      initialProps: { id: 'tt1' },
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    rerender({ id: 'tt2' });

    expect(result.current.loading).toBe(true);
    expect(result.current.movie).toBeNull();
  });
});
