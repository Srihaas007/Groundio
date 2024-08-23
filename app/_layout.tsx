import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import Background from '../components/Background';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '../hooks/useColorScheme';

import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import ProfileScreen from './screens/customers/ProfileScreen';
import WelcomeScreen from './screens/customers/WelcomeScreen';
import Notification from './screens/customers/Notification';
import EditProfileScreen from './screens/customers/EditProfileScreen';
import SettingsScreen from './screens/customers/SettingsScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import TermsScreen from './TermsScreen';
import CustomLoadingSpinner from '../components/CustomLoadingSpinner';
import AnimatedSplashScreen from '../components/AnimatedSplashScreen';
import WebSplashScreen from '../components/WebSplashScreen'; // Import the web splash screen component

const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isReady, setIsReady] = useState(false);
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync(); // Prevent auto-hide of splash screen

        if (fontsLoaded) {
          setTimeout(async () => {
            await SplashScreen.hideAsync(); // Hide splash screen after fonts loaded
            setIsReady(true);
          }, 2000); // Duration for splash screen
        }
      } catch (error) {
        console.warn('Error handling splash screen:', error);
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!isReady) {
    return (
      <View style={styles.container}>
        {Platform.OS === 'web' ? (
          <WebSplashScreen onAnimationFinish={() => setIsReady(true)} />
        ) : (
          <AnimatedSplashScreen onAnimationFinish={() => setIsReady(true)} />
        )}
        {/* Optionally, include CustomLoadingSpinner if needed */}
      </View>
    );
  }

  if (isSpinnerVisible) {
    return (
      <View style={styles.spinnerOverlay}>
        <CustomLoadingSpinner />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Background>
        <View style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="screens/customers/WelcomeScreen" component={WelcomeScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="TermsScreen" component={TermsScreen} />
            <Stack.Screen name="screens/customers/ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="screens/customers/Notification" component={Notification} />
            <Stack.Screen name="screens/customers/EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="screens/customers/SettingsScreen" component={SettingsScreen} />
          </Stack.Navigator>
        </View>
      </Background>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
