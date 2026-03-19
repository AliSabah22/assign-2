import React, { createContext, useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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

// ─── Context ─────────────────────────────────────────────────────────────────

const initialStats: Stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

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

// ─── Navigator ───────────────────────────────────────────────────────────────

const Stack = createStackNavigator<RootStackParamList>();

// ─── Screens ─────────────────────────────────────────────────────────────────

const HomeScreen: React.FC = () => (
  <View>
    <Text>Home</Text>
  </View>
);

const StatisticsScreen: React.FC = () => (
  <View>
    <Text>Statistics</Text>
  </View>
);

// ─── App ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <StatisticsProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </StatisticsProvider>
  </GestureHandlerRootView>
);

export default App;
