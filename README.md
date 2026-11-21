# 🌍 Countries Game: Memorizando Países em Inglês

Jogo mobile para estudantes brasileiros de inglês que querem **aprender e fixar os nomes dos países em inglês** de forma simples e interativa. O jogador decifra anagramas, usa dicas progressivas e acompanha a evolução por meio de ranking, histórico e gráficos.

Desenvolvido com **React Native (Expo) + TypeScript**, com foco em publicação na **Google Play Store** (categoria Jogos → Educativo).

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
- [Persistência de dados](#-persistência-de-dados)
- [Scripts úteis](#-scripts-úteis)
- [Publicação na Play Store](#-publicação-na-play-store)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🎯 Objetivos pedagógicos

- **Vocabulário geográfico:** aprender os nomes dos países em inglês, que muitas vezes diferem do português (*Germany* para Alemanha, *Singapore* para Cingapura).
- **Ortografia (spelling):** treinar a escrita correta organizando anagramas com letras embaralhadas.
- **Memorização ativa:** associar cada país à sua capital e ao seu continente.

---

## 🎮 Como jogar

### 1. Escolha o modo

| Modo | Descrição |
|---|---|
| **Classic Mode** | Começa com 3 vidas. Cada resposta incorreta consome uma vida e o jogo termina quando elas acabam. |
| **Free Practice Mode** | Vidas infinitas. Pratique sem pressão pelo tempo que quiser e encerre pelo botão **Sair**. |

### 2. Escolha a dificuldade

| Nível | Regra | Exemplos |
|---|---|---|
| **Easy** | Nomes com até 6 caracteres | Japan, Brazil |
| **Medium** | Nomes de 7 a 10 caracteres | Germany, Portugal |
| **Hard** | Nomes com mais de 10 caracteres | United States, South Korea |
| **All** | Sem restrição de tamanho | qualquer país |
| **Random Global Mix** | Sorteio surpresa com chance igual para cada continente | qualquer país |

> O tamanho do nome considera **todos os caracteres, incluindo espaços**.

### 3. Resolva cada rodada

Em cada pergunta o jogador vê as **letras embaralhadas** do país (sem espaços) e pode revelar **até 4 dicas**, uma de cada vez:

1. **Continente** onde o país está localizado
2. **Quantidade de caracteres** do nome (incluindo espaços)
3. **Nome em português**
4. **Capital** em inglês

Depois de responder, o app mostra o país com a tradução, a capital e o continente, para reforçar o aprendizado.

---

## ✨ Funcionalidades

- 🕹️ Dois modos de jogo e cinco níveis de dificuldade
- 🔤 Anagrama com letras embaralhadas, sempre diferentes do nome original
- 💡 Dicas progressivas (uso opcional, sem penalidade de pontos)
- ✅ Validação tolerante: ignora maiúsculas, acentos e hífens, e aceita grafias alternativas (ex.: `Czechia`, `Burma`, `Holland`)
- 🔁 Sem repetição de países até que todos do nível tenham saído
- ⭐ Pontuação: **10 pontos** por resposta correta
- 🏆 **Ranking** com as 50 melhores partidas (pontuação, % de acerto, modo e dificuldade)
- 📜 **Histórico** completo de partidas, com opção de apagar os dados
- 📊 **Estatísticas** com três gráficos:
  - **Barras:** acertos por continente (indica qual continente revisar)
  - **Rosca:** distribuição dos países cadastrados por continente
  - **Linha:** evolução da pontuação ao longo das partidas
- 📳 Feedback tátil (vibração) ao acertar e ao errar
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
| Build e deploy | [EAS Build / EAS Submit](https://docs.expo.dev/eas/) |

---

## 📂 Estrutura do projeto

O projeto é organizado **por funcionalidade (feature)**:

```
countries-game/
├── assets/                          # ícone, splash e imagens
├── src/
│   ├── data/
│   │   └── countries.ts             # banco com 194 países
│   ├── features/
│   │   ├── game/
│   │   │   ├── components/          # MenuButton, MatchRow
│   │   │   ├── logic/
│   │   │   │   └── gameLogic.ts     # regras: filtro, anagrama, validação, pontuação
│   │   │   └── screens/             # Home, ModeSelect, Difficulty, Game, Result
│   │   ├── ranking/screens/         # RankingScreen
│   │   ├── history/screens/         # HistoryScreen
│   │   └── stats/screens/           # StatsScreen (3 gráficos)
│   ├── navigation/
│   │   └── index.tsx                # rotas e tema de navegação
│   ├── store/
│   │   └── statsStore.ts            # partidas salvas (Zustand + AsyncStorage)
│   ├── theme/
│   │   └── index.ts                 # cores, espaçamentos e tipografia
│   ├── types/
│   │   └── index.ts                 # tipos compartilhados e rotas
│   └── utils/
│       ├── labels.ts                # rótulos de modos e dificuldades
│       └── format.ts                # formatação de datas
├── App.tsx
├── app.json
├── package.json
└── tsconfig.json
```

### Fluxo de telas

```
Home ──► ModeSelect ──► Difficulty ──► Game ──► Result
  │                                      ▲          │
  │                                      └──────────┘  (jogar novamente)
  ├──► Ranking
  ├──► History
  └──► Stats
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
  namePt: 'República Tcheca',      // Dica 3
  capital: 'Prague',               // Dica 4
  continent: 'Europe',             // Dica 1
  aliases: ['Czechia'],            // grafias alternativas aceitas (opcional)
}
```

Para **adicionar ou corrigir um país**, edite apenas esse arquivo. O jogo, os filtros de dificuldade e o gráfico de distribuição se atualizam automaticamente.

---

## 📐 Regras do jogo

| Regra | Valor |
|---|---|
| Pontos por acerto | 10 |
| Vidas no Classic Mode | 3 |
| Vidas no Free Practice | infinitas |
| Dicas por rodada | até 4 |
| Penalidade por usar dicas | nenhuma |

**Validação das respostas:** a comparação ignora maiúsculas e minúsculas, acentos, hífens e apóstrofos. Espaços extras são removidos.

**Resultado da partida:** ao sair ou ao perder todas as vidas, a partida é salva com pontuação, acertos, total de perguntas, modo, dificuldade e desempenho por continente. Partidas sem nenhuma resposta não entram no histórico.

---

## 💾 Persistência de dados

As partidas são salvas **no próprio aparelho** com Zustand + AsyncStorage (chave `stats-storage`). Ranking, histórico e estatísticas são calculados a partir dessa lista.

- Os dados permanecem depois de fechar o app.
- O app **não coleta nem envia dados** a servidores.
- A opção **Apagar todos os dados** (tela de Histórico) limpa tudo, com confirmação.

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
eas build --platform android --profile production   # gera o .aab
eas submit --platform android                        # envia para a Play Console
```

### Checklist

- [ ] Conta de desenvolvedor Google Play
- [ ] `android.package` único no `app.json` (ex.: `com.seunome.countriesgame`)
- [ ] Ícone do app (1024×1024), ícone da loja (512×512) e *feature graphic* (1024×500)
- [ ] Capturas de tela do app
- [ ] Política de privacidade (obrigatória)
- [ ] Questionário de classificação etária
- [ ] Formulário de segurança dos dados
- [ ] Categoria: **Jogos → Educativo**
- [ ] Teste fechado, se exigido para o tipo de conta (confira as regras atuais na Play Console)

---

## 🗺️ Roadmap

- [x] Banco de dados de países (194)
- [x] Modos Classic e Free Practice
- [x] Cinco níveis de dificuldade
- [x] Anagrama, dicas progressivas e pontuação
- [x] Ranking, histórico e estatísticas com gráficos
- [x] Persistência local
- [ ] Ícone, splash screen e identidade visual
- [ ] Efeitos sonoros e animações
- [ ] Testes automatizados da lógica do jogo
- [ ] Testes em aparelhos reais (telas pequenas e grandes)
- [ ] Publicação na Google Play Store
- [ ] Ideias futuras: dicas com bandeiras, novos modos (capitais, continentes) e suporte a outros idiomas

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
