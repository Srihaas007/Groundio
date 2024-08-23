import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Basic AnimatedSplashScreen component
const AnimatedSplashScreen = ({ onAnimationFinish }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    async function hideSplash() {
      try {
        await SplashScreen.preventAutoHideAsync(); // Ensure the splash screen is not automatically hidden
        console.log('Splash screen displayed');
      } catch (error) {
        console.warn('Error preventing auto hide:', error);
      }
    }

    hideSplash();

    Animated.timing(animation, {
      toValue: 1,
      duration: 2000, // Shorter duration for testing
      useNativeDriver: true,
    }).start(() => {
      onAnimationFinish();
    });
  }, [animation, onAnimationFinish]);

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, { opacity }]}>
        <Text style={styles.text}>Groundio</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Ensure the background color matches your splash screen
  },
  animatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AnimatedSplashScreen;
