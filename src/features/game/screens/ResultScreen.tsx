import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types';
import { colors, fontSize, radius, spacing } from '../../../theme';
import { accuracy } from '../logic/gameLogic';
import { DIFFICULTY_LABELS, MODE_LABELS } from '../../../utils/labels';
import MenuButton from '../components/MenuButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

function feedbackMessage(pct: number) {
  if (pct >= 80) return 'Excelente! 🏆';
  if (pct >= 50) return 'Bom trabalho! 👏';
  return 'Continue praticando! 💪';
}

export default function ResultScreen({ navigation, route }: Props) {
  const { match } = route.params;
  const pct = accuracy(match);

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
          <Row label="Acertos" value={`${match.correct} de ${match.total}`} />
          <Row label="Aproveitamento" value={`${pct}%`} />
          <Row label="Modo" value={MODE_LABELS[match.mode]} />
          <Row label="Dificuldade" value={DIFFICULTY_LABELS[match.difficulty]} />
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
            subtitle={`${MODE_LABELS[match.mode]} · ${DIFFICULTY_LABELS[match.difficulty]}`}
            onPress={() =>
              navigation.replace('Game', { mode: match.mode, difficulty: match.difficulty })
            }
          />
          <MenuButton title="Menu inicial" onPress={() => navigation.popToTop()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  rowValue: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },

  actions: { gap: spacing.md, marginTop: spacing.sm },
});