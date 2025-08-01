import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import MainTabNavigator from './navigation/MainTabNavigator';
import AuthStackNavigator from './navigation/AuthStackNavigator';
import { useAuth } from './context/AuthContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {currentUser ? (
          // User is signed in, show main app
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          // User is not signed in, show auth flow
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        )}
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
