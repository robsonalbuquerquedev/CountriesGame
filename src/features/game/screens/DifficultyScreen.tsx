import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Difficulty, RootStackParamList } from '../../../types';
import { colors, fontSize, spacing } from '../../../theme';
import { filterByDifficulty } from '../logic/gameLogic';
import { DIFFICULTY_LABELS, MODE_LABELS } from '../../../utils/labels';
import MenuButton from '../components/MenuButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Difficulty'>;

const OPTIONS: { key: Difficulty; rule: string }[] = [
  { key: 'easy', rule: 'Até 6 letras (ex.: Japan, Brazil)' },
  { key: 'medium', rule: '7 a 10 letras (ex.: Germany, Portugal)' },
  { key: 'hard', rule: 'Mais de 10 letras (ex.: United States, South Korea)' },
  { key: 'all', rule: 'Sem restrição de tamanho' },
  { key: 'random', rule: 'Desafio surpresa: todos os continentes com a mesma chance' },
];

export default function DifficultyScreen({ navigation, route }: Props) {
  const { mode } = route.params;

  // Quantos países existem em cada nível
  const counts = useMemo(() => {
    const result = {} as Record<Difficulty, number>;
    OPTIONS.forEach(({ key }) => {
      result[key] = filterByDifficulty(key).length;
    });
    return result;
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Escolha a dificuldade</Text>
        <Text style={styles.mode}>{MODE_LABELS[mode]}</Text>

        <View style={styles.list}>
          {OPTIONS.map(({ key, rule }) => (
            <MenuButton
              key={key}
              variant={key === 'random' ? 'primary' : 'secondary'}
              title={DIFFICULTY_LABELS[key]}
              subtitle={`${rule} · ${counts[key]} países`}
              onPress={() => navigation.navigate('Game', { mode, difficulty: key })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  heading: { color: colors.text, fontSize: fontSize.xl, fontWeight: '800' },
  mode: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: '700',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  list: { gap: spacing.md },
});