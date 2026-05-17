import { useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MovieGrid } from '@/components/MovieGrid';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useFavorites } from '@/hooks/use-favorites';

export default function FavsScreen() {
  const { favorites, isFavorite, toggle, refresh } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ThemedText type="title" style={styles.heading}>
          Favorites
        </ThemedText>
        <MovieGrid
          movies={favorites}
          loading={false}
          error={null}
          isFavorite={isFavorite}
          onToggleFavorite={toggle}
          emptyMessage="No favorites yet. Tap ☆ on any movie."
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
