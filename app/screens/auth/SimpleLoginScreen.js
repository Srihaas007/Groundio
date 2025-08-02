// app/screens/auth/SimpleLoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleLoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simple Login Screen</Text>
      <Text style={styles.subtitle}>This is a test screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default SimpleLoginScreen;
