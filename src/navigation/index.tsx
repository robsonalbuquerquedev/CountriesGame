// src/navigation/index.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from '../types';
import { useTheme } from '../utils/useTheme';
import { useThemeStore } from '../store/themeStore';

import HomeScreen from '../features/game/screens/HomeScreen';
import ModeSelectScreen from '../features/game/screens/ModeSelectScreen';
import DifficultyScreen from '../features/game/screens/DifficultyScreen';
import GameScreen from '../features/game/screens/GameScreen';
import ResultScreen from '../features/game/screens/ResultScreen';
import RankingScreen from '../features/ranking/screens/RankingScreen';
import HistoryScreen from '../features/history/screens/HistoryScreen';
import StatsScreen from '../features/stats/screens/StatsScreen';
import AboutScreen from '../features/about/screens/AboutScreen';
import CountriesScreen from '../features/game/screens/CountriesScreen';
import GameSelectScreen from '../features/game/screens/GameSelectScreen';
import CryptogramLevelScreen from '../features/game/screens/CryptogramLevelScreen';
import CryptogramScreen from '../features/game/screens/CryptogramScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  const { colors, scheme } = useTheme();

  // Espera o tema salvo ser carregado, para não piscar no tema errado ao abrir o app
  const [hydrated, setHydrated] = useState(useThemeStore.persist.hasHydrated());
  useEffect(() => {
    const unsubscribe = useThemeStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useThemeStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  const navTheme = useMemo(() => {
    const base = scheme === 'light' ? DefaultTheme : DarkTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        primary: colors.primary,
        border: colors.border,
      },
    };
  }, [scheme, colors]);

  if (!hydrated) return null;

  return (
    <NavigationContainer theme={navTheme}>
      {/* Ícones claros em fundo escuro e escuros em fundo claro */}
      <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'Sobre' }} />
        <Stack.Screen name="Countries" component={CountriesScreen} options={{ title: 'Países' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GameSelect" component={GameSelectScreen} options={{ title: 'Jogar' }} />
        <Stack.Screen name="ModeSelect" component={ModeSelectScreen} options={{ title: 'Modo de jogo' }} />
        <Stack.Screen
          name="CryptogramLevel"
          component={CryptogramLevelScreen}
          options={{ title: 'Criptograma' }}
        />
        <Stack.Screen
          name="Cryptogram"
          component={CryptogramScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="Difficulty" component={DifficultyScreen} options={{ title: 'Dificuldade' }} />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="Ranking" component={RankingScreen} options={{ title: 'Ranking' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
        <Stack.Screen name="Stats" component={StatsScreen} options={{ title: 'Estatísticas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}