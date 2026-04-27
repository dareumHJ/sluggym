export const Colors = {
  background: '#0B0B0F',
  surface: '#16161D',
  surfaceHigh: '#2C2B32',
  surfaceHighest: '#25252B',

  primary: '#C6FF3D',
  primaryContainer: '#A2D801',
  onPrimary: '#455F00',

  secondary: '#8B7FFF',

  text: '#FFFFFF',
  textSecondary: '#8A8A95',
  textMuted: '#5A5A65',

  border: 'rgba(255, 255, 255, 0.05)',
  borderLight: 'rgba(255, 255, 255, 0.1)',

  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;
