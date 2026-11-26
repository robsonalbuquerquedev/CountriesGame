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

export interface MatchRecord {
  id: string;
  date: string; // ISO 8601
  mode: GameMode;
  difficulty: Difficulty;
  continents?: Continent[]; // filtro usado na partida; ausente = todos
  correct: number;
  total: number;
  score: number;
  byContinent: Record<string, { correct: number; total: number }>;
}

export type RootStackParamList = {
  Home: undefined;
  ModeSelect: undefined;
  Difficulty: { mode: GameMode };
  Game: { mode: GameMode; difficulty: Difficulty; continents?: Continent[] };
  Result: { match: MatchRecord };
  Stats: undefined;
  Ranking: undefined;
  History: undefined;
  About: undefined;
  Countries: undefined;
};