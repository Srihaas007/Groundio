import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';

// Basic AnimatedSplashScreen component for Web
const WebSplashScreen = ({ onAnimationFinish }) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 2000, // Duration of animation
      useNativeDriver: true,
    }).start(() => {
      if (onAnimationFinish) {
        onAnimationFinish(); // Ensure this is called
      }
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
    ...StyleSheet.absoluteFillObject, // Ensure the container fills the entire viewport
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Background color to match splash screen
  },
  animatedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
  },
});

export default WebSplashScreen;
