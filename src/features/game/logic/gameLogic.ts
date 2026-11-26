import { COUNTRIES } from '../../../data/countries';
import { Continent, Country, Difficulty, GameMode, MatchRecord } from '../../../types';

export const POINTS_PER_CORRECT = 10;
export const INITIAL_LIVES = 3;
export const TOTAL_HINTS = 4;

/* ───────────────────────── Países e dificuldade ───────────────────────── */

// O tamanho considera todos os caracteres do nome, incluindo espaços.
// `continents` é opcional: vazio ou ausente = todos os continentes.
export function filterByDifficulty(
  difficulty: Difficulty,
  continents?: Continent[]
): Country[] {
  const base =
    continents && continents.length > 0
      ? COUNTRIES.filter((c) => continents.includes(c.continent))
      : COUNTRIES;

  switch (difficulty) {
    case 'easy':
      return base.filter((c) => c.name.length <= 6);
    case 'medium':
      return base.filter((c) => c.name.length >= 7 && c.name.length <= 10);
    case 'hard':
      return base.filter((c) => c.name.length > 10);
    case 'all':
    case 'random': // Random Global Mix: qualquer tamanho, equilibrado entre os continentes escolhidos
    default:
      return base;
  }
}

/**
 * Sorteia um país que ainda não saiu na partida e o marca como usado.
 * Quando todos já saíram, o controle é reiniciado (o Set recebido é limpo).
 */
export function pickCountry(
  pool: Country[],
  used: Set<string>,
  balanced = false // true = sorteia o continente primeiro (Random Global Mix)
): Country {
  let available = pool.filter((c) => !used.has(c.name));
  if (available.length === 0) {
    used.clear();
    available = pool;
  }

  let candidates = available;
  if (balanced) {
    const continents = Array.from(new Set(available.map((c) => c.continent)));
    const chosen = continents[Math.floor(Math.random() * continents.length)];
    candidates = available.filter((c) => c.continent === chosen);
  }

  const country = candidates[Math.floor(Math.random() * candidates.length)];
  used.add(country.name);
  return country;
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

// Detecta letras (inclusive com acento), ignorando espaço, hífen e apóstrofo
const isLetter = (ch: string) => ch.toLowerCase() !== ch.toUpperCase();

// Mesmos limites de tamanho usados em filterByDifficulty
type HintLevel = 'easy' | 'medium' | 'hard';

function hintLevel(country: Country): HintLevel {
  const len = country.name.length;
  if (len <= 6) return 'easy';
  if (len <= 10) return 'medium';
  return 'hard';
}

// Dica 2: letra inicial (e quantas palavras, quando o nome tem mais de uma).
// As peças na tela não mostram espaços nem hífens, então isso é informação nova.
function startHint(country: Country): string {
  const first = country.name.charAt(0).toUpperCase();
  const words = country.name.trim().split(/\s+/).length;
  return words > 1 ? `Começa com "${first}" · ${words} palavras` : `Começa com "${first}"`;
}

// Revela uma letra a cada `step` letras (a 1ª sempre aparece) e esconde as demais.
// Mantém espaços, hífens e apóstrofos visíveis.
// step 2: Brazil -> B _ a _ i _   |   step 3: Germany -> G _ _ m _ _ y
function revealEvery(country: Country, step: number): string {
  let n = 0;
  return country.name
    .split('')
    .map((ch) => {
      if (!isLetter(ch)) return ch;
      const show = n % step === 0;
      n += 1;
      return show ? ch : '_';
    })
    .join(' ');
}

// Mostra só a primeira e a última letra de cada palavra.
// United States -> U _ _ _ _ d   S _ _ _ _ s
function firstAndLastOfEachWord(country: Country): string {
  const chars = country.name.split('');
  return chars
    .map((ch, i) => {
      if (!isLetter(ch)) return ch;
      const isFirst = i === 0 || !isLetter(chars[i - 1]);
      const isLast = i === chars.length - 1 || !isLetter(chars[i + 1]);
      return isFirst || isLast ? ch : '_';
    })
    .join(' ');
}

/**
 * As dicas ficam mais econômicas conforme o nome é mais longo (mais difícil):
 *  - fácil:  continente, letra inicial, nome em português, metade das letras
 *  - médio:  continente, letra inicial, nome em português, uma letra a cada três
 *  - difícil: continente, letra inicial, capital, primeira e última letra de cada palavra
 */
export function getHints(country: Country): Hint[] {
  const level = hintLevel(country);

  const hint1: Hint = { label: 'Dica 1 · Continente', value: country.continent };
  const hint2: Hint = { label: 'Dica 2 · Letra inicial', value: startHint(country) };

  if (level === 'hard') {
    return [
      hint1,
      hint2,
      { label: 'Dica 3 · Capital', value: country.capital },
      { label: 'Dica 4 · Início e fim das palavras', value: firstAndLastOfEachWord(country) },
    ];
  }

  return [
    hint1,
    hint2,
    { label: 'Dica 3 · Em português', value: country.namePt },
    {
      label: level === 'easy' ? 'Dica 4 · Metade das letras' : 'Dica 4 · Algumas letras',
      value: revealEvery(country, level === 'easy' ? 2 : 3),
    },
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
  difficulty: Difficulty,
  continents?: Continent[] // filtro usado na partida; ausente = todos
): MatchRecord {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    mode,
    difficulty,
    continents: continents && continents.length > 0 ? continents : undefined,
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