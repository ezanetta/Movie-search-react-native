import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StarButton } from '@/components/StarButton';
import { ThemedText } from '@/components/themed-text';
import { cardShadow, darkTheme, Fonts, lightTheme } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { FavMovie, MovieSummary } from '@/domain/movie';

const PLACEHOLDER = 'https://placehold.co/300x450/1a1a2e/ffffff?text=No+Poster';

interface Props {
  movie: MovieSummary;
  isFavorite: boolean;
  onToggleFavorite: (movie: FavMovie) => void;
}

export function PosterCard({ movie, isFavorite, onToggleFavorite }: Props) {
  const { dark } = useTheme();
  const theme = dark ? darkTheme : lightTheme;
  const posterUri = movie.Poster !== 'N/A' ? movie.Poster : PLACEHOLDER;

  const handleToggle = () => onToggleFavorite({ ...movie });

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.card }, !dark && cardShadow]}
      onPress={() => router.push({ pathname: '/movie/[id]', params: { id: movie.imdbID } })}>
      <View style={styles.posterWrap}>
        <Image source={{ uri: posterUri }} style={styles.poster} contentFit="cover" />

        {/* Runtime + Rated pills (bottom-left) */}
        <View style={styles.bottomPills}>
          <View style={styles.pillWhite}>
            <Text style={styles.pillTextDark}>108'</Text>
          </View>
          <View style={styles.pillBlack}>
            <Text style={styles.pillTextLight}>PG-13</Text>
          </View>
        </View>

        {/* Star (top-right) */}
        <View style={styles.starWrap}>
          <StarButton filled={isFavorite} onToggle={handleToggle} size={36} />
        </View>
      </View>

      <View style={styles.info}>
        <ThemedText
          type="smallBold"
          numberOfLines={2}
          style={{ fontFamily: Fonts.displayBold, fontSize: 16 }}>
          {movie.Title}
        </ThemedText>
        <ThemedText type="small" color={theme.muted}>
          {movie.Year} · ★ —
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    margin: 7,
  },
  posterWrap: {
    width: '100%',
    aspectRatio: 2 / 3,
  },
  poster: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
  },
  bottomPills: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  pillWhite: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillBlack: {
    backgroundColor: '#000',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  pillTextDark: {
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
    color: '#000',
  },
  pillTextLight: {
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
    color: '#fff',
  },
  starWrap: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  info: {
    padding: 10,
    gap: 2,
  },
});
