import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { MatchRecord } from '../types';

interface StatsState {
  matches: MatchRecord[]; // mais recente primeiro
  addMatch: (match: MatchRecord) => void;
  clearAll: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      matches: [],
      addMatch: (match) => set((state) => ({ matches: [match, ...state.matches] })),
      clearAll: () => set({ matches: [] }),
    }),
    {
      name: 'stats-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);