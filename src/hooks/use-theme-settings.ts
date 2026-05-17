import { useCallback, useEffect, useState } from 'react';

import { AccentColor, DEFAULT_ACCENT, DEFAULT_DARK } from '@/constants/theme';
import { getSettings, saveSettings } from '@/storage/settings';

export interface ThemeSettings {
  dark: boolean;
  accent: AccentColor;
  setDark: (value: boolean) => Promise<void>;
  setAccent: (value: AccentColor) => Promise<void>;
  loaded: boolean;
}

export function useThemeSettings(): ThemeSettings {
  const [dark, setDarkState] = useState(DEFAULT_DARK);
  const [accent, setAccentState] = useState<AccentColor>(DEFAULT_ACCENT);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      setDarkState(s.dark);
      setAccentState(s.accent);
      setLoaded(true);
    });
  }, []);

  const setDark = useCallback(async (value: boolean) => {
    setDarkState(value);
    const current = await getSettings();
    await saveSettings({ ...current, dark: value });
  }, []);

  const setAccent = useCallback(async (value: AccentColor) => {
    setAccentState(value);
    const current = await getSettings();
    await saveSettings({ ...current, accent: value });
  }, []);

  return { dark, accent, setDark, setAccent, loaded };
}
