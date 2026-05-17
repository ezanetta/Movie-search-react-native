import React, { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PosterCard } from '@/components/PosterCard';
import { ThemedText } from '@/components/themed-text';
import { router } from 'expo-router';
import {
  darkTheme,
  Fonts,
  lightTheme,
  ScreenPaddingBottom,
  ScreenPaddingH,
  ScreenPaddingTop,
} from '@/constants/theme';
import { useAccent, useTheme as useThemeContext } from '@/context/ThemeContext';
import { FavMovie } from '@/domain/movie';
import { useFavorites } from '@/hooks/use-favorites';
import { useMovieSearch } from '@/hooks/use-movie-search';

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const { movies, loading } = useMovieSearch(query);
  const { isFavorite, toggle } = useFavorites();
  const { dark } = useThemeContext();
  const accent = useAccent();
  const theme = dark ? darkTheme : lightTheme;

  const hasQuery = query.trim().length > 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.paper }]}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <ThemedText type="display">Movies</ThemedText>
              <ThemedText type="small" color={theme.muted}>
                Search the catalogue — save what you love.
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

        {/* Search input */}
        <Pressable
          onPress={() => inputRef.current?.focus()}
          style={[
            styles.inputWrap,
            { backgroundColor: theme.card, borderColor: focused ? accent : theme.line },
            focused && { shadowColor: accent, shadowOpacity: 0.22, shadowRadius: 8, shadowOffset: { width: 0, height: 0 }, elevation: 4 },
          ]}>
          <ThemedText style={styles.searchIcon} color={focused ? accent : theme.muted}>
            ⌕
          </ThemedText>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: theme.ink, fontFamily: Fonts.bodyRegular }]}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Try scary, romance, midnight…"
            placeholderTextColor={theme.muted}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </Pressable>

        {/* Empty state */}
        {!hasQuery && (
          <ScrollView
            style={styles.emptyScroll}
            contentContainerStyle={styles.emptyContent}
            showsVerticalScrollIndicator={false}>
            <View style={[styles.emptyCard, { backgroundColor: theme.card, borderColor: theme.line }]}>
              {/* Decorative orbs */}
              <View style={[styles.orbTopRight, { backgroundColor: accent + '22' }]} />
              <View style={[styles.orbBottomLeft, { backgroundColor: accent + '22' }]} />

              {/* Icon chip */}
              <View style={[styles.iconChip, { backgroundColor: accent + '22' }]}>
                <ThemedText style={{ color: accent, fontSize: 22 }}>⌕</ThemedText>
              </View>

              <ThemedText
                type="subtitle"
                style={{ fontFamily: Fonts.displayBold, textAlign: 'center' }}>
                Find your next favorite
              </ThemedText>
              <ThemedText type="small" color={theme.muted} style={styles.emptyBody}>
                Start typing a title, genre or year above.{'\n'}
                Tap the ★ to save it for later.
              </ThemedText>
            </View>
          </ScrollView>
        )}

        {/* Results */}
        {hasQuery && (
          <>
            {!loading && movies.length > 0 && (
              <View style={styles.resultsHeader}>
                <ThemedText type="label" style={{ fontSize: 13 }}>
                  {movies.length} result{movies.length !== 1 ? 's' : ''}
                </ThemedText>
                <ThemedText type="small" color={theme.muted}>
                  for "{query}"
                </ThemedText>
              </View>
            )}

            <FlatList
              data={movies}
              keyExtractor={item => item.imdbID}
              numColumns={2}
              contentContainerStyle={styles.grid}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <PosterCard
                  movie={item}
                  isFavorite={isFavorite(item.imdbID)}
                  onToggleFavorite={(m: FavMovie) => toggle(m)}
                />
              )}
            />
          </>
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
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 14,
  },
  searchIcon: { fontSize: 20 },
  input: { flex: 1, fontSize: 16, paddingVertical: 14 },
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
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  emptyBody: { textAlign: 'center', lineHeight: 22 },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 7,
  },
  grid: { paddingBottom: 24 },
});
