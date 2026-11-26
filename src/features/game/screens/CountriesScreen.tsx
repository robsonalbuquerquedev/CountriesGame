// src/features/game/screens/CountriesScreen.tsx
import React, { useMemo, useState } from 'react';
import { Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COUNTRIES } from '../../../data/countries';
import { Continent, Country } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';

type Section = { title: Continent; data: Country[] };

// Continentes lidos dos próprios dados
const CONTINENTS: Continent[] = Array.from(new Set(COUNTRIES.map((c) => c.continent)));
const CONTINENT_COUNT: Record<string, number> = {};
COUNTRIES.forEach((c) => {
  CONTINENT_COUNT[c.continent] = (CONTINENT_COUNT[c.continent] ?? 0) + 1;
});

// Para a busca ignorar maiúsculas e acentos
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();

export default function CountriesScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  // Lista vazia = todos os continentes
  const [selected, setSelected] = useState<Continent[]>([]);
  const [query, setQuery] = useState('');

  const toggleContinent = (continent: Continent) => {
    setSelected((prev) => {
      const next = prev.includes(continent)
        ? prev.filter((c) => c !== continent)
        : [...prev, continent];
      return next.length === CONTINENTS.length ? [] : next;
    });
  };

  const sections: Section[] = useMemo(() => {
    const q = norm(query);
    return CONTINENTS.filter((cont) => selected.length === 0 || selected.includes(cont))
      .map((cont) => ({
        title: cont,
        data: COUNTRIES.filter((c) => c.continent === cont)
          .filter((c) => !q || [c.name, c.namePt, c.capital].some((t) => norm(t).includes(q)))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .filter((s) => s.data.length > 0);
  }, [selected, query]);

  const total = sections.reduce((sum, s) => sum + s.data.length, 0);
  const allSelected = selected.length === 0;

  const header = (
    <View style={styles.header}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar país ou capital"
        placeholderTextColor={colors.muted}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
        style={styles.search}
      />

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

      <Text style={styles.total}>
        {total} {total === 1 ? 'país' : 'países'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <SectionList<Country, Section>
        sections={sections}
        keyExtractor={(country) => country.name}
        keyboardShouldPersistTaps="handled"
        stickySectionHeadersEnabled
        contentContainerStyle={styles.content}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {section.title} · {section.data.length}
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowMain}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.pt}>{item.namePt}</Text>
            </View>
            <View style={styles.rowSide}>
              <Text style={styles.capitalLabel}>Capital</Text>
              <Text style={styles.capital}>{item.capital}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum país encontrado para essa busca.</Text>
        }
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, paddingTop: spacing.md },

    header: { gap: spacing.md, marginBottom: spacing.sm },
    search: {
      backgroundColor: colors.card,
      color: colors.text,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      fontSize: fontSize.md,
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.card,
    },
    chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600' },
    chipTextOn: { color: colors.primaryText, fontWeight: '800' },
    total: { color: colors.muted, fontSize: fontSize.sm },

    sectionHeader: {
      backgroundColor: colors.background,
      paddingVertical: spacing.sm,
      marginTop: spacing.sm,
    },
    sectionTitle: { color: colors.primary, fontSize: fontSize.lg, fontWeight: '800' },

    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.md,
    },
    rowMain: { flex: 1, gap: 2 },
    name: { color: colors.text, fontSize: fontSize.md, fontWeight: '800' },
    pt: { color: colors.muted, fontSize: fontSize.sm },
    rowSide: { alignItems: 'flex-end', flexShrink: 1, maxWidth: '45%' },
    capitalLabel: { color: colors.muted, fontSize: 11 },
    capital: { color: colors.text, fontSize: fontSize.sm, fontWeight: '600', textAlign: 'right' },

    empty: { color: colors.muted, textAlign: 'center', paddingTop: spacing.xl },
  });