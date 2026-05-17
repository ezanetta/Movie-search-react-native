import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieGrid } from '@/components/MovieGrid';
import { SearchInput } from '@/components/SearchInput';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';
import { useMovieSearch } from '@/hooks/use-movie-search';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const { movies, loading, error } = useMovieSearch(query);
  const { isFavorite, toggle } = useFavorites();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ThemedText type="title" style={styles.heading}>
          Movies
        </ThemedText>
        <SearchInput value={query} onChangeText={setQuery} />
        <MovieGrid
          movies={movies}
          loading={loading}
          error={error}
          isFavorite={isFavorite}
          onToggleFavorite={toggle}
          emptyMessage={query.trim() ? 'No results found.' : 'Search for a movie above.'}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset,
    gap: Spacing.three,
  },
  heading: {
    paddingHorizontal: Spacing.one,
  },
});
