import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Country, RootStackParamList } from '../../../types';
import { colors, fontSize, radius, spacing } from '../../../theme';
import { useStatsStore } from '../../../store/statsStore';
import { useSettingsStore } from '../../../store/settingsStore';
import { useSounds } from '../../../utils/useSounds';
import LetterTile from '../components/LetterTile';
import {
  INITIAL_LIVES,
  POINTS_PER_CORRECT,
  TOTAL_HINTS,
  applyAnswer,
  buildMatchRecord,
  checkAnswer,
  filterByDifficulty,
  getHints,
  initialStats,
  isGameOver,
  pickCountry,
  scramble,
} from '../logic/gameLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export default function GameScreen({ navigation, route }: Props) {
  const { mode, difficulty } = route.params;
  const addMatch = useStatsStore((s) => s.addMatch);
  const { playCorrect, playWrong } = useSounds();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const toggleSound = useSettingsStore((s) => s.toggleSound);

  // Random Global Mix sorteia primeiro o continente (chance igual para todos)
  const balanced = difficulty === 'random';

  // Países disponíveis para a dificuldade escolhida e controle dos já usados
  const pool = useMemo(() => filterByDifficulty(difficulty), [difficulty]);
  const usedRef = useRef<Set<string>>(new Set());

  const [country, setCountry] = useState<Country>(() =>
    pickCountry(pool, usedRef.current, balanced)
  );
  const [stats, setStats] = useState(() => initialStats(mode));
  const [hintsShown, setHintsShown] = useState(0);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<boolean | null>(null); // null = ainda não respondeu
  const [celebrate, setCelebrate] = useState(0); // aumenta a cada acerto (animação das letras)

  const shakeX = useRef(new Animated.Value(0)).current;

  const letters = useMemo(() => scramble(country.name), [country]);
  const hints = useMemo(() => getHints(country), [country]);

  const answered = result !== null;
  const gameOver = answered && isGameOver(stats, mode);

  /* ───────────── Animações ───────────── */

  // Tremida horizontal do campo de resposta ao errar
  const runShake = () => {
    const step = (toValue: number) =>
      Animated.timing(shakeX, { toValue, duration: 50, useNativeDriver: true });

    Animated.sequence([step(10), step(-10), step(8), step(-8), step(0)]).start();
  };

  /* ───────────── Ações ───────────── */

  const handleSubmit = () => {
    if (answered || input.trim() === '') return;
    Keyboard.dismiss();

    const isCorrect = checkAnswer(input, country);
    setStats((prev) => applyAnswer(prev, country, isCorrect, mode));
    setResult(isCorrect);

    if (isCorrect) {
      playCorrect();
      setCelebrate((n) => n + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      playWrong();
      runShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const finishGame = () => {
    // Partida sem nenhuma resposta não entra no histórico
    if (stats.total === 0) {
      navigation.goBack();
      return;
    }
    const match = buildMatchRecord(stats, mode, difficulty);
    addMatch(match);
    navigation.replace('Result', { match });
  };

  const handleNext = () => {
    if (gameOver) {
      finishGame();
      return;
    }
    setCountry(pickCountry(pool, usedRef.current, balanced));
    setHintsShown(0);
    setInput('');
    setResult(null);
  };

  const handleExit = () => {
    Alert.alert('Sair da partida?', 'Seu progresso será salvo no histórico.', [
      { text: 'Continuar jogando', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: finishGame },
    ]);
  };

  /* ───────────── Interface ───────────── */

  const livesLabel =
    mode === 'classic'
      ? '♥'.repeat(Math.max(stats.lives, 0)) + '♡'.repeat(INITIAL_LIVES - Math.max(stats.lives, 0))
      : '∞ Treino livre';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Barra superior */}
        <View style={styles.topBar}>
          <Text style={styles.lives}>{livesLabel}</Text>
          <Text style={styles.score}>{stats.score} pts</Text>
          <View style={styles.topActions}>
            <Pressable
              onPress={toggleSound}
              style={styles.soundButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={soundEnabled ? 'Desligar som' : 'Ligar som'}
            >
              <Text style={styles.soundIcon}>{soundEnabled ? '🔊' : '🔇'}</Text>
            </Pressable>
            <Pressable onPress={handleExit} style={styles.exitButton} hitSlop={8}>
              <Text style={styles.exitText}>Sair</Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Decifre o país</Text>

          {/* Anagrama (a key inclui o país para as letras animarem a entrada a cada rodada) */}
          <View style={styles.tiles}>
            {letters.map((letter, index) => (
              <LetterTile
                key={`${country.name}-${index}`}
                letter={letter}
                index={index}
                celebrate={celebrate}
              />
            ))}
          </View>

          {/* Dicas reveladas uma a uma */}
          <View style={styles.hintsBox}>
            {hintsShown === 0 && (
              <Text style={styles.hintPlaceholder}>
                Precisa de ajuda? Toque em "Mostrar dica".
              </Text>
            )}
            {hints.slice(0, hintsShown).map((hint) => (
              <View key={hint.label} style={styles.hintRow}>
                <Text style={styles.hintLabel}>{hint.label}</Text>
                <Text style={styles.hintValue}>{hint.value}</Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() => setHintsShown((n) => Math.min(n + 1, TOTAL_HINTS))}
            disabled={answered || hintsShown >= TOTAL_HINTS}
            style={[
              styles.secondaryButton,
              (answered || hintsShown >= TOTAL_HINTS) && styles.disabled,
            ]}
          >
            <Text style={styles.secondaryText}>
              Mostrar dica ({hintsShown}/{TOTAL_HINTS})
            </Text>
          </Pressable>

          {/* Resposta (treme ao errar) */}
          <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSubmit}
              editable={!answered}
              placeholder="Digite o nome em inglês"
              placeholderTextColor={colors.muted}
              autoCapitalize="words"
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
              returnKeyType="done"
              style={[
                styles.input,
                answered && styles.disabled,
                result === false && styles.inputWrong,
              ]}
            />
          </Animated.View>

          {!answered ? (
            <Pressable
              onPress={handleSubmit}
              disabled={input.trim() === ''}
              style={[styles.primaryButton, input.trim() === '' && styles.disabled]}
            >
              <Text style={styles.primaryText}>Responder</Text>
            </Pressable>
          ) : (
            <View
              style={[
                styles.feedback,
                { borderColor: result ? colors.success : colors.danger },
              ]}
            >
              <Text
                style={[
                  styles.feedbackTitle,
                  { color: result ? colors.success : colors.danger },
                ]}
              >
                {result ? `Correto! +${POINTS_PER_CORRECT} pontos` : 'Não foi dessa vez'}
              </Text>
              <Text style={styles.feedbackAnswer}>
                {country.name} = {country.namePt}
              </Text>
              <Text style={styles.feedbackSub}>
                Capital: {country.capital} · {country.continent}
              </Text>

              {gameOver && (
                <Text style={styles.gameOver}>Fim de jogo: suas vidas acabaram.</Text>
              )}

              <Pressable onPress={handleNext} style={styles.primaryButton}>
                <Text style={styles.primaryText}>
                  {gameOver ? 'Ver resultado' : 'Próximo país'}
                </Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: colors.background },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  lives: { color: colors.danger, fontSize: fontSize.lg, fontWeight: '700' },
  score: { color: colors.warning, fontSize: fontSize.lg, fontWeight: '700' },
  exitButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exitText: { color: colors.muted, fontSize: fontSize.md, fontWeight: '600' },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundIcon: { fontSize: 18 },

  content: { padding: spacing.md, paddingBottom: spacing.xl, gap: spacing.md },
  title: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    textAlign: 'center',
  },

  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  hintsBox: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 64,
    justifyContent: 'center',
  },
  hintPlaceholder: { color: colors.muted, textAlign: 'center', fontSize: fontSize.md },
  hintRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  hintLabel: { color: colors.muted, fontSize: fontSize.md, flexShrink: 1 },
  hintValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },

  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
  inputWrong: { borderColor: colors.danger, borderWidth: 2 },

  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryText: { color: colors.primaryText, fontSize: fontSize.lg, fontWeight: '800' },
  secondaryButton: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryText: { color: colors.primary, fontSize: fontSize.md, fontWeight: '700' },
  disabled: { opacity: 0.4 },

  feedback: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 2,
    padding: spacing.md,
    gap: spacing.sm,
  },
  feedbackTitle: { fontSize: fontSize.lg, fontWeight: '800', textAlign: 'center' },
  feedbackAnswer: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  feedbackSub: { color: colors.muted, fontSize: fontSize.md, textAlign: 'center' },
  gameOver: {
    color: colors.danger,
    fontSize: fontSize.md,
    fontWeight: '700',
    textAlign: 'center',
  },
});