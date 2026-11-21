import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontSize, spacing } from '../../../theme';
import { useStatsStore } from '../../../store/statsStore';
import MatchRow from '../../game/components/MatchRow';
import MenuButton from '../../game/components/MenuButton';

export default function HistoryScreen() {
  const matches = useStatsStore((s) => s.matches); // já ordenado: mais recente primeiro
  const clearAll = useStatsStore((s) => s.clearAll);

  const confirmClear = () => {
    Alert.alert(
      'Apagar todos os dados?',
      'O histórico, o ranking e as estatísticas serão apagados. Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={matches}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => <MatchRow match={item} />}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListHeaderComponent={
          matches.length > 0 ? (
            <Text style={styles.header}>
              {matches.length} {matches.length === 1 ? 'partida jogada' : 'partidas jogadas'}
            </Text>
          ) : undefined
        }
        ListFooterComponent={
          matches.length > 0 ? (
            <View style={styles.footer}>
              <MenuButton variant="ghost" title="Apagar todos os dados" onPress={confirmClear} />
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📜</Text>
            <Text style={styles.emptyText}>Seu histórico aparece aqui depois da primeira partida.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, flexGrow: 1 },
  header: { color: colors.muted, fontSize: fontSize.md, marginBottom: spacing.md },
  footer: { marginTop: spacing.lg },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingTop: 80 },
  emptyEmoji: { fontSize: 56 },
  emptyText: { color: colors.muted, fontSize: fontSize.md, textAlign: 'center' },
});