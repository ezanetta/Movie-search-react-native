import { BlurView } from 'expo-blur';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { darkTheme, Fonts, lightTheme, TAB_BAR_HEIGHT } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { useFavorites } from '@/hooks/use-favorites';

const ICONS: Record<string, { active: string; inactive: string }> = {
  index: { active: '⌂', inactive: '⌂' },
  favs: { active: '♥', inactive: '♡' },
};

const LABELS: Record<string, string> = {
  index: 'Home',
  favs: 'Favorites',
};

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const { dark, accent } = useTheme();
  const theme = dark ? darkTheme : lightTheme;
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();
  const hasFavs = favorites.length > 0;

  // Hide entirely when settings is the active screen
  const activeRouteName = state.routes[state.index]?.name;
  if (activeRouteName === 'settings') return null;

  const blurTint = dark ? 'dark' : 'light';
  const pillBg = dark ? 'rgba(40,40,40,0.92)' : 'rgba(255,255,255,0.94)';

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 16) }]}>
      <View style={[styles.pill, { backgroundColor: pillBg }]}>
        {Platform.OS !== 'web' && (
          <BlurView
            intensity={60}
            tint={blurTint}
            style={StyleSheet.absoluteFill}
          />
        )}

        {state.routes.map((route, index) => {
          if (!ICONS[route.name]) return null;
          const isFocused = state.index === index;
          const icons = ICONS[route.name] ?? { active: '●', inactive: '○' };
          const label = LABELS[route.name] ?? route.name;
          const showDot =
            route.name === 'favs' && hasFavs && !isFocused;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}>
              {isFocused ? (
                <View style={[styles.activePill, { backgroundColor: theme.ink }]}>
                  <Text style={[styles.iconActive, { color: theme.paper }]}>
                    {icons.active}
                  </Text>
                  <Text
                    style={[
                      styles.label,
                      { color: theme.paper, fontFamily: Fonts.bodySemiBold },
                    ]}>
                    {label}
                  </Text>
                </View>
              ) : (
                <View style={styles.inactiveTab}>
                  <Text style={[styles.iconInactive, { color: theme.muted }]}>
                    {icons.inactive}
                  </Text>
                  {showDot && (
                    <View style={[styles.dot, { backgroundColor: accent }]} />
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 18,
    right: 18,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 4,
    width: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  inactiveTab: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  iconActive: {
    fontSize: 16,
  },
  iconInactive: {
    fontSize: 20,
  },
  label: {
    fontSize: 14,
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
