// src/features/game/logic/cryptogramLogic.ts
import { Country, CryptogramLevel, MatchRecord } from '../../../types';

/* ───────────────────────── Configuração ───────────────────────── */

// 'symbols' mostra figuras (★ ♠ ●...). Se algum símbolo aparecer como quadrado no seu celular,
// troque para 'numbers' (1 a 26), que funciona em qualquer aparelho.
export const SYMBOL_STYLE: 'symbols' | 'numbers' = 'symbols';

const SYMBOLS = [
  '★', '☆', '♠', '♥', '♦', '♣', '●', '■', '▲', '▼', '◆', '○', '□',
  '△', '▽', '◇', '♪', '♫', '✚', '✖', '✱', '❖', '◐', '◑', '☼', '✿',
];
const NUMBERS = Array.from({ length: 26 }, (_, i) => String(i + 1));

// Cor de cada símbolo, para facilitar a distinção (funcionam nos temas claro e escuro)
export const SYMBOL_COLORS = ['#E11D48', '#2563EB', '#16A34A', '#D97706', '#7C3AED', '#0891B2'];

export const LEVEL_CONFIG: Record<
  CryptogramLevel,
  { words: number; minLen: number; maxLen: number; given: number }
> = {
  easy: { words: 5, minLen: 4, maxLen: 7, given: 5 }, // 5 países, 5 letras já reveladas
  medium: { words: 7, minLen: 5, maxLen: 9, given: 3 },
  hard: { words: 9, minLen: 6, maxLen: 11, given: 1 },
};

/* ───────────────────────── Tipos ───────────────────────── */

export interface CryptoWord {
  country: Country;
  letters: string[]; // letras do nome em maiúsculas
  clue: string; // dica mostrada junto às casinhas
}

export interface CryptoPuzzle {
  level: CryptogramLevel;
  words: CryptoWord[];
  letters: string[]; // letras distintas do quebra-cabeça, em ordem alfabética
  symbols: Record<string, string>; // letra -> símbolo
  colors: Record<string, string>; // letra -> cor do símbolo
  given: string[]; // letras já reveladas no começo
}

/** Respostas do jogador: chave = letra verdadeira (o símbolo), valor = letra que ele escolheu. */
export type Assignment = Record<string, string>;

/* ───────────────────────── Geração ───────────────────────── */

