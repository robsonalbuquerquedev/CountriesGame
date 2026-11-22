import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;

  // Garante que o pedido de avaliação da Play Store apareça no máximo uma vez
  reviewRequested: boolean;
  markReviewRequested: () => void;
}

// Preferências do jogador, salvas no aparelho (ficam mesmo depois de fechar o app)
export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      reviewRequested: false,
      markReviewRequested: () => set({ reviewRequested: true }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);