import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { COUNTRIES } from '../../../data/countries';
import { Continent, Difficulty, RootStackParamList } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
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

// Continentes e quantidade de países, lidos direto dos dados (não dependem de texto fixo)
const CONTINENTS: Continent[] = Array.from(new Set(COUNTRIES.map((c) => c.continent)));
const CONTINENT_COUNT: Record<string, number> = {};
COUNTRIES.forEach((c) => {
  CONTINENT_COUNT[c.continent] = (CONTINENT_COUNT[c.continent] ?? 0) + 1;
});

export default function DifficultyScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { mode } = route.params;

  // Lista vazia = todos os continentes
  const [selected, setSelected] = useState<Continent[]>([]);

  const toggleContinent = (continent: Continent) => {
    setSelected((prev) => {
      const next = prev.includes(continent)
        ? prev.filter((c) => c !== continent)
        : [...prev, continent];
      // Se marcou todos, é o mesmo que não filtrar
      return next.length === CONTINENTS.length ? [] : next;
    });
  };

  // Quantos países existem em cada nível, considerando os continentes escolhidos
  const counts = useMemo(() => {
    const result = {} as Record<Difficulty, number>;
    OPTIONS.forEach(({ key }) => {
      result[key] = filterByDifficulty(key, selected).length;
    });
    return result;
  }, [selected]);

  const allSelected = selected.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Escolha o que treinar</Text>
        <Text style={styles.mode}>{MODE_LABELS[mode]}</Text>

        {/* Continentes (seleção múltipla) */}
        <Text style={styles.section}>Continentes</Text>
        <Text style={styles.sectionHint}>
          Toque para escolher um ou mais. Sem escolha, jogam todos.
        </Text>
        <View style={styles.chips}>
          <Pressable
            onPress={() => setSelected([])}
            style={[styles.chip, allSelected && styles.chipOn]}
            accessibilityRole="button"
            accessibilityState={{ selected: allSelected }}
          >
            <Text style={[styles.chipText, allSelected && styles.chipTextOn]}>
              Todos ({COUNTRIES.length})
            </Text>
          </Pressable>

          {CONTINENTS.map((continent) => {
            const on = selected.includes(continent);
            return (
              <Pressable
                key={continent}
                onPress={() => toggleContinent(continent)}
                style={[styles.chip, on && styles.chipOn]}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]}>
                  {continent} ({CONTINENT_COUNT[continent]})
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Dificuldade */}
        <Text style={styles.section}>Dificuldade</Text>
        <View style={styles.list}>
          {OPTIONS.map(({ key, rule }) => {
            const count = counts[key];
            const empty = count === 0;
            const ruleText =
              key === 'random' && !allSelected
                ? 'Desafio surpresa: os continentes escolhidos com a mesma chance'
                : rule;

            return (
              <View
                key={key}
                style={empty && styles.disabled}
                pointerEvents={empty ? 'none' : 'auto'}
              >
                <MenuButton
                  variant={key === 'random' ? 'primary' : 'secondary'}
                  title={DIFFICULTY_LABELS[key]}
                  subtitle={
                    empty
                      ? 'Nenhum país com essa combinação'
                      : `${ruleText} · ${count} ${count === 1 ? 'país' : 'países'}`
                  }
                  onPress={() =>
                    navigation.navigate('Game', {
                      mode,
                      difficulty: key,
                      continents: allSelected ? undefined : selected,
                    })
                  }
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
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

  section: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '800',
    marginTop: spacing.md,
  },
  sectionHint: {
    color: colors.muted,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: fontSize.md, fontWeight: '600' },
  chipTextOn: { color: colors.primaryText, fontWeight: '800' },

  list: { gap: spacing.md, marginTop: spacing.sm },
  disabled: { opacity: 0.4 },
});