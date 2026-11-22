import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '../../../theme';
import { LINKS, PARTNERS_PAGE_ENABLED } from '../../../constants/links';

async function openPartnersPage() {
  try {
    await Linking.openURL(LINKS.partners);
  } catch {
    Alert.alert('Não foi possível abrir o link', 'Verifique se há um navegador instalado.');
  }
}

// Card discreto para a tela de resultado. Só aparece com PARTNERS_PAGE_ENABLED = true.
export default function PartnersCallout() {
  if (!PARTNERS_PAGE_ENABLED) return null;

  return (
    <Pressable
      onPress={openPartnersPage}
      accessibilityRole="link"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.text}>
        <Text style={styles.title}>Quer ir além do jogo?</Text>
        <Text style={styles.sub}>Conheça professoras de inglês parceiras</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
  },
  pressed: { opacity: 0.8 },
  text: { flex: 1, gap: 2 },
  title: { color: colors.text, fontSize: fontSize.md, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: fontSize.sm },
  arrow: { color: colors.primary, fontSize: fontSize.xl, fontWeight: '700' },
});