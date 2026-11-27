// src/features/game/screens/GameSelectScreen.tsx
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types';
import { Palette, fontSize, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import MenuButton from '../components/MenuButton';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSelect'>;

export default function GameSelectScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Text style={styles.heading}>Escolha o jogo</Text>

      <View style={styles.list}>
        <MenuButton
          variant="primary"
          title="Anagramas"
          subtitle="Decifre o nome do país a partir das letras embaralhadas."
          onPress={() => navigation.navigate('ModeSelect', { kind: 'anagram' })}
        />
        <MenuButton
          title="Bandeiras"
          subtitle="Veja a bandeira e escreva o nome do país em inglês."
          onPress={() => navigation.navigate('ModeSelect', { kind: 'flags' })}
        />
        <MenuButton
          title="Criptograma"
          subtitle="Cada símbolo é uma letra. Use as dicas para descobrir todos os países."
          onPress={() => navigation.navigate('CryptogramLevel')}
        />
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
    heading: {
      color: colors.text,
      fontSize: fontSize.xl,
      fontWeight: '800',
      marginBottom: spacing.lg,
    },
    list: { gap: spacing.md },
  });