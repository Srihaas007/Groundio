import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView, Platform, View } from 'react-native';

const Background = ({ children }) => {
  return (
    <View style={styles.backgroundContainer}>
      {Platform.OS === 'web' ? (
        <View style={styles.webBackground}>
          <SafeAreaView style={styles.container}>{children}</SafeAreaView>
        </View>
      ) : (
        <ImageBackground
          source={require('../assets/images/background.jpg')}
          style={styles.background}
          resizeMode="cover" // Ensures the image covers the whole area
        >
          <SafeAreaView style={styles.container}>{children}</SafeAreaView>
        </ImageBackground>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    ...StyleSheet.absoluteFillObject, // Ensures the container fills the entire screen
  },
  webBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundImage: "url('../assets/images/background.jpg')", // Use correct path for web
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    ...StyleSheet.absoluteFillObject, // Ensures the view covers the full screen
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    ...StyleSheet.absoluteFillObject, // Ensures the view covers the full screen
  },
  container: {
    flex: 1,
  },
});

export default Background;
