# Countries Game: material da ficha na Google Play

Textos e respostas prontos para preencher na Play Console. Confira os limites e os formulários na própria Play Console, porque eles podem mudar.

---

## 1. Informações principais

| Campo | Valor sugerido |
|---|---|
| Nome do app (máx. 30 caracteres) | `Countries Game` (14) ou `Countries: Países em Inglês` (27) |
| Categoria | Jogos → Educativo |
| Tags (opcional) | Educativo, Palavras, Quebra-cabeça, Aprender idiomas |
| Idioma padrão | Português (Brasil) |
| Contém anúncios | Não |
| Compras no app | Não |
| Preço | Gratuito |

---

## 2. Descrição curta (máx. 80 caracteres)

**Opção A (70 caracteres):**

```
Aprenda os países em inglês decifrando anagramas, com dicas e ranking.
```

**Opção B (60 caracteres):**

```
Jogo de anagramas para memorizar os países em inglês.
```

---

## 3. Descrição completa (máx. 4.000 caracteres)

```
Aprenda os nomes dos países em inglês jogando!

O Countries Game foi criado para estudantes brasileiros de inglês que querem ampliar o vocabulário geográfico e treinar a ortografia (spelling) de um jeito simples e divertido. Muitos nomes mudam bastante do português para o inglês, como Germany (Alemanha) e Singapore (Cingapura), e aqui você fixa cada um deles na prática.

COMO FUNCIONA
• Veja as letras embaralhadas do nome de um país e descubra a resposta em inglês
• Peça até 4 dicas, uma de cada vez: continente, número de caracteres, nome em português e capital
• Ganhe 10 pontos a cada resposta correta
• Depois de cada rodada, veja o país com a tradução, a capital e o continente

DOIS MODOS DE JOGO
• Classic Mode: comece com 3 vidas. Cada erro consome uma vida e o jogo termina quando elas acabam
• Free Practice Mode: vidas infinitas para praticar sem pressão, pelo tempo que quiser

CINCO NÍVEIS DE DIFICULDADE
• Easy: nomes curtos, como Japan e Brazil
• Medium: nomes médios, como Germany e Portugal
• Hard: nomes longos, como United States e South Korea
• All: todos os países, sem restrição de tamanho
• Random Global Mix: um desafio surpresa com chance igual para todos os continentes

ACOMPANHE SEU PROGRESSO
• Ranking com as suas melhores partidas, com o percentual de acerto, o modo e a dificuldade
• Histórico completo de todas as partidas
• Gráficos de estatísticas: acertos por continente (para saber o que revisar), distribuição geográfica dos países e evolução da sua pontuação

DETALHES
• 194 países, com nome em inglês, nome em português, capital e continente
• Aceita grafias alternativas (por exemplo, Czechia) e ignora acentos e maiúsculas
• Efeitos sonoros que você pode ligar ou desligar quando quiser
• Funciona sem internet
• Sem anúncios, sem compras e sem cadastro
• Seus dados ficam só no seu aparelho

Baixe agora e transforme a geografia em um treino de inglês!
```

---

## 4. Novidades da versão 1.0.0

```
Primeira versão do Countries Game! Modos Classic e Free Practice, 5 níveis de dificuldade, ranking, histórico e estatísticas com gráficos.
```

---

## 5. Material gráfico

| Item | Especificação | Observação |
|---|---|---|
| Ícone do app | PNG 512×512 | Pode reutilizar o `icon.png` (1024×1024) reduzido |
| Gráfico de destaque (feature graphic) | PNG ou JPG 1024×500 | Fundo `#0F172A`, globo em `#38BDF8`, nome do app e blocos de letras |
| Capturas de tela do celular | Mínimo de 2, até 8 | Formato retrato (ex.: 1080×1920) |

**Capturas sugeridas, nesta ordem:**

1. Tela inicial
2. Escolha de dificuldade
3. Jogo com o anagrama e as dicas abertas
4. Resposta correta, com o feedback
5. Tela de resultado
6. Estatísticas com os gráficos
7. Ranking

Dica: no Android, capture com `Power + Volume baixo`, ou pelo emulador do Android Studio.

---

## 6. Política de privacidade

A Play Console exige o **link público** da política.

1. Preencha `[NOME DO DESENVOLVEDOR]` e `[SEU_EMAIL]` no arquivo `PRIVACY_POLICY.md`.
2. Publique em um endereço acessível sem login. Opções:
   - **GitHub Pages:** no repositório, `Settings → Pages`, escolha a branch `main` e a pasta raiz. O link fica como `https://SEU_USUARIO.github.io/NOME_DO_REPO/PRIVACY_POLICY`.
   - **Link do arquivo no GitHub:** `https://github.com/SEU_USUARIO/NOME_DO_REPO/blob/main/PRIVACY_POLICY.md` (repositório público).
   - **Notion ou Google Sites**, publicados na web.
3. Abra o link em uma janela anônima para confirmar que carrega sem login.

---

## 7. Respostas dos formulários da Play Console

> Estas respostas refletem o app **como está hoje**. Se você adicionar anúncios, login, analytics ou compras, atualize os formulários e a política.

### Segurança dos dados (Data safety)

| Pergunta | Resposta |
|---|---|
| O app coleta ou compartilha dados de usuário obrigatórios? | **Não** |
| Tipos de dados coletados | Nenhum |
| Dados compartilhados com terceiros | Nenhum |
| Criptografia em trânsito | Não se aplica (o app não transmite dados) |
| Os usuários podem pedir a exclusão dos dados? | Os dados ficam só no aparelho e podem ser apagados no app ou desinstalando |
| Link da política de privacidade | O link da seção 6 |

### Classificação de conteúdo (questionário IARC)

Categoria: **Jogo**. Responda **Não** para todos os itens de violência, conteúdo sexual, linguagem imprópria, drogas, jogos de azar e interação entre usuários. O app também não compartilha localização nem tem compras. A classificação resultante tende a ser livre para todos os públicos, mas quem define é o questionário.

### Outras declarações

| Item | Resposta |
|---|---|
| Acesso ao app | Todas as funções estão disponíveis sem login |
| Anúncios | O app não contém anúncios |
| Aplicativo de notícias, saúde, finanças ou governo | Não |
| Público-alvo | Escolha as faixas etárias com cuidado: se incluir **menores de 13 anos**, a política de Famílias da Google exige requisitos adicionais. Confira as regras atuais na Play Console |

---

## 8. Sequência até a publicação

1. Gerar o build de produção (`.aab`): `eas build --platform android --profile production`
2. Criar o app na Play Console e preencher a ficha (seções 1 a 5)
3. Cadastrar a política de privacidade (seção 6) e responder os formulários (seção 7)
4. **Enviar o primeiro `.aab` manualmente** pela Play Console, em Teste interno. O `eas submit` normalmente só funciona nos envios seguintes
5. Contas pessoais novas costumam precisar de um **teste fechado** com um número mínimo de testadores por um período mínimo antes de liberar a produção (a regra recente era de 12 testadores por 14 dias). Confira o requisito atual
6. Enviar para análise e liberar em produção

Depois do primeiro envio manual, as próximas versões saem com:

```bash
eas build --platform android --profile production
eas submit --platform android --profile production
```
