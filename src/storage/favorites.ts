import AsyncStorage from '@react-native-async-storage/async-storage';

import { FavMovie } from '@/domain/movie';

const FAVORITES_KEY = 'favorites';

export async function getFavorites(): Promise<FavMovie[]> {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? (JSON.parse(raw) as FavMovie[]) : [];
}

export async function saveFavorites(movies: FavMovie[]): Promise<void> {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(movies));
}
