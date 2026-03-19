import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const App: React.FC = () => (
  <View style={styles.container}>
    <Text>Assignment 2</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
