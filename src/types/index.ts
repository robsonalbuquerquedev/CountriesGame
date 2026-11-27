// src/types/index.ts (substitui o arquivo inteiro)

export type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania';

export interface Country {
  name: string; // "Germany"
  namePt: string; // "Alemanha"
  capital: string; // "Berlin"
  continent: Continent;
  aliases?: string[]; // grafias alternativas aceitas (ex.: "Czechia")
}

export type GameMode = 'classic' | 'free';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'all' | 'random';

// Tipo de jogo: anagramas (o original), bandeiras e criptograma
export type GameKind = 'anagram' | 'flags' | 'cryptogram';

// O criptograma usa só três níveis (guardados em MatchRecord.difficulty)
export type CryptogramLevel = 'easy' | 'medium' | 'hard';

export interface MatchRecord {
  id: string;
  date: string; // ISO 8601
  mode: GameMode;
  difficulty: Difficulty;
  kind?: GameKind; // ausente em partidas antigas = anagramas
  continents?: Continent[]; // filtro usado na partida; ausente = todos
  correct: number;
  total: number;
  score: number;
  byContinent: Record<string, { correct: number; total: number }>;
  durationSec?: number; // só no criptograma
}

export type RootStackParamList = {
  Home: undefined;
  GameSelect: undefined;
  ModeSelect: { kind: GameKind };
  Difficulty: { mode: GameMode; kind: GameKind };
  Game: { mode: GameMode; difficulty: Difficulty; continents?: Continent[]; kind?: GameKind };
  CryptogramLevel: undefined;
  Cryptogram: { level: CryptogramLevel };
  Result: { match: MatchRecord };
  Countries: undefined;
  Stats: undefined;
  Ranking: undefined;
  History: undefined;
  About: undefined;
};