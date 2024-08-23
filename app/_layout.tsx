import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';  // Correct import
import 'react-native-reanimated';
import Background from '../components/Background';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '../hooks/useColorScheme';

import LoginScreen from './LoginScreen'; // Ensure path is correct
import SignUpScreen from './SignUpScreen'; // Ensure path is correct
import WelcomeScreen from './screens/customers/WelcomeScreen'; // Ensure path is correct
import ForgotPasswordScreen from './ForgotPasswordScreen'; // Ensure path is correct
import TermsScreen from './TermsScreen'; // Add path if you have a Terms screen
import CustomLoadingSpinner from '../components/CustomLoadingSpinner'; // Ensure this path is correct

const Stack = createStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    async function hideSplashScreen() {
      if (loaded) {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          console.warn('Error hiding splash screen:', error);
        }
      }
    }

    hideSplashScreen();
  }, [loaded]);

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
          </Stack.Navigator>
          {!loaded && (
            <View style={styles.spinnerOverlay}>
              <CustomLoadingSpinner />
            </View>
          )}
        </View>
      </Background>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  spinnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background to overlay the spinner
  },
});
