import AsyncStorage from '@react-native-async-storage/async-storage';

import { AccentColor, DEFAULT_ACCENT, DEFAULT_DARK } from '@/constants/theme';

const SETTINGS_KEY = 'app_settings';

export interface AppSettings {
  dark: boolean;
  accent: AccentColor;
}

const DEFAULTS: AppSettings = {
  dark: DEFAULT_DARK,
  accent: DEFAULT_ACCENT,
};

export async function getSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULTS;
  return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<AppSettings>) };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
