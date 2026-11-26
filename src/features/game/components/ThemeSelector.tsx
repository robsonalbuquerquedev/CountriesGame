// src/features/game/components/ThemeSelector.tsx
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { ThemeMode, useThemeStore } from '../../../store/themeStore';

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: 'dark', label: 'Escuro' },
  { mode: 'light', label: 'Claro' },
  { mode: 'system', label: 'Automático' },
];

export default function ThemeSelector() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Aparência</Text>
      <View style={styles.segment}>
        {OPTIONS.map((option) => {
          const on = mode === option.mode;
          return (
            <Pressable
              key={option.mode}
              onPress={() => setMode(option.mode)}
              style={[styles.item, on && styles.itemOn]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <Text style={[styles.itemText, on && styles.itemTextOn]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    wrap: { gap: spacing.sm, marginBottom: spacing.md },
    label: { color: colors.muted, fontSize: fontSize.sm, fontWeight: '600' },
    segment: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 4,
      gap: 4,
    },
    item: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderRadius: radius.sm,
    },
    itemOn: { backgroundColor: colors.primary },
    itemText: { color: colors.muted, fontSize: fontSize.sm, fontWeight: '600' },
    itemTextOn: { color: colors.primaryText, fontWeight: '800' },
  });