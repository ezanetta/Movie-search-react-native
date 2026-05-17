import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useFavorites } from '@/hooks/use-favorites';
import { getFavorites, saveFavorites } from '@/storage/favorites';

jest.mock('@/storage/favorites');

const mockGet = getFavorites as jest.MockedFunction<typeof getFavorites>;
const mockSave = saveFavorites as jest.MockedFunction<typeof saveFavorites>;

const batman = {
  imdbID: 'tt0372784',
  Title: 'Batman Begins',
  Year: '2005',
  Poster: 'url1',
  Type: 'movie',
};
const darkKnight = {
  imdbID: 'tt0468569',
  Title: 'The Dark Knight',
  Year: '2008',
  Poster: 'url2',
  Type: 'movie',
};

beforeEach(() => {
  mockGet.mockReset();
  mockSave.mockReset();
  mockGet.mockResolvedValue([]);
  mockSave.mockResolvedValue(undefined);
});

// ─── initial load ─────────────────────────────────────────────────────────────

describe('initial load', () => {
  it('starts with an empty list and loads from storage on mount', async () => {
    mockGet.mockResolvedValueOnce([batman]);
    const { result } = renderHook(() => useFavorites());

    await waitFor(() => expect(result.current.favorites).toEqual([batman]));
  });

  it('stays empty when storage is empty', async () => {
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([]));
  });
});

// ─── isFavorite ───────────────────────────────────────────────────────────────

describe('isFavorite', () => {
  it('returns false for an unknown imdbID', async () => {
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([]));
    expect(result.current.isFavorite('unknown')).toBe(false);
  });

  it('returns true for a movie that is in the list', async () => {
    mockGet.mockResolvedValueOnce([batman]);
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([batman]));
    expect(result.current.isFavorite(batman.imdbID)).toBe(true);
  });
});

// ─── toggle (add) ─────────────────────────────────────────────────────────────

describe('toggle — add', () => {
  it('adds a movie to favorites when it is not yet saved', async () => {
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([]));

    await act(async () => {
      await result.current.toggle(batman);
    });

    expect(result.current.favorites).toEqual([batman]);
    expect(result.current.isFavorite(batman.imdbID)).toBe(true);
  });

  it('persists the new list to storage after adding', async () => {
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([]));

    await act(async () => {
      await result.current.toggle(batman);
    });

    expect(mockSave).toHaveBeenCalledWith([batman]);
  });

  it('appends to an existing list without removing others', async () => {
    mockGet.mockResolvedValueOnce([batman]);
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([batman]));

    await act(async () => {
      await result.current.toggle(darkKnight);
    });

    expect(result.current.favorites).toEqual([batman, darkKnight]);
  });
});

// ─── toggle (remove) ──────────────────────────────────────────────────────────

describe('toggle — remove', () => {
  it('removes a movie that is already in favorites', async () => {
    mockGet.mockResolvedValueOnce([batman]);
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([batman]));

    await act(async () => {
      await result.current.toggle(batman);
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite(batman.imdbID)).toBe(false);
  });

  it('persists the updated list to storage after removing', async () => {
    mockGet.mockResolvedValueOnce([batman, darkKnight]);
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toHaveLength(2));

    await act(async () => {
      await result.current.toggle(batman);
    });

    expect(mockSave).toHaveBeenCalledWith([darkKnight]);
  });

  it('only removes the targeted movie and keeps the rest', async () => {
    mockGet.mockResolvedValueOnce([batman, darkKnight]);
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toHaveLength(2));

    await act(async () => {
      await result.current.toggle(batman);
    });

    expect(result.current.favorites).toEqual([darkKnight]);
  });
});

// ─── refresh ──────────────────────────────────────────────────────────────────

describe('refresh', () => {
  it('reloads the list from storage', async () => {
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([]));

    mockGet.mockResolvedValueOnce([batman]);
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.favorites).toEqual([batman]);
  });

  it('reflects external changes made to storage between renders', async () => {
    const { result } = renderHook(() => useFavorites());
    await waitFor(() => expect(result.current.favorites).toEqual([]));

    mockGet.mockResolvedValueOnce([batman, darkKnight]);
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.favorites).toHaveLength(2);
  });
});
