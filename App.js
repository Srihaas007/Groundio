import React from 'react';
import { Platform } from 'react-native';

// Import the appropriate app based on platform
let AppComponent;

if (Platform.OS === 'web') {
  // For web, use the React web app
  AppComponent = require('./web-app/src/App.jsx').default;
} else {
  // For mobile, use the React Native app
  AppComponent = require('./app/mobile/MobileApp').default;
}

export default function App() {
  return <AppComponent />;
}
