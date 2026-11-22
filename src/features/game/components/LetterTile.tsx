import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { colors, fontSize, radius, spacing } from '../../../theme';

interface Props {
  letter: string;
  index: number;
  celebrate: number; // contador: a cada acerto aumenta e faz as letras pularem
}

export default function LetterTile({ letter, index, celebrate }: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const hop = useRef(new Animated.Value(0)).current;
  const lastCelebrate = useRef(celebrate);

  // Entrada: cada letra aparece com um pequeno atraso, da esquerda para a direita
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 220,
      delay: Math.min(index * 25, 400),
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  // Acerto: as letras pulam em onda
  useEffect(() => {
    if (celebrate === lastCelebrate.current) return;
    lastCelebrate.current = celebrate;

    Animated.sequence([
      Animated.delay(Math.min(index * 35, 500)),
      Animated.timing(hop, { toValue: -14, duration: 120, useNativeDriver: true }),
      Animated.spring(hop, { toValue: 0, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
  }, [celebrate, hop, index]);

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });

  return (
    <Animated.View
      style={[
        styles.tile,
        { opacity: enter, transform: [{ translateY: hop }, { scale }] },
      ]}
    >
      <Text style={styles.text}>{letter}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    minWidth: 38,
    height: 46,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: colors.text, fontSize: fontSize.lg, fontWeight: '800' },
});