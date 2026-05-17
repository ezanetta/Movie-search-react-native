import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { MovieSummary } from '@/domain/movie';
import { useTheme } from '@/hooks/use-theme';

const PLACEHOLDER_POSTER = 'https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster';

interface Props {
  movie: MovieSummary;
  isFavorite: boolean;
  onToggleFavorite: (movie: MovieSummary) => void;
}

export function MovieCard({ movie, isFavorite, onToggleFavorite }: Props) {
  const theme = useTheme();
  const posterUri = movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER_POSTER;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.backgroundElement }]}
      onPress={() =>
        router.push({ pathname: '/movie/[id]', params: { id: movie.imdbID } })
      }>
      <Image source={{ uri: posterUri }} style={styles.poster} contentFit="cover" />
      <View style={styles.info}>
        <ThemedText type="small" numberOfLines={2} style={styles.title}>
          {movie.Title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {movie.Year}
        </ThemedText>
      </View>
      <Pressable
        style={styles.favButton}
        onPress={() => onToggleFavorite(movie)}
        hitSlop={8}>
        <ThemedText style={styles.favIcon}>{isFavorite ? '★' : '☆'}</ThemedText>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Spacing.two,
    overflow: 'hidden',
    margin: Spacing.one,
  },
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  info: {
    padding: Spacing.two,
    gap: Spacing.half,
  },
  title: {
    fontWeight: '600',
  },
  favButton: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favIcon: {
    fontSize: 16,
    color: '#FFD700',
    lineHeight: 20,
  },
});
