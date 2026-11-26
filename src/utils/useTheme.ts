// src/utils/useTheme.ts
import { useColorScheme } from 'react-native';

import { Palette, darkColors, lightColors } from '../theme';
import { useThemeStore } from '../store/themeStore';

export type Scheme = 'dark' | 'light';

// Devolve as cores do tema atual (e re-renderiza a tela quando ele muda).
export function useTheme(): { colors: Palette; scheme: Scheme } {
  const mode = useThemeStore((s) => s.mode);
  const system = useColorScheme();

  const scheme: Scheme = mode === 'system' ? (system === 'light' ? 'light' : 'dark') : mode;

  return { colors: scheme === 'light' ? lightColors : darkColors, scheme };
}