function shuffle<T>(items: T[], rand: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function clueFor(country: Country, level: CryptogramLevel): string {
  if (level === 'easy') return `${country.namePt} · ${country.continent}`;
  if (level === 'medium') return country.namePt;
  return `Capital: ${country.capital} · ${country.continent}`;
}

const lettersOf = (name: string) => name.toUpperCase().split('');

/**
 * Monta um criptograma: sorteia países que compartilham letras (para um símbolo aparecer em
 * várias palavras), liga cada letra a um símbolo e já revela algumas letras.
 * Só entram nomes de uma palavra (sem espaço ou hífen).
 */
export function generatePuzzle(
  level: CryptogramLevel,
  countries: Country[],
  rand: () => number = Math.random
): CryptoPuzzle {
  const cfg = LEVEL_CONFIG[level];
  const singleWord = countries.filter((c) => /^[A-Za-z]+$/.test(c.name));

  let candidates = singleWord.filter(
    (c) => c.name.length >= cfg.minLen && c.name.length <= cfg.maxLen
  );
  if (candidates.length < cfg.words) candidates = singleWord;

  // 1) Escolhe os países, preferindo os que repetem letras já usadas
  const first = candidates[Math.floor(rand() * candidates.length)];
  const chosen: Country[] = [first];
  const used = new Set(lettersOf(first.name));

  while (chosen.length < cfg.words) {
    const remaining = shuffle(
      candidates.filter((c) => !chosen.includes(c)),
      rand
    ).slice(0, 15);
    if (remaining.length === 0) break;

    let best = remaining[0];
    let bestScore = -1;
    for (const c of remaining) {
      const score = new Set(lettersOf(c.name).filter((l) => used.has(l))).size;
      if (score > bestScore) {
        best = c;
        bestScore = score;
      }
    }
    chosen.push(best);
    lettersOf(best.name).forEach((l) => used.add(l));
  }

  const words: CryptoWord[] = chosen.map((country) => ({
    country,
    letters: lettersOf(country.name),
    clue: clueFor(country, level),
  }));

  // 2) Liga cada letra a um símbolo diferente
  const letters = Array.from(used).sort();
  const pool = shuffle(SYMBOL_STYLE === 'numbers' ? NUMBERS : SYMBOLS, rand);
  const symbols: Record<string, string> = {};
  const colors: Record<string, string> = {};
  letters.forEach((letter, i) => {
    symbols[letter] = pool[i];
    colors[letter] = SYMBOL_COLORS[i % SYMBOL_COLORS.length];
  });

  // 3) Revela algumas letras (as que aparecem mais de uma vez ajudam mais), sempre deixando trabalho
  const counts: Record<string, number> = {};
  words.forEach((w) => w.letters.forEach((l) => (counts[l] = (counts[l] ?? 0) + 1)));
  const repeated = letters.filter((l) => counts[l] >= 2);
  const givenCount = Math.min(cfg.given, Math.max(letters.length - 3, 0));
  const given = shuffle(repeated, rand).slice(0, givenCount);

  return { level, words, letters, symbols, colors, given };
}

/* ───────────────────────── Jogada ───────────────────────── */

export function givenAssignment(puzzle: CryptoPuzzle): Assignment {
  const assign: Assignment = {};
  puzzle.given.forEach((l) => (assign[l] = l));
  return assign;
}

/**
 * Atribui `guess` ao símbolo `key`. Uma letra só pode valer um símbolo: se `guess` já estava em
 * outro símbolo (que não seja fixo), esse outro volta a ficar vazio.
 */
export function assignLetter(
  assign: Assignment,
  locked: string[],
  key: string,
  guess: string
): Assignment {
  const next: Assignment = { ...assign };
  Object.keys(next).forEach((k) => {
    if (k !== key && next[k] === guess && !locked.includes(k)) delete next[k];
  });
  next[key] = guess;
  return next;
}

export function removeLetter(assign: Assignment, locked: string[], key: string): Assignment {
  if (locked.includes(key)) return assign;
  const next: Assignment = { ...assign };
  delete next[key];
  return next;
}

/** Símbolos que o jogador preencheu com a letra errada (ignora os fixos). */
export function wrongKeys(assign: Assignment, locked: string[]): string[] {
  return Object.keys(assign).filter((k) => !locked.includes(k) && assign[k] !== k);
}

export function isSolved(puzzle: CryptoPuzzle, assign: Assignment): boolean {
  return puzzle.letters.every((l) => assign[l] === l);
}

/* ───────────────────────── Pontos e registro ───────────────────────── */

// 10 pontos por palavra, -2 por letra errada apontada em "Verificar", -5 por letra revelada
export function cryptogramScore(wordCount: number, errors: number, reveals: number): number {
  return Math.max(wordCount * 10 - errors * 2 - reveals * 5, 10);
}

export function buildCryptogramRecord(
  puzzle: CryptoPuzzle,
  score: number,
  durationSec: number
): MatchRecord {
  const byContinent: MatchRecord['byContinent'] = {};
  puzzle.words.forEach((w) => {
    const prev = byContinent[w.country.continent] ?? { correct: 0, total: 0 };
    byContinent[w.country.continent] = { correct: prev.correct + 1, total: prev.total + 1 };
  });

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
    mode: 'free',
    difficulty: puzzle.level,
    kind: 'cryptogram',
    correct: puzzle.words.length,
    total: puzzle.words.length,
    score,
    byContinent,
    durationSec,
  };
}

export function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}