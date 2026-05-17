// ─── Color themes ────────────────────────────────────────────────────────────

export const lightTheme = {
  paper: '#f4efe6',
  ink: '#181613',
  muted: '#7a7468',
  line: 'rgba(24,22,19,0.10)',
  card: '#ffffff',
} as const;

export const darkTheme = {
  paper: '#0e0d0c',
  ink: '#f4efe6',
  muted: '#8a8580',
  line: 'rgba(255,255,255,0.10)',
  card: '#1c1c1c',
} as const;

export type Theme = typeof lightTheme;

// ─── Accent palette ───────────────────────────────────────────────────────────

export const ACCENT_PALETTE = [
  { id: '#ff5722', name: 'Tomato' },
  { id: '#ffd60a', name: 'Sunshine' },
  { id: '#9b7eff', name: 'Lilac' },
  { id: '#22c55e', name: 'Mint' },
  { id: '#0ea5e9', name: 'Cobalt' },
] as const;

export type AccentColor = (typeof ACCENT_PALETTE)[number]['id'];

export const DEFAULT_ACCENT: AccentColor = '#ff5722';
export const DEFAULT_DARK = false;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// ─── Card shadow (light mode only) ───────────────────────────────────────────

export const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.06,
  shadowRadius: 24,
  elevation: 4,
} as const;

// ─── Screen layout constants ──────────────────────────────────────────────────

export const ScreenPaddingH = 20;
export const ScreenPaddingTop = 70;
export const ScreenPaddingBottom = 110;
export const TAB_BAR_HEIGHT = 60;

// ─── Font names ───────────────────────────────────────────────────────────────

export const Fonts = {
  displayBold: 'BricolageGrotesque_700Bold',
  displayExtraBold: 'BricolageGrotesque_800ExtraBold',
  bodyRegular: 'Geist_400Regular',
  bodyMedium: 'Geist_500Medium',
  bodySemiBold: 'Geist_600SemiBold',
  bodyBold: 'Geist_700Bold',
  accentItalic: 'InstrumentSerif_400Regular_Italic',
} as const;
