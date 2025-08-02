// services/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  initializeAuth, 
  browserLocalPersistence, 
  getReactNativePersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { Platform } from 'react-native';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRHBnbO7-Mmc3eyGZ6pXvMvTQSTf8YQ-w",
  authDomain: "groundio-79307.firebaseapp.com",
  databaseURL: "https://groundio-79307-default-rtdb.firebaseio.com",
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

try {
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
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (error) {
      // If auth is already initialized, get the existing instance
      auth = getAuth(app);
    }
  }
} catch (error) {
  console.error('Error initializing Firebase Auth:', error);
  // Fallback to default auth
  auth = getAuth(app);
}

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Auth helper functions
export const authHelpers = {
  // Sign in with email and password
  signInWithEmail: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: getAuthErrorMessage(error) };
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email, password, profileData) => {
    try {
      console.log('Attempting signup with email:', email);
      console.log('Auth object available:', !!auth);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential.user.uid);
      
      // Update display name
      if (profileData && profileData.displayName) {
        await updateProfile(userCredential.user, { displayName: profileData.displayName });
        console.log('Display name updated:', profileData.displayName);
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign up error details:', {
        code: error.code,
        message: error.message,
        customData: error.customData,
        stack: error.stack
      });
      return { success: false, error: getAuthErrorMessage(error) };
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      if (Platform.OS === 'web') {
        const result = await signInWithPopup(auth, googleProvider);
        return { success: true, user: result.user };
      } else {
        // For mobile platforms, you would use Google Sign-In SDK
        // This is a placeholder for mobile implementation
        throw new Error('Google Sign-In not configured for mobile platforms');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: getAuthErrorMessage(error) };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: getAuthErrorMessage(error) };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: getAuthErrorMessage(error) };
    }
  },

  // Auth state observer
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  }
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-up is not enabled. Please contact support.';
    case 'auth/invalid-api-key':
      return 'Invalid API key. Please check Firebase configuration.';
    case 'auth/app-deleted':
      return 'Firebase app has been deleted. Please check configuration.';
    case 'auth/domain-mismatch':
      return 'Domain not authorized. Please check Firebase settings.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for OAuth operations.';
    default:
      console.error('Unhandled Firebase Auth error:', error.code, error.message);
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

export { auth, firestore as db, storage, googleProvider };
