// src/features/game/screens/HomeScreen.tsx
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { useThemeStore } from '../../../store/themeStore';
import { useStatsStore } from '../../../store/statsStore';
import MenuButton from '../components/MenuButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type Shortcut = {
  icon: string;
  label: string;
  route: 'Countries' | 'Ranking' | 'History' | 'Stats';
};

const SHORTCUTS: Shortcut[] = [
  { icon: '🗺️', label: 'Países', route: 'Countries' },
  { icon: '🏆', label: 'Ranking', route: 'Ranking' },
  { icon: '📜', label: 'Histórico', route: 'History' },
  { icon: '📊', label: 'Estatísticas', route: 'Stats' },
];

export default function HomeScreen({ navigation }: Props) {
  const { colors, scheme } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { height } = useWindowDimensions();

  // Em telas baixas o cabeçalho encolhe para não apertar o resto
  const compact = height < 700;

  const setMode = useThemeStore((s) => s.setMode);
  const isDark = scheme === 'dark';

  const matches = useStatsStore((s) => s.matches);
  const bestScore = useMemo(
    () => matches.reduce((max, m) => Math.max(max, m.score), 0),
    [matches]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Interruptor do tema: 🌙 escuro / ☀️ claro */}
        <View style={styles.topRow}>
          <Pressable
            onPress={() => setMode(isDark ? 'light' : 'dark')}
            style={styles.themeToggle}
            hitSlop={8}
            accessibilityRole="switch"
            accessibilityLabel="Tema escuro"
            accessibilityState={{ checked: isDark }}
          >
            <Text style={[styles.themeIcon, !isDark && styles.themeIconOn]}>☀️</Text>
            <Text style={[styles.themeIcon, isDark && styles.themeIconOn]}>🌙</Text>
          </Pressable>
        </View>

        {/* Título */}
        <View style={styles.header}>
          <Text style={[styles.emoji, compact && styles.emojiSmall]}>🌍</Text>
          <Text style={[styles.title, compact && styles.titleSmall]}>Countries Game</Text>
          <Text style={styles.subtitle}>Memorizando Países em Inglês</Text>
          {bestScore > 0 && <Text style={styles.best}>Seu recorde: {bestScore} pts</Text>}
        </View>

        {/* Ação principal */}
        <MenuButton
          variant="primary"
          title="Jogar"
          subtitle="Anagramas, bandeiras ou criptograma"
          onPress={() => navigation.navigate('GameSelect')}
        />

        {/* Atalhos */}
        <View style={styles.grid}>
          {SHORTCUTS.map(({ icon, label, route }) => (
            <Pressable
              key={route}
              onPress={() => navigation.navigate(route)}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
              accessibilityRole="button"
              accessibilityLabel={label}
            >
              <Text style={styles.tileIcon}>{icon}</Text>
              <Text style={styles.tileLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable onPress={() => navigation.navigate('About')} hitSlop={8}>
          <Text style={styles.about}>Sobre o English Study Hub</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    // flexGrow + justifyContent: centraliza em telas altas e rola em telas baixas
    content: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: spacing.lg,
      gap: spacing.lg,
    },

    topRow: { flexDirection: 'row', justifyContent: 'flex-end' },
    themeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 3,
      gap: 2,
    },
    themeIcon: {
      fontSize: 16,
      width: 32,
      height: 28,
      textAlign: 'center',
      textAlignVertical: 'center',
      lineHeight: 28,
      borderRadius: radius.lg,
      opacity: 0.45,
      overflow: 'hidden',
    },
    themeIconOn: { opacity: 1, backgroundColor: colors.tile },

    header: { alignItems: 'center', gap: spacing.xs },
    emoji: { fontSize: 64 },
    emojiSmall: { fontSize: 44 },
    title: { color: colors.text, fontSize: 32, fontWeight: '900', textAlign: 'center' },
    titleSmall: { fontSize: 26 },
    subtitle: { color: colors.muted, fontSize: fontSize.md, textAlign: 'center' },
    best: {
      color: colors.warning,
      fontSize: fontSize.md,
      fontWeight: '700',
      marginTop: spacing.sm,
    },

    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    tile: {
      flexGrow: 1,
      flexBasis: '45%',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tilePressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
    tileIcon: { fontSize: 26 },
    tileLabel: { color: colors.text, fontSize: fontSize.md, fontWeight: '700' },

    about: {
      color: colors.muted,
      fontSize: fontSize.sm,
      textAlign: 'center',
    },
  });