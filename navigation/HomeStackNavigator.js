// navigation/HomeStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../app/screens/customers/HomeScreen';
import VenueDetailsScreen from '../app/screens/customers/VenueDetailsScreen';
import Notification from '../app/screens/customers/Notification';

const Stack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="HomeStack" component={HomeScreen} />
      <Stack.Screen name="VenueDetails" component={VenueDetailsScreen} />
      <Stack.Screen name="Notification" component={Notification} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
