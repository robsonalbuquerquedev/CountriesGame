// src/utils/labels.ts (substitui o arquivo inteiro)
import { Difficulty, GameKind, GameMode, MatchRecord } from '../types';

export const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Classic Mode',
  free: 'Free Practice Mode',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  all: 'All',
  random: 'Random Global Mix',
};

export const KIND_LABELS: Record<GameKind, string> = {
  anagram: 'Anagramas',
  flags: 'Bandeiras',
  cryptogram: 'Criptograma',
};

// Texto curto que descreve uma partida (usado no histórico, ranking e resultado)
export function matchLabel(match: Pick<MatchRecord, 'mode' | 'difficulty' | 'kind'>): string {
  const difficulty = DIFFICULTY_LABELS[match.difficulty];

  if (match.kind === 'cryptogram') return `Criptograma · ${difficulty}`;

  const base = `${MODE_LABELS[match.mode]} · ${difficulty}`;
  return match.kind === 'flags' ? `Bandeiras · ${base}` : base;
}