import {
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist';
import {
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { ThemeProvider } from '@/context/ThemeContext';
import { useThemeSettings } from '@/hooks/use-theme-settings';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const themeSettings = useThemeSettings();

  const [fontsLoaded] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
    InstrumentSerif_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded && themeSettings.loaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, themeSettings.loaded]);

  if (!fontsLoaded || !themeSettings.loaded) return null;

  return (
    <ThemeProvider value={themeSettings}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="movie/[id]" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutInner />;
}
