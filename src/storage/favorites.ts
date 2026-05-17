import AsyncStorage from '@react-native-async-storage/async-storage';

import { MovieSummary } from '@/domain/movie';

const FAVORITES_KEY = 'favorites';

export async function getFavorites(): Promise<MovieSummary[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? (JSON.parse(raw) as MovieSummary[]) : [];
}

export async function saveFavorites(movies: MovieSummary[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(movies));
}
