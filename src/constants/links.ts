const PACKAGE = 'br.com.englishstudyhub.countriesgame';
const SITE = 'https://englishstudyhub.com.br';

// Links usados no app. Ajuste aqui se alguma URL mudar.
export const LINKS = {
  // O utm_source permite ver no analytics do site quantas visitas vieram do app
  site: `${SITE}/?utm_source=countriesgame&utm_medium=app&utm_campaign=about`,

  // Página com as professoras parceiras. Você atualiza a lista no site, sem novo build do app.
  partners: `${SITE}/professoras/?utm_source=countriesgame&utm_medium=app&utm_campaign=partners`,

  // ATENÇÃO: troque pela URL real onde você publicar a política de privacidade
  privacy: `${SITE}/politica-de-privacidade`,

  playStore: `https://play.google.com/store/apps/details?id=${PACKAGE}`,
  playStoreReviews: `https://play.google.com/store/apps/details?id=${PACKAGE}&showAllReviews=true`,
};

/**
 * Interruptor da parceria com professoras.
 * Deixe false até a página /professoras estar publicada e as professoras terem autorizado.
 * Com false, nenhum botão ou card de parceria aparece no app.
 */
export const PARTNERS_PAGE_ENABLED = false; // true para habilitar, false para desabilitar

export const SHARE_MESSAGE = `Estou aprendendo os países em inglês com o Countries Game! É grátis e sem anúncios: ${LINKS.playStore}`;