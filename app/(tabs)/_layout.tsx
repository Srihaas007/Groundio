import React, { useContext } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import HomeScreen from '../screens/customers/HomeScreen';
import SearchScreen from '../screens/customers/SearchScreen';
import BookingsScreen from '../screens/customers/BookingsScreen';
import ProfileScreen from '../screens/customers/ProfileScreen';
import LoginScreen from '../screens/customers/LoginScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { currentUser } = useAuth();

  // If user is not logged in, show login screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 30 : 8,
          height: Platform.OS === 'ios' ? 88 : 65,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsScreen}
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <TabNavigator />
    </AuthProvider>
  );
}
