const PACKAGE = 'br.com.englishstudyhub.countriesgame';
const SITE = 'https://englishstudyhub.com.br';

// Links usados no app. Ajuste aqui se alguma URL mudar.
export const LINKS = {
  // O utm_source permite ver no analytics do site quantas visitas vieram do app
  site: `${SITE}/?utm_source=countriesgame&utm_medium=app&utm_campaign=about`,

  // ATENÇÃO: troque pela URL real onde você publicar a política de privacidade
  privacy: `${SITE}/politica-de-privacidade`,

  playStore: `https://play.google.com/store/apps/details?id=${PACKAGE}`,
  playStoreReviews: `https://play.google.com/store/apps/details?id=${PACKAGE}&showAllReviews=true`,
};

export const SHARE_MESSAGE = `Estou aprendendo os países em inglês com o Countries Game! É grátis e sem anúncios: ${LINKS.playStore}`;