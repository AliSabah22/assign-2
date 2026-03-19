/*
 * PROG20261 — Assignment N2
 *
 * CLI commands used:
 *   npx @react-native-community/cli@latest init assignment2
 *   npm install @react-navigation/native @react-navigation/stack
 *   npm install react-native-screens react-native-safe-area-context react-native-gesture-handler
 *   cd ios && pod install
 *
 * Resources:
 *   https://reactnavigation.org/docs/getting-started
 *   https://reactnavigation.org/docs/stack-navigator
 *   https://reactnative.dev/docs/flatlist
 *   https://reactnative.dev/docs/touchableopacity
 *   https://reactnative.dev/docs/stylesheet
 *
 * AI assistance: portions of this file were developed with Claude (Anthropic).
 */

import React, { createContext, useCallback, useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { StackScreenProps } from '@react-navigation/stack';

// ─── Types ───────────────────────────────────────────────────────────────────

type StatKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Stats = Record<StatKey, number>;

interface StatisticsContextValue {
  statistics: Stats;
  setStatistics: React.Dispatch<React.SetStateAction<Stats>>;
}

type RootStackParamList = {
  Home: undefined;
  Statistics: undefined;
};

type HomeProps = StackScreenProps<RootStackParamList, 'Home'>;
type StatisticsProps = StackScreenProps<RootStackParamList, 'Statistics'>;

// ─── Constants ───────────────────────────────────────────────────────────────

const STAT_KEYS: StatKey[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const initialStats: Stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

// ─── Context ─────────────────────────────────────────────────────────────────

const StatisticsContext = createContext<StatisticsContextValue | undefined>(undefined);

const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistics, setStatistics] = useState<Stats>(initialStats);
  return (
    <StatisticsContext.Provider value={{ statistics, setStatistics }}>
      {children}
    </StatisticsContext.Provider>
  );
};

const useStatistics = (): StatisticsContextValue => {
  const ctx = useContext(StatisticsContext);
  if (!ctx) throw new Error('useStatistics must be used within StatisticsProvider');
  return ctx;
};

// ─── Shared Component ────────────────────────────────────────────────────────

const AppButton: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.6}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

// ─── Navigator ───────────────────────────────────────────────────────────────

const Stack = createStackNavigator<RootStackParamList>();

// ─── Screens ─────────────────────────────────────────────────────────────────

const HomeScreen: React.FC<HomeProps> = ({ navigation }) => {
  const { setStatistics } = useStatistics();
  const [current, setCurrent] = useState<StatKey | null>(null);

  useFocusEffect(useCallback(() => { setCurrent(null); }, []));

  const generate = () => {
    const n = (Math.floor(Math.random() * 9) + 1) as StatKey;
    setCurrent(n);
    setStatistics(prev => ({ ...prev, [n]: prev[n] + 1 }));
  };

  return (
    <View style={styles.screen}>
      <View style={styles.center}>
        <Text style={styles.number}>{current ?? '…'}</Text>
      </View>
      <View style={styles.buttonRow}>
        <AppButton label="Generate" onPress={generate} />
        <AppButton label="View Statistics" onPress={() => navigation.navigate('Statistics')} />
      </View>
    </View>
  );
};

const StatisticsScreen: React.FC<StatisticsProps> = ({ navigation }) => {
  const { statistics, setStatistics } = useStatistics();

  return (
    <View style={styles.screen}>
      <FlatList
        data={STAT_KEYS.map(n => ({ n, count: statistics[n] }))}
        keyExtractor={item => String(item.n)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Text style={styles.statItem}>Number {item.n}: {item.count} times</Text>
        )}
      />
      <View style={styles.buttonRow}>
        <AppButton label="Clear Statistics" onPress={() => setStatistics(initialStats)} />
        <AppButton label="Back to Home" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

// ─── App ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <GestureHandlerRootView style={styles.root}>
    <StatisticsProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#7f5539' },
            headerTintColor: '#fff',
            headerTitleStyle: styles.headerTitle,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Random Number Generator' }}
          />
          <Stack.Screen
            name="Statistics"
            component={StatisticsScreen}
            options={{ title: 'Statistics' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </StatisticsProvider>
  </GestureHandlerRootView>
);

export default App;

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#b08968',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#7f5539',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 130,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  statItem: {
    color: '#fff',
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'center',
  },
});
