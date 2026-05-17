import { act, renderHook, waitFor } from '@testing-library/react-native';

import { DEFAULT_ACCENT, DEFAULT_DARK } from '@/constants/theme';
import { useThemeSettings } from '@/hooks/use-theme-settings';
import { getSettings, saveSettings } from '@/storage/settings';

jest.mock('@/storage/settings');

const mockGet = getSettings as jest.MockedFunction<typeof getSettings>;
const mockSave = saveSettings as jest.MockedFunction<typeof saveSettings>;

beforeEach(() => {
  mockGet.mockReset();
  mockSave.mockReset();
  mockGet.mockResolvedValue({ dark: DEFAULT_DARK, accent: DEFAULT_ACCENT });
  mockSave.mockResolvedValue(undefined);
});

// ─── initial load ─────────────────────────────────────────────────────────────

describe('initial load', () => {
  it('starts with loaded=false, then resolves to stored values', async () => {
    mockGet.mockResolvedValueOnce({ dark: true, accent: '#9b7eff' });
    const { result } = renderHook(() => useThemeSettings());

    expect(result.current.loaded).toBe(false);

    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.dark).toBe(true);
    expect(result.current.accent).toBe('#9b7eff');
  });

  it('uses defaults when storage returns defaults', async () => {
    const { result } = renderHook(() => useThemeSettings());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.dark).toBe(DEFAULT_DARK);
    expect(result.current.accent).toBe(DEFAULT_ACCENT);
  });
});

// ─── setDark ─────────────────────────────────────────────────────────────────

describe('setDark', () => {
  it('updates dark state immediately', async () => {
    const { result } = renderHook(() => useThemeSettings());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.setDark(true);
    });

    expect(result.current.dark).toBe(true);
  });

  it('persists the new dark value to storage', async () => {
    mockGet.mockResolvedValue({ dark: false, accent: DEFAULT_ACCENT });
    const { result } = renderHook(() => useThemeSettings());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.setDark(true);
    });

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({ dark: true })
    );
  });

  it('preserves existing accent when saving dark', async () => {
    mockGet.mockResolvedValue({ dark: false, accent: '#22c55e' });
    const { result } = renderHook(() => useThemeSettings());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.setDark(true);
    });

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({ accent: '#22c55e' })
    );
  });
});

// ─── setAccent ────────────────────────────────────────────────────────────────

describe('setAccent', () => {
  it('updates accent state immediately', async () => {
    const { result } = renderHook(() => useThemeSettings());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.setAccent('#ffd60a');
    });

    expect(result.current.accent).toBe('#ffd60a');
  });

  it('persists the new accent value to storage', async () => {
    const { result } = renderHook(() => useThemeSettings());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.setAccent('#0ea5e9');
    });

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({ accent: '#0ea5e9' })
    );
  });

  it('preserves existing dark flag when saving accent', async () => {
    mockGet.mockResolvedValue({ dark: true, accent: DEFAULT_ACCENT });
    const { result } = renderHook(() => useThemeSettings());
    await waitFor(() => expect(result.current.loaded).toBe(true));

    await act(async () => {
      await result.current.setAccent('#9b7eff');
    });

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({ dark: true })
    );
  });
});
