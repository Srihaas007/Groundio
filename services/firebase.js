// services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, browserLocalPersistence, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRHBnbO7-Mmc3eyGZ6pXvMvTQSTf8YQ-w",
  authDomain: "groundio-79307.firebaseapp.com",
  projectId: "groundio-79307",
  storageBucket: "groundio-79307.appspot.com",
  messagingSenderId: "220145387035",
  appId: "1:220145387035:web:70890ee940e9495c639abe",
  measurementId: "G-KDMJXN6RMB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const firestore = getFirestore(app);
const storage = getStorage(app);

let auth;

// Checking the environment to apply the correct Firebase auth persistence
if (Platform.OS === 'web') {
  // Web platform
  auth = getAuth(app);
  auth.setPersistence(browserLocalPersistence)
    .catch((error) => {
      console.error('Error setting web persistence:', error);
    });
} else {
  // React Native platform
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth, firestore as db, storage };
