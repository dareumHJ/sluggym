import { createContext, useContext } from 'react';

export const ACCENTS = {
  lime: { primary: '#C6FF3D', container: '#A2D801', onPrimary: '#1B2900' },
  volt: { primary: '#E8FF54', container: '#C7E229', onPrimary: '#2A3200' },
  coral: { primary: '#FF7A59', container: '#E5613F', onPrimary: '#3A0F00' },
  violet: { primary: '#B4A0FF', container: '#8B7FFF', onPrimary: '#1A0040' },
  cyan: { primary: '#66E0FF', container: '#22B8E2', onPrimary: '#001E29' },
} as const;
export type AccentKey = keyof typeof ACCENTS;

export const PALETTES = {
  dark: {
    bg: '#0B0B0F',
    surface: '#16161D',
    surface2: '#1E1E26',
    surface3: '#2C2B32',
    surfaceHi: '#35343D',
    text: '#FFFFFF',
    textSecondary: '#8A8A95',
    textMuted: '#5A5A65',
    border: 'rgba(255,255,255,0.06)',
    borderLight: 'rgba(255,255,255,0.10)',
    borderStrong: 'rgba(255,255,255,0.16)',
    error: '#FF6B6B',
    success: '#63D39E',
    warning: '#FFD166',
  },
  light: {
    bg: '#F4F3EE',
    surface: '#FFFFFF',
    surface2: '#FAFAF6',
    surface3: '#EEEDE6',
    surfaceHi: '#E4E2D8',
    text: '#0C0C12',
    textSecondary: '#55555E',
    textMuted: '#8A8A92',
    border: 'rgba(12,12,18,0.08)',
    borderLight: 'rgba(12,12,18,0.12)',
    borderStrong: 'rgba(12,12,18,0.22)',
    error: '#D64545',
    success: '#2E9A62',
    warning: '#C4902B',
  },
} as const;
export type Mode = keyof typeof PALETTES;

type Palette = (typeof PALETTES)[Mode];
type Accent = (typeof ACCENTS)[AccentKey];

export type Theme = Palette &
  Accent & { mode: Mode; accentKey: AccentKey };

export function makeTheme(mode: Mode, accentKey: AccentKey): Theme {
  return { ...PALETTES[mode], ...ACCENTS[accentKey], mode, accentKey };
}

export const Space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;
export const Radius = { sm: 8, md: 12, lg: 16, xl: 22, '2xl': 28, full: 9999 } as const;
export const Size = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 38,
  '5xl': 48,
} as const;

export type Tweaks = {
  mode: Mode;
  accent: AccentKey;
  occupancyStyle: 'ring' | 'dots' | 'bar';
  currentOccupancy: number;
};

export const ThemeCtx = createContext<{
  theme: Theme;
  tweaks: Tweaks;
  setTweaks: (t: Partial<Tweaks>) => void;
}>({
  theme: makeTheme('dark', 'lime'),
  tweaks: { mode: 'dark', accent: 'lime', occupancyStyle: 'ring', currentOccupancy: 62 },
  setTweaks: () => {},
});

export const useTheme = () => useContext(ThemeCtx).theme;
export const useTweaks = () => useContext(ThemeCtx);

const legacyDark = makeTheme('dark', 'lime');
export const Colors = {
  background: legacyDark.bg,
  surface: legacyDark.surface,
  surface2: legacyDark.surface2,
  surfaceHigh: legacyDark.surface3,
  surfaceHighest: legacyDark.surfaceHi,
  primary: legacyDark.primary,
  primaryContainer: legacyDark.container,
  onPrimary: legacyDark.onPrimary,
  secondary: ACCENTS.violet.primary,
  text: legacyDark.text,
  textSecondary: legacyDark.textSecondary,
  textMuted: legacyDark.textMuted,
  border: legacyDark.border,
  borderLight: legacyDark.borderLight,
  error: legacyDark.error,
  success: legacyDark.success,
  warning: legacyDark.warning,
} as const;

export const BorderRadius = Radius;
export const FontSize = Size;
export const Spacing = Space;

export function withAlpha(hex: string, a: number): string {
  if (!hex) return `rgba(0,0,0,${a})`;
  if (hex.startsWith('rgba')) return hex;
  if (hex.startsWith('rgb(')) return hex.replace('rgb(', 'rgba(').replace(')', `,${a})`);
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
