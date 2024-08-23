// app/tabs/_layout.tsx
import React, { useContext } from 'react';
import { Platform } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AuthContext from '../../context/AuthContext';
import TopTabs from '../../navigation/TopTabs';  // Make sure the path is correct

const Drawer = createDrawerNavigator();

export default function AppNavigation() {
    const { isLoggedIn } = useContext(AuthContext);

    if (!isLoggedIn) {
        return null; // Hide navigation if not logged in
    }

    // Use top tabs for web and desktop platforms, and a drawer for mobile platforms
    if (Platform.OS === 'web' || Platform.OS === 'windows' || Platform.OS === 'macos') {
        return <TopTabs />;
    } else {
        return (
            <Drawer.Navigator initialRouteName="Menu">
                <Drawer.Screen name="Menu" component={TopTabs} options={{ title: 'Menu' }} />
                {/* Additional screens can be added here if needed */}
            </Drawer.Navigator>
        );
    }
}
