// src/features/game/screens/CryptogramLevelScreen.tsx
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CryptogramLevel, RootStackParamList } from '../../../types';
import { Palette, fontSize, radius, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { LEVEL_CONFIG } from '../logic/cryptogramLogic';
import MenuButton from '../components/MenuButton';

type Props = NativeStackScreenProps<RootStackParamList, 'CryptogramLevel'>;

const OPTIONS: { level: CryptogramLevel; title: string; rule: string }[] = [
  {
    level: 'easy',
    title: 'Fácil',
    rule: 'Nomes curtos, com a dica em português e o continente',
  },
  {
    level: 'medium',
    title: 'Médio',
    rule: 'Nomes médios, com a dica em português',
  },
  {
    level: 'hard',
    title: 'Difícil',
    rule: 'Nomes longos, com a dica da capital e o continente',
  },
];

export default function CryptogramLevelScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Criptograma</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Como jogar</Text>
          <Text style={styles.cardText}>
            • Cada símbolo esconde uma letra, e o mesmo símbolo é sempre a mesma letra.
          </Text>
          <Text style={styles.cardText}>
            • Toque em uma casinha e escolha a letra no teclado. Todas as casinhas com o mesmo
            símbolo são preenchidas juntas.
          </Text>
          <Text style={styles.cardText}>
            • Cada país tem uma dica. Letras descobertas em uma palavra ajudam nas outras.
          </Text>
          <Text style={styles.cardText}>
            • Se uma letra só aparece uma vez, use a dica para descobri-la.
          </Text>
        </View>

        <Text style={styles.section}>Dificuldade</Text>
        <View style={styles.list}>
          {OPTIONS.map(({ level, title, rule }) => (
            <MenuButton
              key={level}
              variant={level === 'easy' ? 'primary' : 'secondary'}
              title={title}
              subtitle={`${LEVEL_CONFIG[level].words} países · ${rule}`}
              onPress={() => navigation.navigate('Cryptogram', { level })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.lg, gap: spacing.md },
    heading: { color: colors.text, fontSize: fontSize.xl, fontWeight: '800' },

    card: {
      backgroundColor: colors.card,
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm,
    },
    cardTitle: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
    cardText: { color: colors.muted, fontSize: fontSize.md, lineHeight: 22 },

    section: {
      color: colors.text,
      fontSize: fontSize.lg,
      fontWeight: '800',
      marginTop: spacing.sm,
    },
    list: { gap: spacing.md },
  });