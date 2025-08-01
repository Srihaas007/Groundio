// navigation/AuthStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../app/screens/auth/LoginScreen';
import SignupScreen from '../app/screens/auth/SignupScreen';
import ForgotPasswordScreen from '../app/screens/customers/ForgotPasswordScreen';

const Stack = createStackNavigator();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f8f9fa' },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />
    </Stack.Navigator>
  );
}
