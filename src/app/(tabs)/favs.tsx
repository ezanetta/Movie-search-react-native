import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FavCard } from '@/components/FavCard';
import { ThemedText } from '@/components/themed-text';
import {
  cardShadow,
  darkTheme,
  Fonts,
  lightTheme,
  ScreenPaddingBottom,
  ScreenPaddingH,
  ScreenPaddingTop,
} from '@/constants/theme';
import { useAccent, useTheme } from '@/context/ThemeContext';
import { FavMovie } from '@/domain/movie';
import { useFavorites } from '@/hooks/use-favorites';

export default function FavsScreen() {
  const { favorites, toggle, refresh } = useFavorites();
  const { dark } = useTheme();
  const accent = useAccent();
  const theme = dark ? darkTheme : lightTheme;

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const isEmpty = favorites.length === 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="display">Favourites</ThemedText>
              <ThemedText type="small" color={theme.muted}>
                Your personal watchlist.
              </ThemedText>
            </View>
            <Pressable
              onPress={() => router.push('/settings')}
              style={[styles.gearButton, { backgroundColor: theme.card }]}
              hitSlop={8}>
              <Ionicons name="settings-outline" size={22} color={theme.muted} />
            </Pressable>
          </View>
        </View>

        {isEmpty ? (
          <ScrollView
            style={styles.emptyScroll}
            contentContainerStyle={styles.emptyContent}
            showsVerticalScrollIndicator={false}>
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.line }, !dark && cardShadow]}>
              <View style={[styles.orbTopRight, { backgroundColor: accent + '22' }]} />
              <View style={[styles.orbBottomLeft, { backgroundColor: accent + '22' }]} />

              <View style={[styles.iconChip, { backgroundColor: accent + '22' }]}>
                <ThemedText style={{ color: accent, fontSize: 28 }}>♥</ThemedText>
              </View>

              <ThemedText
                type="subtitle"
                style={{ fontFamily: Fonts.displayBold, textAlign: 'center' }}>
                Nothing saved yet
              </ThemedText>
              <ThemedText type="small" color={theme.muted} style={styles.emptyBody}>
                Tap ★ on any movie to add it here.{'\n'}
                Your watchlist lives across sessions.
              </ThemedText>
            </View>
          </ScrollView>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={item => item.imdbID}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <FavCard
                movie={item}
                index={index}
                onToggleFavorite={(m: FavMovie) => toggle(m)}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: {
    flex: 1,
    paddingHorizontal: ScreenPaddingH,
    paddingTop: ScreenPaddingTop,
    paddingBottom: ScreenPaddingBottom,
  },
  header: { marginBottom: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  emptyScroll: { flex: 1 },
  emptyContent: { paddingTop: 24, paddingBottom: 24 },
  emptyCard: {
    borderRadius: 22,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    gap: 14,
    overflow: 'hidden',
  },
  orbTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  orbBottomLeft: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  iconChip: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  emptyBody: { textAlign: 'center', lineHeight: 22 },
  list: { paddingTop: 16, paddingBottom: 24, gap: 24 },
  separator: { height: 0 },
});
