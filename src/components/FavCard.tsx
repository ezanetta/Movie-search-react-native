import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { StarButton } from '@/components/StarButton';
import { ThemedText } from '@/components/themed-text';
import { cardShadow, darkTheme, Fonts, lightTheme } from '@/constants/theme';
import { useAccent, useTheme } from '@/context/ThemeContext';
import { FavMovie } from '@/domain/movie';

const PLACEHOLDER = 'https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster';

interface Props {
  movie: FavMovie;
  index: number;
  onToggleFavorite: (movie: FavMovie) => void;
}

export function FavCard({ movie, index, onToggleFavorite }: Props) {
  const { dark } = useTheme();
  const accent = useAccent();
  const theme = dark ? darkTheme : lightTheme;
  const posterUri = movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;

  const rotation = index % 2 === 0 ? '0.6deg' : '-0.6deg';

  const metaParts = [movie.Year, movie.Runtime, movie.Rated].filter(
    v => v && v !== 'N/A'
  );

  return (
    <Pressable
      style={[
        styles.card,
        { backgroundColor: theme.card, transform: [{ rotate: rotation }] },
        !dark && cardShadow,
      ]}
      onPress={() => router.push({ pathname: '/movie/[id]', params: { id: movie.imdbID } })}>
      {/* Washi tape strip */}
      <View
        style={[
          styles.tape,
          { backgroundColor: accent + '55' },
        ]}
      />

      <View style={styles.row}>
        {/* Poster */}
        <Image source={{ uri: posterUri }} style={styles.poster} contentFit="cover" />

        {/* Info */}
        <View style={styles.info}>
          <ThemedText
            style={{ fontFamily: Fonts.displayBold, fontSize: 20, lineHeight: 24 }}
            numberOfLines={2}>
            {movie.Title}
          </ThemedText>

          {metaParts.length > 0 && (
            <ThemedText type="label" color={theme.muted} style={{ fontSize: 11 }}>
              {metaParts.join(' · ')}
            </ThemedText>
          )}

          {movie.Genre && movie.Genre !== 'N/A' && (
            <ThemedText
              type="small"
              color={theme.muted}
              style={{ fontFamily: Fonts.accentItalic, fontSize: 13 }}>
              {movie.Genre}
            </ThemedText>
          )}

          <View style={styles.bottom}>
            {movie.imdbRating && movie.imdbRating !== 'N/A' && (
              <View style={[styles.ratingPill, { backgroundColor: accent + '22' }]}>
                <ThemedText style={{ color: accent, fontFamily: Fonts.bodyBold, fontSize: 13 }}>
                  ★ {movie.imdbRating}
                </ThemedText>
              </View>
            )}
            <StarButton filled onToggle={() => onToggleFavorite(movie)} size={28} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'visible',
    marginHorizontal: 4,
  },
  tape: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 64,
    height: 18,
    borderRadius: 3,
    transform: [{ rotate: '-2deg' }],
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    borderRadius: 18,
    overflow: 'hidden',
  },
  poster: {
    width: 120,
    aspectRatio: 2 / 3,
  },
  info: {
    flex: 1,
    padding: 14,
    gap: 6,
    justifyContent: 'space-between',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  ratingPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
