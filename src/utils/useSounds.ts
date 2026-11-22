import { useAudioPlayer } from 'expo-audio';

import { useSettingsStore } from '../store/settingsStore';

type Player = ReturnType<typeof useAudioPlayer>;

// Reinicia o som do começo e toca. Qualquer falha de áudio é ignorada: o jogo nunca deve quebrar por causa de som.
function replay(player: Player) {
  try {
    player.seekTo(0);
    player.play();
  } catch {
    // sem áudio disponível; segue o jogo
  }
}

export function useSounds() {
  const correct = useAudioPlayer(require('../../assets/sounds/correct.wav'));
  const wrong = useAudioPlayer(require('../../assets/sounds/wrong.wav'));

  // Lê a preferência no momento de tocar (getState), assim o botão de som vale na hora
  const enabled = () => useSettingsStore.getState().soundEnabled;

  return {
    playCorrect: () => {
      if (enabled()) replay(correct);
    },
    playWrong: () => {
      if (enabled()) replay(wrong);
    },
  };
}