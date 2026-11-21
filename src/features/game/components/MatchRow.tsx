import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MatchRecord } from '../../../types';
import { colors, fontSize, radius, spacing } from '../../../theme';
import { DIFFICULTY_LABELS, MODE_LABELS } from '../../../utils/labels';
import { formatDate } from '../../../utils/format';
import { accuracy } from '../logic/gameLogic';

interface Props {
  match: MatchRecord;
  rank?: number; // quando informado, mostra a posição (usado no Ranking)
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function MatchRow({ match, rank }: Props) {
  const pct = accuracy(match);
  const pctColor = pct >= 80 ? colors.success : pct >= 50 ? colors.warning : colors.danger;

  return (
    <View style={styles.row}>
      {rank !== undefined && (
        <Text style={styles.rank}>{rank <= 3 ? MEDALS[rank - 1] : `${rank}º`}</Text>
      )}

      <View style={styles.info}>
        <Text style={styles.score}>{match.score} pts</Text>
        <Text style={styles.detail}>
          {match.correct}/{match.total} acertos
        </Text>
        <Text style={styles.detail}>
          {MODE_LABELS[match.mode]} · {DIFFICULTY_LABELS[match.difficulty]}
        </Text>
        <Text style={styles.date}>{formatDate(match.date)}</Text>
      </View>

      <Text style={[styles.pct, { color: pctColor }]}>{pct}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  rank: { width: 36, color: colors.text, fontSize: fontSize.lg, fontWeight: '800', textAlign: 'center' },
  info: { flex: 1, gap: 2 },
  score: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
  detail: { color: colors.muted, fontSize: fontSize.sm },
  date: { color: colors.muted, fontSize: 12, opacity: 0.8 },
  pct: { fontSize: fontSize.xl, fontWeight: '900' },
});