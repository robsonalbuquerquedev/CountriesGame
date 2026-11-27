import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MatchRecord } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { matchLabel } from '../../../utils/labels';
import { formatDate } from '../../../utils/format';
import { accuracy } from '../logic/gameLogic';

interface Props {
  match: MatchRecord;
  rank?: number; // quando informado, mostra a posição (usado no Ranking)
}

const MEDALS = ['🥇', '🥈', '🥉'];

export default function MatchRow({ match, rank }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const pct = accuracy(match);
  const pctColor = pct >= 80 ? colors.success : pct >= 50 ? colors.warning : colors.danger;

  // Partidas antigas (sem filtro salvo) não mostram a linha: contam como "todos"
  const continentsLabel =
    match.continents && match.continents.length > 0 ? match.continents.join(', ') : null;

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
        <Text style={styles.detail}>{matchLabel(match)}</Text>
        {continentsLabel && (
          <Text style={styles.continents} numberOfLines={2}>
            {continentsLabel}
          </Text>
        )}
        <Text style={styles.date}>{formatDate(match.date)}</Text>
      </View>

      <Text style={[styles.pct, { color: pctColor }]}>{pct}%</Text>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.md,
    },
    rank: {
      width: 36,
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '800',
      textAlign: 'center',
    },
    info: { flex: 1, gap: 2 },
    score: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
    detail: { color: colors.muted, fontSize: fontSize.sm },
    continents: { color: colors.primary, fontSize: fontSize.sm, fontWeight: '600' },
    date: { color: colors.muted, fontSize: 12, opacity: 0.8 },
    pct: { fontSize: fontSize.xl, fontWeight: '900' },
  });