//navigation/TopTabs.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorScheme } from '../hooks/useColorScheme';
import { Colors } from '../constants/Colors';
import WelcomeScreen from '../app/screens/customers/WelcomeScreen';
import ProfileScreen from '../app/screens/customers/ProfileScreen';
import SettingsScreen from '../app/screens/customers/SettingsScreen';
import { TabBarIcon } from '../components/navigation/TabBarIcon';

const TopTab = createMaterialTopTabNavigator();

export default function TopTabs() {
    const colorScheme = useColorScheme();

    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                swipeEnabled: true,
                tabBarIconStyle: { display: 'none' },
                tabBarLabelStyle: { fontSize: 12 },
                tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].background },
            }}
        >
            <TopTab.Screen
                name="Welcome"
                component={WelcomeScreen}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                    title: 'Welcome'
                }}
            />
            <TopTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
            <TopTab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: 'Settings' }}
            />
        </TopTab.Navigator>
    );
}
