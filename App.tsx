import React, { createContext, useContext, useState } from 'react';
import { View, Text } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

type StatKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Stats = Record<StatKey, number>;

interface StatisticsContextValue {
  statistics: Stats;
  setStatistics: React.Dispatch<React.SetStateAction<Stats>>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const initialStats: Stats = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

const StatisticsContext = createContext<StatisticsContextValue | undefined>(undefined);

export const StatisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statistics, setStatistics] = useState<Stats>(initialStats);
  return (
    <StatisticsContext.Provider value={{ statistics, setStatistics }}>
      {children}
    </StatisticsContext.Provider>
  );
};

export const useStatistics = (): StatisticsContextValue => {
  const ctx = useContext(StatisticsContext);
  if (!ctx) throw new Error('useStatistics must be used within StatisticsProvider');
  return ctx;
};

// ─── App ─────────────────────────────────────────────────────────────────────

const App: React.FC = () => (
  <StatisticsProvider>
    <View>
      <Text>App</Text>
    </View>
  </StatisticsProvider>
);

export default App;
