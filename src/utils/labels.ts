import { Difficulty, GameMode } from '../types';

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