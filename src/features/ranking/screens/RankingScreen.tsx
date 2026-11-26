import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette, fontSize, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { useStatsStore } from '../../../store/statsStore';
import { accuracy } from '../../game/logic/gameLogic';
import MatchRow from '../../game/components/MatchRow';

const MAX_ITEMS = 50;

export default function RankingScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const matches = useStatsStore((s) => s.matches);

  // Maior pontuação primeiro. Empate: maior % de acerto, depois a partida mais recente.
  const ranked = useMemo(
    () =>
      [...matches]
        .sort(
          (a, b) =>
            b.score - a.score ||
            accuracy(b) - accuracy(a) ||
            (a.date < b.date ? 1 : -1)
        )
        .slice(0, MAX_ITEMS),
    [matches]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={ranked}
        keyExtractor={(m) => m.id}
        renderItem={({ item, index }) => <MatchRow match={item} rank={index + 1} />}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListHeaderComponent={
          ranked.length > 0 ? (
            <Text style={styles.header}>Suas {ranked.length} melhores partidas</Text>
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyText}>
              Nenhuma partida ainda. Jogue para entrar no ranking!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, flexGrow: 1 },
    header: { color: colors.muted, fontSize: fontSize.md, marginBottom: spacing.md },
    empty: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      paddingTop: 80,
    },
    emptyEmoji: { fontSize: 56 },
    emptyText: { color: colors.muted, fontSize: fontSize.md, textAlign: 'center' },
  });