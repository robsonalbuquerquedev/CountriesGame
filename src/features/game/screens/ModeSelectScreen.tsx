import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types';
import { Palette, fontSize, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import MenuButton from '../components/MenuButton';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelect'>;

export default function ModeSelectScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Text style={styles.heading}>Como você quer jogar?</Text>

      <View style={styles.list}>
        <MenuButton
          variant="primary"
          title="Classic Mode"
          subtitle="3 vidas. Cada erro consome uma vida e o jogo termina quando elas acabam."
          onPress={() => navigation.navigate('Difficulty', { mode: 'classic' })}
        />
        <MenuButton
          title="Free Practice Mode"
          subtitle="Vidas infinitas. Pratique a escrita sem pressão, pelo tempo que quiser."
          onPress={() => navigation.navigate('Difficulty', { mode: 'free' })}
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