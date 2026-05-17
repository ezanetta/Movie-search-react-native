import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StarButton } from '@/components/StarButton';
import { ThemedText } from '@/components/themed-text';
import { cardShadow, darkTheme, Fonts, lightTheme, ScreenPaddingH } from '@/constants/theme';
import { useAccent, useTheme } from '@/context/ThemeContext';
import { FavMovie, Movie } from '@/domain/movie';
import { useFavorites } from '@/hooks/use-favorites';
import { useMovieDetails } from '@/hooks/use-movie-details';

const PLACEHOLDER = 'https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster';

function MetaChip({ label }: { label: string }) {
  const { dark } = useTheme();
  const theme = dark ? darkTheme : lightTheme;
  return (
    <View style={[styles.metaChip, { backgroundColor: theme.card, borderColor: theme.line }]}>
      <ThemedText style={{ fontSize: 12, fontFamily: Fonts.bodySemiBold }}>{label}</ThemedText>
    </View>
  );
}

function FactRow({ label, value }: { label: string; value?: string }) {
  const { dark } = useTheme();
  const theme = dark ? darkTheme : lightTheme;
  if (!value || value === 'N/A') return null;
  return (
    <View style={[styles.factRow, { borderBottomColor: theme.line }]}>
      <ThemedText
        style={{ fontFamily: Fonts.bodyMedium, fontSize: 13, width: 90 }}
        color={theme.muted}>
        {label}
      </ThemedText>
      <ThemedText style={{ flex: 1, fontSize: 13, fontFamily: Fonts.bodyRegular }}>
        {value}
      </ThemedText>
    </View>
  );
}

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { movie, loading, error } = useMovieDetails(id);
  const { isFavorite, toggle } = useFavorites();
  const { dark } = useTheme();
  const accent = useAccent();
  const theme = dark ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();

  const favourite = movie ? isFavorite(movie.imdbID) : false;

  const handleToggle = useCallback(() => {
    if (!movie) return;
    const fav: FavMovie = {
      imdbID: movie.imdbID,
      Title: movie.Title,
      Year: movie.Year,
      Poster: movie.Poster,
      Type: movie.Type,
      Runtime: movie.Runtime,
      Rated: movie.Rated,
      Genre: movie.Genre,
      imdbRating: movie.imdbRating,
    };
    toggle(fav);
  }, [movie, toggle]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.paper }]}>
        <ActivityIndicator size="large" color={accent} />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.center, { backgroundColor: theme.paper }]}>
        <ThemedText color={theme.muted}>{error ?? 'Movie not found.'}</ThemedText>
      </View>
    );
  }

  const posterUri = movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;
  const metaParts = [movie.Year, movie.Runtime, movie.Rated].filter(v => v && v !== 'N/A');

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>

        {/* ── Cinematic hero ── */}
        <View style={styles.heroWrap}>
          <Image source={{ uri: posterUri }} style={styles.heroPoster} contentFit="cover" />

          {/* Gradient: semi-dark top → transparent → paper bottom */}
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', theme.paper]}
            locations={[0, 0.4, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Top controls row */}
          <View style={[styles.heroControls, { paddingTop: insets.top + 12 }]}>
            {/* Glass back button */}
            <Pressable
              onPress={() => router.back()}
              style={[styles.glassPill, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
              <ThemedText style={styles.glassPillText}>← Back</ThemedText>
            </Pressable>

            {/* Star button */}
            <StarButton
              filled={favourite}
              onToggle={handleToggle}
              size={44}
              bgColor="rgba(255,255,255,0.18)"
            />
          </View>

          {/* Rating pill over hero */}
          {movie.imdbRating !== 'N/A' && (
            <View style={[styles.ratingPill, { backgroundColor: accent }]}>
              <ThemedText style={styles.ratingPillText}>★ {movie.imdbRating}</ThemedText>
            </View>
          )}
        </View>

        {/* ── Content ── */}
        <View style={[styles.content, { paddingHorizontal: ScreenPaddingH }]}>
          {/* Title */}
          <ThemedText style={styles.title}>{movie.Title}</ThemedText>

          {/* Meta chips row */}
          {metaParts.length > 0 && (
            <View style={styles.metaRow}>
              {metaParts.map(part => (
                <MetaChip key={part} label={part} />
              ))}
            </View>
          )}

          {/* Genre — Instrument Serif italic */}
          {movie.Genre && movie.Genre !== 'N/A' && (
            <ThemedText
              style={{ fontFamily: Fonts.accentItalic, fontSize: 15, lineHeight: 22 }}
              color={theme.muted}>
              {movie.Genre}
            </ThemedText>
          )}

          {/* Rating block */}
          {movie.imdbRating !== 'N/A' && (
            <View style={[styles.ratingBlock, { backgroundColor: theme.card, borderColor: theme.line }, !dark && cardShadow]}>
              <ThemedText style={{ fontFamily: Fonts.displayBold, fontSize: 36, color: accent }}>
                {movie.imdbRating}
              </ThemedText>
              <View style={{ gap: 2 }}>
                <ThemedText style={{ fontFamily: Fonts.bodySemiBold, fontSize: 14 }}>
                  IMDb Rating
                </ThemedText>
                {movie.imdbVotes !== 'N/A' && (
                  <ThemedText style={{ fontSize: 12 }} color={theme.muted}>
                    {movie.imdbVotes} votes
                  </ThemedText>
                )}
              </View>
            </View>
          )}

          {/* Plot */}
          {movie.Plot && movie.Plot !== 'N/A' && (
            <ThemedText style={styles.plot}>{movie.Plot}</ThemedText>
          )}

          {/* Fact table */}
          <View style={[styles.factTable, { borderTopColor: theme.line }]}>
            <FactRow label="Director" value={movie.Director} />
            <FactRow label="Writer" value={movie.Writer} />
            <FactRow label="Actors" value={movie.Actors} />
            <FactRow label="Country" value={movie.Country} />
            <FactRow label="Language" value={movie.Language} />
            <FactRow label="Awards" value={movie.Awards} />
            <FactRow label="Box Office" value={movie.BoxOffice} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Hero
  heroWrap: {
    width: '100%',
    aspectRatio: 3 / 4,
  },
  heroPoster: {
    ...StyleSheet.absoluteFillObject,
  },
  heroControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  glassPill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  glassPillText: {
    color: '#fff',
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
  },
  ratingPill: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ratingPillText: {
    color: '#fff',
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },

  // Content
  content: { gap: 16, marginTop: -24 },
  title: {
    fontFamily: Fonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  ratingBlock: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  plot: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: Fonts.bodyRegular,
  },
  factTable: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  factRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
