import { Image } from 'expo-image';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { Movie } from '@/domain/movie';
import { useFavorites } from '@/hooks/use-favorites';
import { useMovieDetails } from '@/hooks/use-movie-details';
import { useTheme } from '@/hooks/use-theme';

const PLACEHOLDER_POSTER = 'https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster';

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value || value === 'N/A') return null;
  return (
    <View style={styles.infoRow}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.infoLabel}>
        {label}
      </ThemedText>
      <ThemedText type="small" style={styles.infoValue}>
        {value}
      </ThemedText>
    </View>
  );
}

function RatingBadge({ movie }: { movie: Movie }) {
  if (movie.imdbRating === 'N/A') return null;
  return (
    <View style={styles.ratingRow}>
      <ThemedText style={styles.ratingScore}>★ {movie.imdbRating}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        /10 · {movie.imdbVotes} votes
      </ThemedText>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movie, loading, error } = useMovieDetails(id);
  const { isFavorite, toggle } = useFavorites();
  const navigation = useNavigation();
  const theme = useTheme();

  const favourite = movie ? isFavorite(movie.imdbID) : false;

  const handleToggle = useCallback(() => {
    if (!movie) return;
    toggle({
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type,
    });
  }, [movie, toggle]);

  useEffect(() => {
    if (!movie) return;
    navigation.setOptions({
      title: movie.Title,
      headerRight: () => (
        <Pressable onPress={handleToggle} hitSlop={8} style={styles.headerFavButton}>
          <ThemedText style={styles.headerFavIcon}>{favourite ? '★' : '☆'}</ThemedText>
        </Pressable>
      ),
    });
  }, [movie, navigation, favourite, handleToggle]);

  if (loading) {
    return (
      <ThemedView style={styles.center}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !movie) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText themeColor="textSecondary">{error ?? 'Movie not found.'}</ThemedText>
      </ThemedView>
    );
  }

  const posterUri = movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER_POSTER;

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={styles.scrollContent}>
        <SafeAreaView edges={['bottom']}>
          <Image source={{ uri: posterUri }} style={styles.poster} contentFit="cover" />

          <View style={styles.details}>
            <ThemedText type="subtitle">{movie.Title}</ThemedText>

            <ThemedText themeColor="textSecondary">
              {[movie.Year, movie.Runtime, movie.Rated].filter(v => v && v !== 'N/A').join(' · ')}
            </ThemedText>

            {movie.Genre !== 'N/A' && (
              <ThemedText type="small" style={styles.genre}>
                {movie.Genre}
              </ThemedText>
            )}

            <RatingBadge movie={movie} />

            {movie.Plot !== 'N/A' && (
              <ThemedText style={styles.plot}>{movie.Plot}</ThemedText>
            )}

            <View style={styles.infoTable}>
              <InfoRow label="Director" value={movie.Director} />
              <InfoRow label="Writer" value={movie.Writer} />
              <InfoRow label="Actors" value={movie.Actors} />
              <InfoRow label="Country" value={movie.Country} />
              <InfoRow label="Language" value={movie.Language} />
              <InfoRow label="Awards" value={movie.Awards} />
              <InfoRow label="Box Office" value={movie.BoxOffice} />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: {},
  poster: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  details: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  genre: {
    fontStyle: 'italic',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  ratingScore: {
    fontSize: 24,
    fontWeight: '700',
  },
  plot: {
    lineHeight: 22,
  },
  infoTable: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.3)',
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  infoLabel: {
    width: 80,
    flexShrink: 0,
  },
  infoValue: {
    flex: 1,
  },
  headerFavButton: {
    paddingHorizontal: Spacing.two,
  },
  headerFavIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
});
