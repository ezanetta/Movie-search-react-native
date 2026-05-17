import AsyncStorage from '@react-native-async-storage/async-storage';

import { getFavorites, saveFavorites } from '@/storage/favorites';

const movie = {
  imdbID: 'tt0372784',
  Title: 'Batman Begins',
  Year: '2005',
  Poster: 'https://example.com/poster.jpg',
  Type: 'movie',
};

const movie2 = {
  imdbID: 'tt0468569',
  Title: 'The Dark Knight',
  Year: '2008',
  Poster: 'https://example.com/poster2.jpg',
  Type: 'movie',
};

beforeEach(async () => {
  await AsyncStorage.clear();
});

// ─── getFavorites ─────────────────────────────────────────────────────────────

describe('getFavorites', () => {
  it('returns an empty array when nothing is stored', async () => {
    const result = await getFavorites();
    expect(result).toEqual([]);
  });

  it('returns the parsed list when data exists in storage', async () => {
    await AsyncStorage.setItem('favorites', JSON.stringify([movie]));
    const result = await getFavorites();
    expect(result).toEqual([movie]);
  });

  it('preserves all MovieSummary fields', async () => {
    await AsyncStorage.setItem('favorites', JSON.stringify([movie, movie2]));
    const result = await getFavorites();
    expect(result).toHaveLength(2);
    expect(result[0].imdbID).toBe('tt0372784');
    expect(result[1].Title).toBe('The Dark Knight');
  });
});

// ─── saveFavorites ────────────────────────────────────────────────────────────

describe('saveFavorites', () => {
  it('serialises and stores the favorites list', async () => {
    await saveFavorites([movie]);
    const raw = await AsyncStorage.getItem('favorites');
    expect(JSON.parse(raw!)).toEqual([movie]);
  });

  it('overwrites any previously stored list', async () => {
    await saveFavorites([movie]);
    await saveFavorites([movie2]);
    const result = await getFavorites();
    expect(result).toEqual([movie2]);
  });

  it('stores an empty array (clearing favorites)', async () => {
    await saveFavorites([movie]);
    await saveFavorites([]);
    const result = await getFavorites();
    expect(result).toEqual([]);
  });

  it('stores multiple items', async () => {
    await saveFavorites([movie, movie2]);
    const result = await getFavorites();
    expect(result).toHaveLength(2);
  });
});
