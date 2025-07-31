import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

export default function CustomLoadingSpinner({ message = "Loading..." }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2E7D32" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});
