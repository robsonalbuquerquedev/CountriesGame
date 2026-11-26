// Cole este conteúdo no seu arquivo de tema (src/theme/index.ts ou src/theme.ts).

export const darkColors = {
  background: '#0F172A',
  card: '#1E293B',
  tile: '#334155',
  primary: '#38BDF8',
  primaryText: '#0F172A',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#FACC15',
  text: '#F8FAFC',
  muted: '#94A3B8',
  border: '#475569',
};

export type Palette = typeof darkColors;

// Tons mais escuros no claro, para manter bom contraste do texto sobre fundo branco
export const lightColors: Palette = {
  background: '#F1F5F9',
  card: '#FFFFFF',
  tile: '#E2E8F0',
  primary: '#0369A1',
  primaryText: '#FFFFFF',
  success: '#15803D',
  danger: '#B91C1C',
  warning: '#B45309',
  text: '#0F172A',
  muted: '#475569',
  border: '#CBD5E1',
};

// Legado: telas que ainda importam `colors` direto continuam no tema escuro
// até serem migradas para o hook useTheme().
export const colors = darkColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
};

export const fontSize = {
  sm: 13,
  md: 16,
  lg: 20,
  xl: 28,
};