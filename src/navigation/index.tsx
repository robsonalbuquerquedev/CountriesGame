import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { RootStackParamList } from '../types';
import { colors } from '../theme';

import HomeScreen from '../features/game/screens/HomeScreen';
import ModeSelectScreen from '../features/game/screens/ModeSelectScreen';
import DifficultyScreen from '../features/game/screens/DifficultyScreen';
import GameScreen from '../features/game/screens/GameScreen';
import ResultScreen from '../features/game/screens/ResultScreen';
import RankingScreen from '../features/ranking/screens/RankingScreen';
import HistoryScreen from '../features/history/screens/HistoryScreen';
import StatsScreen from '../features/stats/screens/StatsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};

// Placeholder temporário. Troque pelas telas reais (Ranking, History, Stats) quando elas existirem.
function ComingSoon() {
  return (
    <View style={styles.soon}>
      <Text style={styles.soonText}>Em breve 🚧</Text>
    </View>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ModeSelect" component={ModeSelectScreen} options={{ title: 'Modo de jogo' }} />
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

const styles = StyleSheet.create({
  soon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  soonText: { color: colors.muted, fontSize: 18 },
});