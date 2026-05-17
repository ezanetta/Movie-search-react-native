import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import { MovieCard } from '@/components/MovieCard';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { MovieSummary } from '@/domain/movie';

interface Props {
  movies: MovieSummary[];
  loading: boolean;
  error: string | null;
  isFavorite: (imdbID: string) => boolean;
  onToggleFavorite: (movie: MovieSummary) => void;
  emptyMessage?: string;
}

export function MovieGrid({
  movies,
  loading,
  error,
  isFavorite,
  onToggleFavorite,
  emptyMessage = 'No movies found.',
}: Props) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <ThemedText themeColor="textSecondary">{error}</ThemedText>
      </View>
    );
  }

  if (movies.length === 0) {
    return (
      <View style={styles.center}>
        <ThemedText themeColor="textSecondary">{emptyMessage}</ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      data={movies}
      keyExtractor={item => item.imdbID}
      numColumns={2}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          isFavorite={isFavorite(item.imdbID)}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  list: {
    padding: Spacing.one,
  },
});
