import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types';
import { Palette, fontSize, spacing } from '../../../theme';
import { useTheme } from '../../../utils/useTheme';
import { useStatsStore } from '../../../store/statsStore';
import MenuButton from '../components/MenuButton';
import ThemeSelector from '../components/ThemeSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const matches = useStatsStore((s) => s.matches);

  const bestScore = useMemo(
    () => matches.reduce((max, m) => Math.max(max, m.score), 0),
    [matches]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🌍</Text>
        <Text style={styles.title}>Countries Game</Text>
        <Text style={styles.subtitle}>Memorizando Países em Inglês</Text>
        {bestScore > 0 && <Text style={styles.best}>Seu recorde: {bestScore} pts</Text>}
      </View>

      <View style={styles.menu}>
        <MenuButton
          variant="primary"
          title="Jogar"
          subtitle="Escolha o modo, o continente e a dificuldade"
          onPress={() => navigation.navigate('ModeSelect')}
        />
        <MenuButton
          title="Países"
          subtitle="Consulte os países de cada continente"
          onPress={() => navigation.navigate('Countries')}
        />
        <MenuButton
          title="Ranking"
          subtitle="Suas melhores pontuações"
          onPress={() => navigation.navigate('Ranking')}
        />
        <MenuButton
          title="Histórico de partidas"
          subtitle="Tudo o que você já jogou"
          onPress={() => navigation.navigate('History')}
        />
        <MenuButton
          title="Estatísticas"
          subtitle="Gráficos do seu progresso"
          onPress={() => navigation.navigate('Stats')}
        />
      </View>

      <ThemeSelector />

      <Pressable onPress={() => navigation.navigate('About')} hitSlop={8}>
        <Text style={styles.about}>Sobre o English Study Hub</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const makeStyles = (colors: Palette) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
    header: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
    emoji: { fontSize: 72 },
    title: { color: colors.text, fontSize: 34, fontWeight: '900' },
    subtitle: { color: colors.muted, fontSize: fontSize.md },
    best: { color: colors.warning, fontSize: fontSize.md, fontWeight: '700', marginTop: spacing.sm },
    menu: { gap: spacing.md, paddingBottom: spacing.md },
    about: {
      color: colors.muted,
      fontSize: fontSize.sm,
      textAlign: 'center',
      paddingBottom: spacing.sm,
    },
  });