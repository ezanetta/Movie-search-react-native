import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useMovieSearch } from '@/hooks/use-movie-search';
import { searchMovies } from '@/services/omdb';

jest.mock('@/services/omdb');

const mockSearch = searchMovies as jest.MockedFunction<typeof searchMovies>;

const movies = [
  { imdbID: 'tt1', Title: 'Batman Begins', Year: '2005', Poster: '', Type: 'movie' },
  { imdbID: 'tt2', Title: 'The Dark Knight', Year: '2008', Poster: '', Type: 'movie' },
];

beforeEach(() => {
  jest.useFakeTimers();
  mockSearch.mockReset();
});

afterEach(() => {
  jest.useRealTimers();
});

// ─── initial state ────────────────────────────────────────────────────────────

describe('initial state', () => {
  it('starts with empty movies, no loading, no error when query is blank', () => {
    const { result } = renderHook(() => useMovieSearch(''));
    expect(result.current.movies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('shows loading immediately when query is non-empty', () => {
    mockSearch.mockResolvedValueOnce(movies);
    const { result } = renderHook(() => useMovieSearch('batman'));
    expect(result.current.loading).toBe(true);
  });
});

// ─── debounce ─────────────────────────────────────────────────────────────────

describe('debounce', () => {
  it('does not call searchMovies before 400 ms have elapsed', () => {
    mockSearch.mockResolvedValue([]);
    renderHook(() => useMovieSearch('batman'));

    act(() => jest.advanceTimersByTime(399));
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('calls searchMovies after 400 ms', async () => {
    mockSearch.mockResolvedValueOnce(movies);
    renderHook(() => useMovieSearch('batman'));

    act(() => jest.advanceTimersByTime(400));
    await waitFor(() => expect(mockSearch).toHaveBeenCalledTimes(1));
    expect(mockSearch).toHaveBeenCalledWith('batman');
  });

  it('only fires once for rapid query changes (debounces correctly)', async () => {
    mockSearch.mockResolvedValue([]);
    const { rerender } = renderHook(({ q }) => useMovieSearch(q), {
      initialProps: { q: 'b' },
    });

    act(() => rerender({ q: 'ba' }));
    act(() => rerender({ q: 'bat' }));
    act(() => rerender({ q: 'batm' }));
    act(() => jest.advanceTimersByTime(400));

    await waitFor(() => expect(mockSearch).toHaveBeenCalledTimes(1));
    expect(mockSearch).toHaveBeenCalledWith('batm');
  });
});

// ─── successful search ─────────────────────────────────────────────────────────

describe('successful search', () => {
  it('populates movies and clears loading after the API responds', async () => {
    mockSearch.mockResolvedValueOnce(movies);
    const { result } = renderHook(() => useMovieSearch('batman'));

    act(() => jest.advanceTimersByTime(400));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.movies).toEqual(movies);
      expect(result.current.error).toBeNull();
    });
  });
});

// ─── empty query ──────────────────────────────────────────────────────────────

describe('empty query', () => {
  it('clears results immediately when query is reset to blank', async () => {
    mockSearch.mockResolvedValue(movies);
    const { result, rerender } = renderHook(({ q }) => useMovieSearch(q), {
      initialProps: { q: 'batman' },
    });

    act(() => jest.advanceTimersByTime(400));
    await waitFor(() => expect(result.current.movies).toEqual(movies));

    act(() => rerender({ q: '' }));

    expect(result.current.movies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('does not call searchMovies for blank queries', () => {
    renderHook(({ q }) => useMovieSearch(q), { initialProps: { q: '' } });
    act(() => jest.advanceTimersByTime(400));
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('does not call searchMovies for whitespace-only queries', () => {
    renderHook(() => useMovieSearch('   '));
    act(() => jest.advanceTimersByTime(400));
    expect(mockSearch).not.toHaveBeenCalled();
  });
});

// ─── error handling ───────────────────────────────────────────────────────────

describe('error handling', () => {
  it('sets error message and clears movies when the API throws', async () => {
    mockSearch.mockRejectedValueOnce(new Error('Network error'));
    const { result } = renderHook(() => useMovieSearch('batman'));

    act(() => jest.advanceTimersByTime(400));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.movies).toEqual([]);
      expect(result.current.error).toBe('Search failed. Please try again.');
    });
  });

  it('clears previous error when a new successful search runs', async () => {
    mockSearch.mockRejectedValueOnce(new Error('fail'));
    const { result, rerender } = renderHook(({ q }) => useMovieSearch(q), {
      initialProps: { q: 'err' },
    });

    act(() => jest.advanceTimersByTime(400));
    await waitFor(() => expect(result.current.error).not.toBeNull());

    mockSearch.mockResolvedValueOnce(movies);
    act(() => rerender({ q: 'batman' }));
    act(() => jest.advanceTimersByTime(400));

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.movies).toEqual(movies);
    });
  });
});
