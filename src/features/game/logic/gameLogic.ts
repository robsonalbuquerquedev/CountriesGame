import { COUNTRIES } from '../../../data/countries';
import { Country, Difficulty, GameMode, MatchRecord } from '../../../types';

export const POINTS_PER_CORRECT = 10;
export const INITIAL_LIVES = 3;
export const TOTAL_HINTS = 4;

/* ───────────────────────── Países e dificuldade ───────────────────────── */

// O tamanho considera todos os caracteres do nome, incluindo espaços (Hint 2).
export function filterByDifficulty(difficulty: Difficulty): Country[] {
  switch (difficulty) {
    case 'easy':
      return COUNTRIES.filter((c) => c.name.length <= 6);
    case 'medium':
      return COUNTRIES.filter((c) => c.name.length >= 7 && c.name.length <= 10);
    case 'hard':
      return COUNTRIES.filter((c) => c.name.length > 10);
    case 'all':
    case 'random': // Random Global Mix: qualquer tamanho e continente
    default:
      return COUNTRIES;
  }
}

/**
 * Sorteia um país que ainda não saiu na partida e o marca como usado.
 * Quando todos já saíram, o controle é reiniciado (o Set recebido é limpo).
 */
export function pickCountry(pool: Country[], used: Set<string>): Country {
  let available = pool.filter((c) => !used.has(c.name));
  if (available.length === 0) {
    used.clear();
    available = pool;
  }
  const chosen = available[Math.floor(Math.random() * available.length)];
  used.add(chosen.name);
  return chosen;
}

/* ───────────────────────── Anagrama ───────────────────────── */

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Letras do nome (sem espaços e hífens), embaralhadas e garantidamente diferentes do original.
export function scramble(name: string): string[] {
  const letters = name.replace(/[\s-]/g, '').toUpperCase().split('');
  if (new Set(letters).size <= 1) return letters;

  const original = letters.join('');
  let result = shuffle(letters);
  let attempts = 0;
  while (result.join('') === original && attempts < 20) {
    result = shuffle(letters);
    attempts++;
  }
  return result;
}

/* ───────────────────────── Validação ───────────────────────── */

const normalize = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[-']/g, ' ')
    .replace(/\s+/g, ' ');

export function checkAnswer(input: string, country: Country): boolean {
  const answer = normalize(input);
  if (!answer) return false;
  return [country.name, ...(country.aliases ?? [])].some((n) => normalize(n) === answer);
}

/* ───────────────────────── Dicas ───────────────────────── */

export interface Hint {
  label: string;
  value: string;
}

export function getHints(country: Country): Hint[] {
  return [
    { label: 'Dica 1 · Continente', value: country.continent },
    { label: 'Dica 2 · Nº de caracteres', value: String(country.name.length) },
    { label: 'Dica 3 · Em português', value: country.namePt },
    { label: 'Dica 4 · Capital', value: country.capital },
  ];
}

/* ───────────────────────── Estado da partida ───────────────────────── */

export type ContinentStats = Record<string, { correct: number; total: number }>;

export interface RoundStats {
  score: number;
  correct: number;
  total: number;
  lives: number; // Infinity no modo livre
  byContinent: ContinentStats;
}

export function initialStats(mode: GameMode): RoundStats {
  return {
    score: 0,
    correct: 0,
    total: 0,
    lives: mode === 'classic' ? INITIAL_LIVES : Number.POSITIVE_INFINITY,
    byContinent: {},
  };
}

export function applyAnswer(
  stats: RoundStats,
  country: Country,
  isCorrect: boolean,
  mode: GameMode
): RoundStats {
  const prev = stats.byContinent[country.continent] ?? { correct: 0, total: 0 };
  return {
    score: stats.score + (isCorrect ? POINTS_PER_CORRECT : 0),
    correct: stats.correct + (isCorrect ? 1 : 0),
    total: stats.total + 1,
    lives: mode === 'classic' && !isCorrect ? stats.lives - 1 : stats.lives,
    byContinent: {
      ...stats.byContinent,
      [country.continent]: {
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      },
    },
  };
}

export function isGameOver(stats: RoundStats, mode: GameMode): boolean {
  return mode === 'classic' && stats.lives <= 0;
}

export function buildMatchRecord(
  stats: RoundStats,
  mode: GameMode,
  difficulty: Difficulty
): MatchRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    mode,
    difficulty,
    correct: stats.correct,
    total: stats.total,
    score: stats.score,
    byContinent: stats.byContinent,
  };
}

// Percentual de acerto (0 a 100), útil para Ranking e Resultado.
export function accuracy(match: Pick<MatchRecord, 'correct' | 'total'>): number {
  return match.total === 0 ? 0 : Math.round((match.correct / match.total) * 100);
}