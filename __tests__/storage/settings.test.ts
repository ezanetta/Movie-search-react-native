import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_ACCENT, DEFAULT_DARK } from '@/constants/theme';
import { getSettings, saveSettings } from '@/storage/settings';

beforeEach(async () => {
  await AsyncStorage.clear();
});

// ─── getSettings ──────────────────────────────────────────────────────────────

describe('getSettings', () => {
  it('returns defaults when nothing is stored', async () => {
    const result = await getSettings();
    expect(result.dark).toBe(DEFAULT_DARK);
    expect(result.accent).toBe(DEFAULT_ACCENT);
  });

  it('returns stored values when they exist', async () => {
    await AsyncStorage.setItem(
      'app_settings',
      JSON.stringify({ dark: true, accent: '#9b7eff' })
    );
    const result = await getSettings();
    expect(result.dark).toBe(true);
    expect(result.accent).toBe('#9b7eff');
  });

  it('merges stored partial data with defaults (forward-compat)', async () => {
    await AsyncStorage.setItem('app_settings', JSON.stringify({ dark: true }));
    const result = await getSettings();
    expect(result.dark).toBe(true);
    expect(result.accent).toBe(DEFAULT_ACCENT);
  });
});

// ─── saveSettings ─────────────────────────────────────────────────────────────

describe('saveSettings', () => {
  it('persists dark and accent values', async () => {
    await saveSettings({ dark: true, accent: '#22c55e' });
    const raw = await AsyncStorage.getItem('app_settings');
    const parsed = JSON.parse(raw!);
    expect(parsed.dark).toBe(true);
    expect(parsed.accent).toBe('#22c55e');
  });

  it('overwrites previous settings', async () => {
    await saveSettings({ dark: false, accent: '#ff5722' });
    await saveSettings({ dark: true, accent: '#0ea5e9' });
    const result = await getSettings();
    expect(result.dark).toBe(true);
    expect(result.accent).toBe('#0ea5e9');
  });
});
