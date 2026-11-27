// src/features/game/screens/CryptogramScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { COUNTRIES } from '../../../data/countries';
import { RootStackParamList } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { useSounds } from '../../../utils/useSounds';
import { useStatsStore } from '../../../store/statsStore';
import { DIFFICULTY_LABELS } from '../../../utils/labels';
import {
  Assignment,
  assignLetter,
  buildCryptogramRecord,
  cryptogramScore,
  generatePuzzle,
  givenAssignment,
  isSolved,
  removeLetter,
  wrongKeys,
} from '../logic/cryptogramLogic';

type Props = NativeStackScreenProps<RootStackParamList, 'Cryptogram'>;

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const BOX_GAP = 4;
const KEY_GAP = 6;
const KEYS_PER_ROW = 9;

export default function CryptogramScreen({ navigation, route }: Props) {
  const { level } = route.params;
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { width } = useWindowDimensions();

  const addMatch = useStatsStore((s) => s.addMatch);
  const { playCorrect, playWrong } = useSounds();

  const [puzzle] = useState(() => generatePuzzle(level, COUNTRIES));
  const [assign, setAssign] = useState<Assignment>(() => givenAssignment(puzzle));
  const [locked, setLocked] = useState<string[]>(puzzle.given);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const [reveals, setReveals] = useState(0);
  const [message, setMessage] = useState('Toque em uma casinha e escolha a letra.');

  const startedAt = useRef(Date.now());
  const finished = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ───────────── Vitória ───────────── */

  useEffect(() => {
    if (finished.current || !isSolved(puzzle, assign)) return;
    finished.current = true;
    setSelected(null);
    setMessage('Parabéns! Você completou o criptograma. 🎉');
    playCorrect();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    timer.current = setTimeout(() => {
      const seconds = Math.round((Date.now() - startedAt.current) / 1000);
      const score = cryptogramScore(puzzle.words.length, errors, reveals);
      const match = buildCryptogramRecord(puzzle, score, seconds);
      addMatch(match);
      navigation.replace('Result', { match });
    }, 900);
  }, [assign, puzzle, errors, reveals, addMatch, navigation, playCorrect]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  /* ───────────── Ações ───────────── */

  const selectedIsEditable = selected !== null && !locked.includes(selected);

  const handleBoxPress = (letter: string) => {
    if (finished.current) return;
    setSelected(letter);
    setMessage(
      locked.includes(letter)
        ? 'Essa letra já está fixa.'
        : 'Agora escolha a letra no teclado.'
    );
  };

  const handleKey = (guess: string) => {
    if (finished.current || !selected || locked.includes(selected)) return;
    setAssign((prev) => assignLetter(prev, locked, selected, guess));
    setWrong((prev) => prev.filter((k) => k !== selected));
  };

  const handleErase = () => {
    if (finished.current || !selected || locked.includes(selected)) return;
    setAssign((prev) => removeLetter(prev, locked, selected));
    setWrong((prev) => prev.filter((k) => k !== selected));
  };

  const handleReveal = () => {
    if (finished.current || !selected || locked.includes(selected)) return;
    setAssign((prev) => assignLetter(prev, locked, selected, selected));
    setLocked((prev) => [...prev, selected]);
    setWrong((prev) => prev.filter((k) => k !== selected));
    setReveals((n) => n + 1);
    setMessage('Letra revelada (-5 pontos).');
  };

  const handleCheck = () => {
    if (finished.current) return;
    const bad = wrongKeys(assign, locked);
    setWrong(bad);

    if (bad.length === 0) {
      setMessage('Nenhuma letra errada até agora. 👍');
      return;
    }
    setErrors((n) => n + bad.length);
    setMessage(
      bad.length === 1
        ? '1 letra errada, marcada em vermelho (-2 pontos).'
        : `${bad.length} letras erradas, marcadas em vermelho (-${bad.length * 2} pontos).`
    );
    playWrong();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const handleExit = () => {
    Alert.alert('Sair do criptograma?', 'O progresso desta partida não será salvo.', [
      { text: 'Continuar jogando', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  /* ───────────── Medidas ───────────── */

  const maxLen = Math.max(...puzzle.words.map((w) => w.letters.length));
  const available = width - spacing.md * 2 - spacing.sm * 2;
  const boxSize = Math.max(
    Math.min(Math.floor((available - BOX_GAP * (maxLen - 1)) / maxLen), 42),
    22
  );
  const keySize = Math.floor((width - spacing.md * 2 - KEY_GAP * (KEYS_PER_ROW - 1)) / KEYS_PER_ROW);

  const filled = puzzle.letters.filter((l) => assign[l] !== undefined).length;
  const usedGuesses = new Set(Object.values(assign));
  const lockedGuesses = new Set(locked);

  /* ───────────── Casinha ───────────── */

  const renderBox = (letter: string, index: number) => {
    const guess = assign[letter];
    const isLocked = locked.includes(letter);
    const isSelected = selected === letter;
    const isWrong = wrong.includes(letter);

    return (
      <Pressable
        key={`${letter}-${index}`}
        onPress={() => handleBoxPress(letter)}
        accessibilityRole="button"
        accessibilityLabel={`Casinha ${puzzle.symbols[letter]}${guess ? `, letra ${guess}` : ''}`}
        style={[
          styles.box,
          { width: boxSize, height: boxSize + 6 },
          isLocked && styles.boxLocked,
          isSelected && styles.boxSelected,
          isWrong && styles.boxWrong,
        ]}
      >
        <Text
          style={[
            guess ? styles.boxLetter : styles.boxSymbol,
            { fontSize: Math.round(boxSize * 0.55) },
            !guess && { color: puzzle.colors[letter] },
            guess && isLocked && { color: colors.primary },
          ]}
        >
          {guess ?? puzzle.symbols[letter]}
        </Text>
      </Pressable>
    );
  };

  /* ───────────── Interface ───────────── */

  return (
    <SafeAreaView style={styles.safe}>
      {/* Barra superior */}
      <View style={styles.topBar}>
        <Pressable onPress={handleExit} style={styles.exitButton} hitSlop={8}>
          <Text style={styles.exitText}>Sair</Text>
        </Pressable>
        <Text style={styles.title}>Criptograma · {DIFFICULTY_LABELS[puzzle.level]}</Text>
        <Text style={styles.progress}>
          {filled}/{puzzle.letters.length}
        </Text>
      </View>

      {/* Palavras */}
      <ScrollView contentContainerStyle={styles.content}>
        {puzzle.words.map((word) => (
          <View key={word.country.name} style={styles.wordCard}>
            <Text style={styles.clue}>{word.clue}</Text>
            <View style={styles.boxes}>{word.letters.map(renderBox)}</View>
          </View>
        ))}
      </ScrollView>

      {/* Painel de controle */}
      <View style={styles.panel}>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.actions}>
          <View style={styles.selectedBox}>
            <Text
              style={[
                styles.selectedSymbol,
                selected ? { color: puzzle.colors[selected] } : { color: colors.muted },
              ]}
            >
              {selected ? puzzle.symbols[selected] : '–'}
            </Text>
          </View>

          <Pressable
            onPress={handleErase}
            disabled={!selectedIsEditable}
            style={[styles.actionButton, !selectedIsEditable && styles.disabled]}
          >
            <Text style={styles.actionText}>Apagar</Text>
          </Pressable>
          <Pressable
            onPress={handleReveal}
            disabled={!selectedIsEditable}
            style={[styles.actionButton, !selectedIsEditable && styles.disabled]}
          >
            <Text style={styles.actionText}>Revelar (-5)</Text>
          </Pressable>
          <Pressable onPress={handleCheck} style={[styles.actionButton, styles.actionPrimary]}>
            <Text style={[styles.actionText, styles.actionPrimaryText]}>Verificar</Text>
          </Pressable>
        </View>

        <View style={styles.keys}>
          {ALPHABET.map((letter) => {
            const blocked = !selectedIsEditable || lockedGuesses.has(letter);
            const taken = usedGuesses.has(letter);
            return (
              <Pressable
                key={letter}
                onPress={() => handleKey(letter)}
                disabled={blocked}
                style={[
                  styles.key,
                  { width: keySize, height: keySize + 4 },
                  taken && styles.keyTaken,
                  blocked && styles.disabled,
                ]}
              >
                <Text style={[styles.keyText, taken && styles.keyTextTaken]}>{letter}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    exitButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exitText: { color: colors.muted, fontSize: fontSize.md, fontWeight: '600' },
    title: { color: colors.text, fontSize: fontSize.md, fontWeight: '800' },
    progress: { color: colors.warning, fontSize: fontSize.md, fontWeight: '700', minWidth: 48, textAlign: 'right' },

    content: { padding: spacing.md, gap: spacing.sm },
    wordCard: {
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.sm,
      gap: spacing.sm,
    },
    clue: { color: colors.muted, fontSize: fontSize.sm, fontWeight: '600' },
    boxes: { flexDirection: 'row', flexWrap: 'wrap', gap: BOX_GAP },

    box: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    boxLocked: { backgroundColor: colors.tile },
    boxSelected: { borderColor: colors.primary, borderWidth: 3 },
    boxWrong: { borderColor: colors.danger, borderWidth: 3 },
    boxSymbol: { fontWeight: '700' },
    boxLetter: { color: colors.text, fontWeight: '800' },

    panel: {
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.card,
      padding: spacing.md,
      gap: spacing.sm,
    },
    message: { color: colors.muted, fontSize: fontSize.sm, textAlign: 'center' },

    actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    selectedBox: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    selectedSymbol: { fontSize: 24, fontWeight: '800' },
    actionButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 44,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
    actionText: { color: colors.text, fontSize: fontSize.sm, fontWeight: '700' },
    actionPrimaryText: { color: colors.primaryText, fontWeight: '800' },

    keys: { flexDirection: 'row', flexWrap: 'wrap', gap: KEY_GAP },
    key: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.sm,
      backgroundColor: colors.tile,
    },
    keyTaken: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
    keyText: { color: colors.text, fontSize: fontSize.md, fontWeight: '800' },
    keyTextTaken: { color: colors.muted },

    disabled: { opacity: 0.35 },
  });