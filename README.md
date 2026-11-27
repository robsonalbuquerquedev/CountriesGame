# 🌍 Countries Game: Memorizando Países em Inglês

Jogo mobile para estudantes brasileiros de inglês que querem **aprender e fixar os nomes dos países em inglês** de forma simples e interativa. O jogador decifra anagramas, reconhece bandeiras, resolve criptogramas, usa dicas e acompanha a evolução por meio de ranking, histórico e gráficos.

Desenvolvido com **React Native (Expo) + TypeScript** pelo [English Study Hub](https://englishstudyhub.com.br). É **gratuito, sem anúncios, sem cadastro** e funciona **sem internet**.

> **Status:** versão **1.2.0** em **teste fechado** na Google Play (categoria Jogos → Educativo). A publicação para todos depende do fim do período de testes exigido pela Google.

---

## 📑 Sumário

- [Objetivos pedagógicos](#-objetivos-pedagógicos)
- [Como jogar](#-como-jogar)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como executar](#-como-executar)
- [Banco de países](#-banco-de-países)
- [Regras do jogo](#-regras-do-jogo)
- [Persistência de dados e privacidade](#-persistência-de-dados-e-privacidade)
- [Configurações do código](#-configurações-do-código)
- [Scripts úteis](#-scripts-úteis)
- [Publicação na Play Store](#-publicação-na-play-store)
- [Histórico de versões](#-histórico-de-versões)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Objetivos pedagógicos

- **Vocabulário geográfico:** aprender os nomes dos países em inglês, que muitas vezes diferem do português (*Germany* para Alemanha, *Singapore* para Cingapura).
- **Ortografia (spelling):** treinar a escrita correta dos nomes, por anagramas, bandeiras e criptogramas.
- **Memorização ativa:** associar cada país ao seu continente, à sua bandeira e à sua capital.
- **Estudo dirigido:** treinar só os continentes que o aluno quer revisar e consultar a lista de países sem jogar.

---

## 🎮 Como jogar

### 1. Escolha o jogo

| Jogo | Descrição |
|---|---|
| **Anagramas** | Letras embaralhadas do país. O jogador monta o nome em inglês. |
| **Bandeiras** | O jogador vê a bandeira e escreve o nome do país em inglês. |
| **Criptograma** | Cada símbolo esconde uma letra. Com a dica de cada país, o jogador descobre todas as palavras. |

### 2. Anagramas e Bandeiras: escolha o modo

| Modo | Descrição |
|---|---|
| **Classic Mode** | Começa com 3 vidas. Cada resposta incorreta consome uma vida e o jogo termina quando elas acabam. |
| **Free Practice Mode** | Vidas infinitas. Pratique sem pressão pelo tempo que quiser e encerre pelo botão **Sair**. |

### 3. Escolha os continentes e a dificuldade

Na mesma tela, o jogador marca **um ou mais continentes** (sem marcar, jogam todos) e escolhe a dificuldade. O número de países de cada nível se ajusta ao filtro escolhido.

| Nível | Regra | Exemplos |
|---|---|---|
| **Easy** | Nomes com até 6 caracteres | Japan, Brazil |
| **Medium** | Nomes de 7 a 10 caracteres | Germany, Portugal |
| **Hard** | Nomes com mais de 10 caracteres | United States, South Korea |
| **All** | Sem restrição de tamanho | qualquer país |
| **Random Global Mix** | Sorteio surpresa com chance igual para cada continente escolhido | qualquer país |

> O tamanho do nome considera **todos os caracteres, incluindo espaços**.

### 4. Resolva cada rodada

Em cada pergunta o jogador pode revelar **até 4 dicas**, uma de cada vez. **As dicas ficam mais econômicas conforme o nome é mais longo (mais difícil):**

| Dica | Easy (até 6) | Medium (7 a 10) | Hard (mais de 10) |
|---|---|---|---|
| **1** | Continente | Continente | Continente |
| **2** | Letra inicial (e nº de palavras) | Letra inicial (e nº de palavras) | Letra inicial (e nº de palavras) |
| **3** | Nome em português | Nome em português | **Capital** |
| **4** | Metade das letras (`B _ a _ i _`) | Uma letra a cada três (`G _ _ m _ _ y`) | Início e fim de cada palavra (`U _ _ _ _ d   S _ _ _ _ s`) |

No modo **All** e no **Random Global Mix**, cada país recebe as dicas do seu próprio nível.

Depois de responder, o app mostra o país com a tradução, a capital e o continente, para reforçar o aprendizado.

### 5. Criptograma

O jogador escolhe entre três níveis. Cada nível traz países de uma só palavra, cada um com uma dica ao lado das casinhas:

| Nível | Países | Dica de cada país | Letras já reveladas |
|---|---|---|---|
| **Fácil** | 5 | Nome em português e continente | 5 |
| **Médio** | 7 | Nome em português | 3 |
| **Difícil** | 9 | Capital e continente | 1 |

- Cada símbolo representa **sempre a mesma letra**. Ao escolher a letra de uma casinha, todas as casinhas com o mesmo símbolo são preenchidas.
- Letras que aparecem em várias palavras ajudam a resolver as outras.
- Quase sempre há uma letra que aparece em **uma só palavra**, e o jogador precisa deduzi-la pela dica.
- Botões: **Apagar**, **Revelar** (−5 pontos) e **Verificar** (marca em vermelho as letras erradas, −2 pontos cada).

---

## ✨ Funcionalidades

- 🕹️ **Três jogos:** anagramas, bandeiras e criptograma
- 🧭 Dois modos (Classic e Free Practice) e cinco níveis de dificuldade
- 🗺️ **Treino por continente:** escolha um, vários ou todos
- 💡 **Dicas por nível de dificuldade** (uso opcional, sem penalidade de pontos nos anagramas e bandeiras)
- 🔤 Anagrama com letras embaralhadas, sempre diferentes do nome original
- 🏳️ **Bandeiras** dos 194 países em emoji, sem imagens e sem internet
- 🧩 **Criptograma** em três níveis, com símbolos coloridos
- 📖 **Países:** tela de consulta por continente, com busca por país ou capital
- ✅ Validação tolerante: ignora maiúsculas, acentos e hífens, e aceita grafias alternativas (ex.: `Czechia`, `Burma`, `Holland`)
- 🔁 Sem repetição de países até que todos do nível tenham saído
- ⭐ Pontuação: **10 pontos** por resposta correta
- 🏆 **Ranking** com as 50 melhores partidas (pontuação, % de acerto, tipo de jogo, modo, dificuldade e continentes)
- 📜 **Histórico** completo de partidas, com opção de apagar os dados
- 📊 **Estatísticas** com três gráficos:
  - **Barras:** acertos por continente (indica qual continente revisar)
  - **Rosca:** distribuição dos países cadastrados por continente
  - **Linha:** evolução da pontuação ao longo das partidas
- 🌗 **Tema claro e escuro**, com interruptor na tela inicial (a escolha fica salva)
- 🔊 Efeitos sonoros com opção de **ligar e desligar**
- ✨ Animações: tremida ao errar e letras que pulam ao acertar
- 📳 Feedback tátil (vibração) ao acertar e ao errar
- 📱 **Tela inicial minimalista**, que rola em celulares pequenos
- ℹ️ Tela **Sobre**: site, compartilhar, avaliar na Play Store e política de privacidade
- ⭐ Pedido de avaliação **uma única vez**, depois de 5 partidas e 70% de acertos
- 💾 Dados salvos no aparelho, mantidos mesmo depois de fechar o app

---

## 🛠️ Tecnologias

| Categoria | Tecnologia |
|---|---|
| Framework | [React Native](https://reactnative.dev/) com [Expo](https://expo.dev/) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Navegação | [React Navigation](https://reactnavigation.org/) (Native Stack) |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs/) com middleware `persist` |
| Armazenamento local | [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) |
| Gráficos | [react-native-gifted-charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts) + `react-native-svg` |
| Feedback tátil | `expo-haptics` |
| Sons | `expo-audio` |
| Avaliação na loja | `expo-store-review` |
| Versão e metadados | `expo-constants` |
| Splash e ícone | `expo-splash-screen` |
| Build e deploy | [EAS Build / EAS Submit](https://docs.expo.dev/eas/) |

> `expo-audio` e `expo-store-review` são módulos nativos: para testá-los, use um build (EAS) em vez do Expo Go antigo.

---

## 📂 Estrutura do projeto

O projeto é organizado **por funcionalidade (feature)**:

```
countries-game/
├── assets/                          # ícone, splash, imagens e sons (correct.wav, wrong.wav)
├── src/
│   ├── constants/
│   │   └── links.ts                 # site, política de privacidade, Play Store, parcerias
│   ├── data/
│   │   ├── countries.ts             # banco com 194 países
│   │   └── flags.ts                 # código ISO de cada país (bandeira em emoji)
│   ├── features/
│   │   ├── game/
│   │   │   ├── components/          # MenuButton, LetterTile, MatchRow, ThemeSelector
│   │   │   ├── logic/
│   │   │   │   ├── gameLogic.ts     # filtro, anagrama, dicas por nível, validação, pontuação
│   │   │   │   └── cryptogramLogic.ts  # geração e regras do criptograma
│   │   │   └── screens/             # Home, GameSelect, ModeSelect, Difficulty, Game,
│   │   │                            # CryptogramLevel, Cryptogram, Result, Countries
│   │   ├── ranking/screens/         # RankingScreen
│   │   ├── history/screens/         # HistoryScreen
│   │   ├── stats/screens/           # StatsScreen (3 gráficos)
│   │   └── about/screens/           # AboutScreen
│   ├── navigation/
│   │   └── index.tsx                # rotas, tema de navegação e barra de status
│   ├── store/
│   │   ├── statsStore.ts            # partidas salvas (Zustand + AsyncStorage)
│   │   ├── settingsStore.ts         # som ligado/desligado e pedido de avaliação
│   │   └── themeStore.ts            # tema escolhido (claro, escuro ou automático)
│   ├── theme/
│   │   └── index.ts                 # paletas clara e escura, espaçamentos e tipografia
│   ├── types/
│   │   └── index.ts                 # tipos compartilhados e rotas
│   └── utils/
│       ├── labels.ts                # rótulos de jogos, modos e dificuldades
│       ├── format.ts                # formatação de datas
│       ├── useTheme.ts              # cores do tema atual
│       ├── useSounds.ts             # efeitos sonoros
│       └── useReviewPrompt.ts       # pedido de avaliação (uma vez)
├── App.tsx
├── app.json
├── eas.json
├── package.json
└── tsconfig.json
```

### Fluxo de telas

```
Home ──► GameSelect ─┬─► ModeSelect ──► Difficulty ──► Game ──► Result
  │                  │    (Anagramas e Bandeiras)         ▲         │
  │                  │                                    └─────────┘  (jogar novamente)
  │                  └─► CryptogramLevel ──► Cryptogram ──► Result
  ├──► Countries
  ├──► Ranking
  ├──► History
  ├──► Stats
  └──► About
```

---

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- npm
- Aplicativo **Expo Go** no celular Android/iOS, ou um emulador (Android Studio)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/robsonalbuquerquede/ContriesGame.git
cd ContriesGame

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android) ou com a câmera (iOS). Para abrir no emulador Android, pressione `a` no terminal.

---

## 🌐 Banco de países

O arquivo `src/data/countries.ts` contém **194 países**: os 193 membros da ONU mais o Vaticano.

| Continente | Países |
|---|---|
| África | 54 |
| Ásia | 46 |
| Europa | 45 |
| América do Norte | 23 |
| América do Sul | 12 |
| Oceania | 14 |

Cada registro segue o formato:

```ts
{
  name: 'Czech Republic',          // resposta correta (inglês)
  namePt: 'República Tcheca',      // nome em português (dica e consulta)
  capital: 'Prague',               // capital (dica e consulta)
  continent: 'Europe',             // continente (dica e filtro)
  aliases: ['Czechia'],            // grafias alternativas aceitas (opcional)
}
```

O arquivo `src/data/flags.ts` liga o `name` de cada país ao código ISO usado para montar a bandeira em emoji. Para **adicionar ou corrigir um país**, edite `countries.ts` e, se for um país novo, acrescente também o código em `flags.ts`. Um país sem código continua nos outros jogos, mas não aparece no modo Bandeiras. Os filtros, as dicas e os gráficos se atualizam automaticamente.

---

## 📐 Regras do jogo

| Regra | Valor |
|---|---|
| Pontos por acerto (Anagramas e Bandeiras) | 10 |
| Vidas no Classic Mode | 3 |
| Vidas no Free Practice | infinitas |
| Dicas por rodada | até 4 |
| Penalidade por usar dicas | nenhuma |
| Criptograma: pontos | 10 por país, −2 por letra errada apontada em Verificar, −5 por letra revelada (mínimo 10) |

**Validação das respostas:** a comparação ignora maiúsculas e minúsculas, acentos, hífens e apóstrofos. Espaços extras são removidos.

**Resultado da partida:** ao sair ou ao perder todas as vidas, a partida de anagramas ou bandeiras é salva com pontuação, acertos, total de perguntas, tipo de jogo, modo, dificuldade, continentes e desempenho por continente. Partidas sem nenhuma resposta não entram no histórico. O criptograma é salvo quando é **completado** (com o tempo gasto); sair antes não registra a partida.

---

## 💾 Persistência de dados e privacidade

As partidas e as preferências são salvas **no próprio aparelho** com Zustand + AsyncStorage:

| Chave | Conteúdo |
|---|---|
| `stats-storage` | histórico de partidas (base do ranking e das estatísticas) |
| `settings-storage` | som ligado ou desligado e pedido de avaliação |
| `theme-storage` | tema escolhido |

- Os dados permanecem depois de fechar o app.
- O app **não coleta nem envia dados** a servidores, não tem anúncios e não pede cadastro.
- A opção **Apagar todos os dados** (tela de Histórico) limpa as partidas, com confirmação.
- Política de privacidade: <https://englishstudyhub.com.br/politica-de-privacidade-countries-game>

---

## ⚙️ Configurações do código

| Onde | O que controla |
|---|---|
| `src/constants/links.ts` → `PARTNERS_PAGE_ENABLED` | Mostra ou esconde o botão de **professoras parceiras** (página no site). Começa em `false`. |
| `src/features/game/logic/cryptogramLogic.ts` → `SYMBOL_STYLE` | `'symbols'` usa figuras (★ ♠ ●) e `'numbers'` usa números de 1 a 26, caso algum símbolo não apareça no aparelho. |
| `src/features/game/logic/cryptogramLogic.ts` → `LEVEL_CONFIG` | Quantidade de países, tamanho dos nomes e letras reveladas de cada nível do criptograma. |
| `src/store/themeStore.ts` | Tema inicial (começa em escuro). |

---

## 🧰 Scripts úteis

```bash
npx expo start               # inicia o servidor de desenvolvimento
npx expo start --clear       # inicia limpando o cache do Metro
npx tsc --noEmit             # verifica erros de tipo sem gerar arquivos
```

---

## 📦 Publicação na Play Store

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview      # gera um .apk para testes
eas build --platform android --profile production   # gera o .aab para a loja
eas submit --platform android                        # envia para a Play Console
```

O primeiro envio do `.aab` é feito manualmente na Play Console. O `eas.json` usa `autoIncrement`, então o número da versão (`versionCode`) sobe sozinho a cada build de produção.

### Checklist

- [x] Conta de desenvolvedor Google Play
- [x] `android.package` único no `app.json` (`br.com.englishstudyhub.countriesgame`)
- [x] Ícone, splash e identidade visual
- [x] Política de privacidade publicada no site
- [x] Declarações do app (anúncios, acesso, público-alvo, classificação, segurança de dados)
- [x] Categoria: **Jogos → Educativo**
- [x] Teste fechado iniciado com 12 ou mais testadores
- [ ] Concluir **14 dias seguidos** de teste fechado
- [ ] Capturas de tela reais da versão atual e gráfico de destaque
- [ ] Solicitar acesso à produção e responder o questionário da Google
- [ ] Publicar para todos

---

## 🕓 Histórico de versões

| Versão | Novidades |
|---|---|
| **1.2.0** | Jogos **Bandeiras** e **Criptograma**, tela inicial minimalista e interruptor de tema. |
| **1.1.x** | Dicas melhoradas e por nível, treino por continente, tela **Países** e tema claro/escuro. |
| **1.0.0** | Primeira versão: anagramas, Classic e Free Practice, cinco dificuldades, ranking, histórico, estatísticas, sons e animações. |

---

## 🗺️ Roadmap

- [x] Banco de dados de países (194)
- [x] Modos Classic e Free Practice
- [x] Cinco níveis de dificuldade
- [x] Anagrama, dicas progressivas e pontuação
- [x] Ranking, histórico e estatísticas com gráficos
- [x] Persistência local
- [x] Ícone, splash screen e identidade visual
- [x] Efeitos sonoros e animações
- [x] Treino por continente e tela de consulta de países
- [x] Dicas por nível de dificuldade
- [x] Modos Bandeiras e Criptograma
- [x] Tema claro e escuro
- [x] Tela Sobre, compartilhar e avaliação
- [ ] Testes em aparelhos reais (teste fechado em andamento)
- [ ] Testes automatizados da lógica do jogo
- [ ] Publicação para todos na Google Play Store
- [ ] Ideias futuras: filtro de continentes no criptograma, ranking por tipo de jogo, modo de capitais, múltipla escolha nas bandeiras e suporte a outros idiomas

---

## 🤝 Contribuindo

Sugestões e correções são bem-vindas.

1. Faça um *fork* do projeto
2. Crie uma branch: `git checkout -b feat/minha-melhoria`
3. Faça o commit: `git commit -m "feat: descrição da melhoria"`
4. Envie para o seu fork: `git push origin feat/minha-melhoria`
5. Abra um *Pull Request*

Erros de tradução, capitais ou grafias de países também podem ser corrigidos diretamente em `src/data/countries.ts`.

---

## 📄 Licença

Distribuído sob a licença indicada no arquivo [LICENSE](./LICENSE).