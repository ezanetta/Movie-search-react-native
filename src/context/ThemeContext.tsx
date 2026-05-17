import React, { createContext, useContext } from 'react';

import { AccentColor, DEFAULT_ACCENT, DEFAULT_DARK } from '@/constants/theme';
import { ThemeSettings } from '@/hooks/use-theme-settings';

const ThemeContext = createContext<ThemeSettings>({
  dark: DEFAULT_DARK,
  accent: DEFAULT_ACCENT,
  setDark: async () => {},
  setAccent: async () => {},
  loaded: false,
});

export function ThemeProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ThemeSettings;
}) {
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeSettings {
  return useContext(ThemeContext);
}

export function useAccent(): AccentColor {
  return useContext(ThemeContext).accent;
}
