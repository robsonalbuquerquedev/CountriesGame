import React from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';

import { colors, fontSize, radius, spacing } from '../../../theme';
import { LINKS, SHARE_MESSAGE, PARTNERS_PAGE_ENABLED } from '../../../constants/links';
import MenuButton from '../../game/components/MenuButton';

async function openUrl(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Não foi possível abrir o link', 'Verifique se há um navegador instalado.');
  }
}

async function shareApp() {
  try {
    await Share.share({ message: SHARE_MESSAGE });
  } catch {
    // o jogador fechou a janela de compartilhamento; nada a fazer
  }
}

export default function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🌍</Text>
          <Text style={styles.title}>Countries Game</Text>
          <Text style={styles.version}>Versão {version}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardText}>
            Jogo criado pelo English Study Hub para ajudar estudantes brasileiros a memorizar os
            nomes dos países em inglês e a treinar a ortografia.
          </Text>
          <Text style={styles.cardText}>
            É gratuito, não tem anúncios, não pede cadastro e funciona sem internet. Seus dados
            ficam apenas neste aparelho.
          </Text>
        </View>

        <View style={styles.actions}>
          <MenuButton
            variant="primary"
            title="Visitar o English Study Hub"
            subtitle="englishstudyhub.com.br"
            onPress={() => openUrl(LINKS.site)}
          />
          <MenuButton
            title="Compartilhar com amigos"
            subtitle="Convide quem também estuda inglês"
            onPress={shareApp}
          />
          <MenuButton
            title="Avaliar na Play Store"
            subtitle="Sua avaliação ajuda o app a chegar a mais pessoas"
            onPress={() => openUrl(LINKS.playStoreReviews)}
          />
          {PARTNERS_PAGE_ENABLED && (
            <MenuButton
              title="Professoras parceiras"
              subtitle="englishstudyhub.com.br/professoras"
              onPress={() => openUrl(LINKS.partners)}
            />
          )}
          <MenuButton
            variant="ghost"
            title="Política de privacidade"
            onPress={() => openUrl(LINKS.privacy)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },

  header: { alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.md },
  emoji: { fontSize: 64 },
  title: { color: colors.text, fontSize: fontSize.xl, fontWeight: '900' },
  version: { color: colors.muted, fontSize: fontSize.sm },

  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardText: { color: colors.text, fontSize: fontSize.md, lineHeight: 22 },

  actions: { gap: spacing.md },
});