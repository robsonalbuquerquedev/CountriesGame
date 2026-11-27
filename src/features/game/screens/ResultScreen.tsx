import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CryptogramLevel, RootStackParamList } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { accuracy } from '../logic/gameLogic';
import { formatDuration } from '../logic/cryptogramLogic';
import { DIFFICULTY_LABELS, KIND_LABELS, MODE_LABELS, matchLabel } from '../../../utils/labels';
import MenuButton from '../components/MenuButton';
import { useReviewPrompt } from '../../../utils/useReviewPrompt';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

function feedbackMessage(pct: number) {
  if (pct >= 80) return 'Excelente! 🏆';
  if (pct >= 50) return 'Bom trabalho! 👏';
  return 'Continue praticando! 💪';
}

export default function ResultScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { match } = route.params;
  useReviewPrompt(match);
  const pct = accuracy(match);
  const kind = match.kind ?? 'anagram';
  const isCryptogram = kind === 'cryptogram';

  // Partidas antigas (sem filtro salvo) contam como "todos os continentes"
  const continentsLabel =
    match.continents && match.continents.length > 0 ? match.continents.join(', ') : null;

  const continentRows = Object.entries(match.byContinent).sort(
    ([, a], [, b]) => b.total - a.total
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Fim da partida</Text>
        <Text style={styles.message}>{feedbackMessage(pct)}</Text>

        <View style={styles.scoreBox}>
          <Text style={styles.score}>{match.score}</Text>
          <Text style={styles.scoreLabel}>pontos</Text>
        </View>

        <View style={styles.card}>
          <Row label="Jogo" value={KIND_LABELS[kind]} />
          {isCryptogram ? (
            <>
              <Row label="Palavras" value={String(match.total)} />
              {match.durationSec !== undefined && (
                <Row label="Tempo" value={formatDuration(match.durationSec)} />
              )}
            </>
          ) : (
            <>
              <Row label="Acertos" value={`${match.correct} de ${match.total}`} />
              <Row label="Aproveitamento" value={`${pct}%`} />
              <Row label="Modo" value={MODE_LABELS[match.mode]} />
            </>
          )}
          <Row label="Dificuldade" value={DIFFICULTY_LABELS[match.difficulty]} />
          {continentsLabel && <Row label="Continentes" value={continentsLabel} />}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Desempenho por continente</Text>
          {continentRows.map(([continent, s]) => (
            <Row key={continent} label={continent} value={`${s.correct}/${s.total}`} />
          ))}
        </View>

        <View style={styles.actions}>
          <MenuButton
            variant="primary"
            title="Jogar novamente"
            subtitle={`${matchLabel(match)}${continentsLabel ? ` · ${continentsLabel}` : ''}`}
            onPress={() =>
              isCryptogram
                ? navigation.replace('Cryptogram', { level: match.difficulty as CryptogramLevel })
                : navigation.replace('Game', {
                    mode: match.mode,
                    difficulty: match.difficulty,
                    continents: match.continents,
                    kind,
                  })
            }
          />
          <MenuButton title="Menu inicial" onPress={() => navigation.popToTop()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  heading: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: { color: colors.muted, fontSize: fontSize.lg, textAlign: 'center' },

  scoreBox: { alignItems: 'center', paddingVertical: spacing.md },
  score: { color: colors.warning, fontSize: 64, fontWeight: '900' },
  scoreLabel: { color: colors.muted, fontSize: fontSize.md },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  rowLabel: { color: colors.muted, fontSize: fontSize.md },
  rowValue: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '700',
    flexShrink: 1,
    textAlign: 'right',
  },

  actions: { gap: spacing.md, marginTop: spacing.sm },
});