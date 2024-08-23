import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function CustomLoadingSpinner() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/loadingspinner.json')} // Ensure this path is correct
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
