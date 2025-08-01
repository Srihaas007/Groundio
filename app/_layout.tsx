import React from 'react';
import { Slot, useRouter, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

function AppNavigator() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Don't do anything while loading

    const isAuthRoute = pathname.includes('/auth/');
    
    if (!currentUser && !isAuthRoute) {
      // User is not signed in and not on auth route, redirect to login
      router.replace('/screens/auth/LoginScreen');
    } else if (currentUser && isAuthRoute) {
      // User is signed in and on auth route, redirect to main app
      router.replace('/screens/customers/HomeScreen');
    }
  }, [currentUser, loading, pathname]);

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <>
      <StatusBar style="auto" />
      <Slot />
    </>
  );
}

// This is the entry point for Expo Router
export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
