import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';

import { COUNTRIES } from '../../../data/countries';
import { Continent } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { useStatsStore } from '../../../store/statsStore';

const CONTINENTS: Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
];

const SHORT: Record<Continent, string> = {
  Africa: 'AFR',
  Asia: 'ASI',
  Europe: 'EUR',
  'North America': 'N.AM',
  'South America': 'S.AM',
  Oceania: 'OCE',
};

const CONTINENT_COLORS: Record<Continent, string> = {
  Africa: '#F59E0B',
  Asia: '#EF4444',
  Europe: '#3B82F6',
  'North America': '#22C55E',
  'South America': '#A855F7',
  Oceania: '#06B6D4',
};

const MAX_LINE_POINTS = 30;

export default function StatsScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const matches = useStatsStore((s) => s.matches); // mais recente primeiro
  const { width } = useWindowDimensions();

  // Largura útil do gráfico: tela - padding externo - padding do card - eixo Y
  const chartWidth = Math.max(width - spacing.lg * 2 - spacing.md * 2 - 40, 200);

  /* ───────────── Agregações ───────────── */

  const byContinent = useMemo(() => {
    const acc: Record<string, { correct: number; total: number }> = {};
    matches.forEach((m) =>
      Object.entries(m.byContinent).forEach(([continent, s]) => {
        const prev = acc[continent] ?? { correct: 0, total: 0 };
        acc[continent] = { correct: prev.correct + s.correct, total: prev.total + s.total };
      })
    );
    return acc;
  }, [matches]);

  const totals = useMemo(() => {
    const correct = matches.reduce((n, m) => n + m.correct, 0);
    const total = matches.reduce((n, m) => n + m.total, 0);
    return {
      games: matches.length,
      best: matches.reduce((max, m) => Math.max(max, m.score), 0),
      pct: total === 0 ? 0 : Math.round((correct / total) * 100),
    };
  }, [matches]);

  const hasAnswers = CONTINENTS.some((c) => (byContinent[c]?.total ?? 0) > 0);

  // Continente com pior aproveitamento (entre os que já apareceram)
  const weakest = useMemo(() => {
    const played = CONTINENTS.filter((c) => (byContinent[c]?.total ?? 0) > 0);
    if (played.length < 2) return null;
    const pct = (c: Continent) => byContinent[c].correct / byContinent[c].total;
    return played.reduce((worst, c) => (pct(c) < pct(worst) ? c : worst));
  }, [byContinent]);

  /* ───────────── Dados dos gráficos ───────────── */

  // 1. Barras: acertos por continente
  const barWidth = 26;
  const barSpacing = Math.max(Math.floor((chartWidth - CONTINENTS.length * barWidth - 10) / CONTINENTS.length), 8);
  const barData = CONTINENTS.map((c) => {
    const value = byContinent[c]?.correct ?? 0;
    return {
      value,
      label: SHORT[c],
      frontColor: CONTINENT_COLORS[c],
      topLabelComponent: () => <Text style={styles.barTop}>{value}</Text>,
    };
  });

  // 2. Rosca: países cadastrados por continente
  const distribution = useMemo(
    () =>
      CONTINENTS.map((c) => ({
        continent: c,
        count: COUNTRIES.filter((x) => x.continent === c).length,
      })),
    []
  );
  const pieData = distribution.map((d) => ({
    value: d.count,
    color: CONTINENT_COLORS[d.continent],
  }));

  // 3. Linha: score de cada partida, em ordem cronológica (até as últimas 30)
  const chronological = useMemo(() => [...matches].reverse().slice(-MAX_LINE_POINTS), [matches]);
  const firstNumber = matches.length - chronological.length + 1;
  const lineData = chronological.map((m, i) => ({
    value: m.score,
    label: String(firstNumber + i),
  }));
  const lineSpacing = Math.min(
    60,
    Math.max(28, Math.floor(chartWidth / Math.max(lineData.length - 1, 1)))
  );

  /* ───────────── Interface ───────────── */

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Resumo */}
        <View style={styles.summary}>
          <SummaryItem label="Partidas" value={String(totals.games)} />
          <SummaryItem label="Melhor score" value={String(totals.best)} />
          <SummaryItem label="Acertos" value={`${totals.pct}%`} />
        </View>

        {/* 1. Barras */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acertos por continente</Text>
          {hasAnswers ? (
            <>
              <BarChart
                data={barData}
                width={chartWidth}
                height={180}
                barWidth={barWidth}
                spacing={barSpacing}
                initialSpacing={10}
                barBorderTopLeftRadius={6}
                barBorderTopRightRadius={6}
                noOfSections={4}
                rulesColor={colors.border}
                yAxisColor={colors.border}
                xAxisColor={colors.border}
                yAxisTextStyle={styles.axisText}
                xAxisLabelTextStyle={styles.axisText}
                isAnimated
              />
              {CONTINENTS.map((c) => {
                const s = byContinent[c];
                if (!s || s.total === 0) return null;
                return (
                  <View key={c} style={styles.legendRow}>
                    <View style={[styles.dot, { backgroundColor: CONTINENT_COLORS[c] }]} />
                    <Text style={styles.legendName}>{c}</Text>
                    <Text style={styles.legendValue}>
                      {s.correct}/{s.total} · {Math.round((s.correct / s.total) * 100)}%
                    </Text>
                  </View>
                );
              })}
              {weakest && (
                <Text style={styles.tip}>
                  💡 Vale revisar: {weakest} ({Math.round((byContinent[weakest].correct / byContinent[weakest].total) * 100)}% de acerto)
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.empty}>Jogue uma partida para ver seu desempenho por continente.</Text>
          )}
        </View>

        {/* 2. Rosca */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Distribuição geográfica</Text>
          <Text style={styles.cardSub}>Países cadastrados no jogo, por continente</Text>
          <View style={styles.donutWrap}>
            <PieChart
              data={pieData}
              donut
              radius={100}
              innerRadius={62}
              innerCircleColor={colors.card}
              centerLabelComponent={() => (
                <View style={styles.center}>
                  <Text style={styles.centerValue}>{COUNTRIES.length}</Text>
                  <Text style={styles.centerLabel}>países</Text>
                </View>
              )}
            />
          </View>
          {distribution.map((d) => (
            <View key={d.continent} style={styles.legendRow}>
              <View style={[styles.dot, { backgroundColor: CONTINENT_COLORS[d.continent] }]} />
              <Text style={styles.legendName}>{d.continent}</Text>
              <Text style={styles.legendValue}>
                {d.count} · {Math.round((d.count / COUNTRIES.length) * 100)}%
              </Text>
            </View>
          ))}
        </View>

        {/* 3. Linha */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Evolução de score</Text>
          <Text style={styles.cardSub}>Pontuação de cada partida (número da partida no eixo X)</Text>
          {lineData.length >= 2 ? (
            <LineChart
              data={lineData}
              width={chartWidth}
              height={180}
              spacing={lineSpacing}
              initialSpacing={10}
              endSpacing={10}
              color={colors.primary}
              thickness={3}
              dataPointsColor={colors.primary}
              areaChart
              startFillColor={colors.primary}
              startOpacity={0.3}
              endOpacity={0.02}
              noOfSections={4}
              rulesColor={colors.border}
              yAxisColor={colors.border}
              xAxisColor={colors.border}
              yAxisTextStyle={styles.axisText}
              xAxisLabelTextStyle={styles.axisText}
              isAnimated
            />
          ) : (
            <Text style={styles.empty}>
              {lineData.length === 1
                ? 'Jogue mais uma partida para ver a evolução.'
                : 'Jogue algumas partidas para acompanhar sua evolução.'}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },

  summary: { flexDirection: 'row', gap: spacing.sm },
  summaryItem: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  summaryValue: { color: colors.warning, fontSize: fontSize.xl, fontWeight: '900' },
  summaryLabel: { color: colors.muted, fontSize: fontSize.sm, marginTop: 2 },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
  cardSub: { color: colors.muted, fontSize: fontSize.sm, marginBottom: spacing.sm },
  empty: { color: colors.muted, fontSize: fontSize.md, textAlign: 'center', paddingVertical: spacing.lg },

  axisText: { color: colors.muted, fontSize: 11 },
  barTop: { color: colors.text, fontSize: 11, fontWeight: '700', marginBottom: 2 },

  donutWrap: { alignItems: 'center', paddingVertical: spacing.md },
  center: { alignItems: 'center' },
  centerValue: { color: colors.text, fontSize: fontSize.xl, fontWeight: '900' },
  centerLabel: { color: colors.muted, fontSize: fontSize.sm },

  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendName: { flex: 1, color: colors.text, fontSize: fontSize.md },
  legendValue: { color: colors.muted, fontSize: fontSize.md, fontWeight: '600' },
  tip: { color: colors.warning, fontSize: fontSize.md, marginTop: spacing.sm },
});