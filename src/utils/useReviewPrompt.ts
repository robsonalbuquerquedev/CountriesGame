import { useEffect } from 'react';
import * as StoreReview from 'expo-store-review';

import { MatchRecord } from '../types';
import { useSettingsStore } from '../store/settingsStore';
import { useStatsStore } from '../store/statsStore';
import { accuracy } from '../features/game/logic/gameLogic';

const MIN_MATCHES = 5; // só pede depois de o jogador já ter jogado bastante
const MIN_ACCURACY = 70; // só pede depois de uma boa partida (momento de satisfação)

/**
 * Pede a avaliação do app na Play Store, no máximo uma vez, depois de uma boa partida.
 * A Google controla se a janela aparece (há limite de exibições), então nada aqui é garantido.
 */
export function useReviewPrompt(match: MatchRecord) {
  useEffect(() => {
    const { reviewRequested, markReviewRequested } = useSettingsStore.getState();
    const matchesPlayed = useStatsStore.getState().matches.length;

    if (reviewRequested || matchesPlayed < MIN_MATCHES || accuracy(match) < MIN_ACCURACY) {
      return;
    }

    // Pequena pausa para o jogador ver o resultado antes da janela aparecer
    const timer = setTimeout(async () => {
      try {
        if (await StoreReview.hasAction()) {
          markReviewRequested();
          await StoreReview.requestReview();
        }
      } catch {
        // sem suporte ou sem Play Store: segue o jogo normalmente
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [match]);
}