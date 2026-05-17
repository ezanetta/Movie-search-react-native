import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { AccentSwatch } from '@/components/AccentSwatch';
import { ThemedText } from '@/components/themed-text';
import { Toggle } from '@/components/Toggle';
import {
  ACCENT_PALETTE,
  AccentColor,
  cardShadow,
  darkTheme,
  Fonts,
  lightTheme,
  ScreenPaddingBottom,
  ScreenPaddingH,
  ScreenPaddingTop,
} from '@/constants/theme';
import { useTheme as useThemeContext } from '@/context/ThemeContext';
import { useTheme } from '@/hooks/use-theme';

const ABOUT_ROWS = [
  { label: 'Version', value: '1.0.0' },
  { label: 'Data source', value: 'OMDb' },
  { label: 'Made with', value: 'React Native' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { dark, accent, setDark, setAccent } = useThemeContext();
  const colors = dark ? darkTheme : lightTheme;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.paper }}
      contentContainerStyle={[styles.content, { paddingBottom: ScreenPaddingBottom }]}
      showsVerticalScrollIndicator={false}>
      <SafeAreaView edges={['top']}>
        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
          <ThemedText style={{ fontFamily: Fonts.bodySemiBold, fontSize: 14 }} color={colors.muted}>
            ← Back
          </ThemedText>
        </Pressable>

        <ThemedText type="display" style={styles.title}>
          Settings
        </ThemedText>
        <ThemedText type="small" color={colors.muted} style={styles.subtitle}>
          Personalise the look of your app.
        </ThemedText>

        {/* ── Appearance section ── */}
        <ThemedText type="label" color={colors.muted} style={styles.sectionLabel}>
          Appearance
        </ThemedText>

        {/* Dark mode card */}
        <View style={[styles.card, { backgroundColor: colors.card }, !dark && cardShadow]}>
          <View style={styles.cardRow}>
            <View style={styles.cardTextBlock}>
              <ThemedText style={{ fontFamily: Fonts.bodySemiBold, fontSize: 16 }}>
                Dark mode
              </ThemedText>
              <ThemedText type="small" color={colors.muted}>
                Easier on the eyes after dark.
              </ThemedText>
            </View>
            <Toggle value={dark} onValueChange={v => setDark(v)} />
          </View>
        </View>

        {/* Accent color card */}
        <View style={[styles.card, { backgroundColor: colors.card }, !dark && cardShadow]}>
          <ThemedText style={{ fontFamily: Fonts.bodySemiBold, fontSize: 16 }}>
            Accent color
          </ThemedText>
          <ThemedText type="small" color={colors.muted} style={{ marginBottom: 16 }}>
            Used for highlights and the favorite star.
          </ThemedText>
          <View style={styles.swatchRow}>
            {ACCENT_PALETTE.map(a => (
              <AccentSwatch
                key={a.id}
                color={a.id}
                name={a.name}
                selected={accent === a.id}
                onSelect={v => setAccent(v as AccentColor)}
              />
            ))}
          </View>
        </View>

        {/* ── About section ── */}
        <ThemedText type="label" color={colors.muted} style={styles.sectionLabel}>
          About
        </ThemedText>

        <View style={[styles.card, { backgroundColor: colors.card }, !dark && cardShadow]}>
          {ABOUT_ROWS.map((row, i) => (
            <View key={row.label}>
              <View style={styles.aboutRow}>
                <ThemedText style={{ fontFamily: Fonts.bodyMedium, fontSize: 15 }}>
                  {row.label}
                </ThemedText>
                <ThemedText color={colors.muted} style={{ fontSize: 15 }}>
                  {row.value}
                </ThemedText>
              </View>
              {i < ABOUT_ROWS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.line }]} />
              )}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: ScreenPaddingH,
    paddingTop: ScreenPaddingTop,
    gap: 12,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 24,
  },
  sectionLabel: {
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTextBlock: {
    flex: 1,
    gap: 2,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
