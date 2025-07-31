// services/googleAuth.js
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

// For web platform Google Sign-In
export const googleAuthConfig = {
  webClientId: '220145387035-your-web-client-id.apps.googleusercontent.com', // Replace with actual web client ID
  androidClientId: '220145387035-your-android-client-id.apps.googleusercontent.com', // Replace with actual Android client ID
  iosClientId: '220145387035-your-ios-client-id.apps.googleusercontent.com', // Replace with actual iOS client ID
};

// Complete OAuth URL manually for Expo managed workflow
const createGoogleAuthUrl = async () => {
  const redirectUri = WebBrowser.maybeCompleteAuthSession();
  const state = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    Math.random().toString(),
    { encoding: Crypto.CryptoEncoding.BASE64URL }
  );
  
  const params = {
    response_type: 'code',
    client_id: googleAuthConfig.webClientId,
    redirect_uri: `${redirectUri}`,
    scope: 'openid profile email',
    state,
  };

  const paramString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return {
    url: `https://accounts.google.com/oauth/authorize?${paramString}`,
    state,
  };
};

// Google Sign-In for Expo managed workflow
export const signInWithGoogleAsync = async () => {
  try {
    if (Platform.OS === 'web') {
      // For web, use Firebase's built-in popup
      return { type: 'cancel', error: 'Use Firebase popup for web' };
    }

    const { url, state } = await createGoogleAuthUrl();
    
    const result = await WebBrowser.openAuthSessionAsync(url, null);

    if (result.type === 'success') {
      // Extract authorization code from URL
      const urlParams = new URLSearchParams(result.url.split('?')[1]);
      const code = urlParams.get('code');
      const returnedState = urlParams.get('state');

      if (returnedState !== state) {
        throw new Error('State mismatch - potential security issue');
      }

      return {
        type: 'success',
        code,
      };
    }

    return result;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    return {
      type: 'error',
      error: error.message,
    };
  }
};

// For bare React Native workflow (if needed in future)
export const initializeGoogleSignIn = () => {
  // This would be used with @react-native-google-signin/google-signin
  // in a bare workflow, but for Expo managed workflow we use WebBrowser
  console.log('Google Sign-In initialized for Expo managed workflow');
};
