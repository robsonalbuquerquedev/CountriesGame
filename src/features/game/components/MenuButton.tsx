import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../../theme';

interface Props {
  title: string;
  subtitle?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export default function MenuButton({
  title,
  subtitle,
  onPress,
  variant = 'secondary',
  disabled = false,
}: Props) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View>
        <Text style={[styles.title, isPrimary && styles.titlePrimary]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, isPrimary && styles.subtitlePrimary]}>{subtitle}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.primary },
  secondary: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghost: { borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },

  title: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
  titlePrimary: { color: colors.primaryText },
  subtitle: { color: colors.muted, fontSize: fontSize.sm, marginTop: 2 },
  subtitlePrimary: { color: colors.primaryText, opacity: 0.8 },
});