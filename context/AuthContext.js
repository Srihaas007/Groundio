// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmail, 
  signInWithGoogle, 
  signUpWithEmail, 
  signOutUser, 
  resetPassword,
  onAuthStateChange,
  createUserDocument
} from '../services/firebase';

// Define the context with a default value
const AuthContext = createContext({
  currentUser: null,
  isLoggedIn: false,
  loading: true,
  signInWithEmail: async (email, password) => {},
  signInWithGoogle: async () => {},
  signUpWithEmail: async (email, password) => {},
  signOut: async () => {},
  resetPassword: async (email) => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe; // Cleanup subscription
  }, []);

  // Enhanced sign up function with user document creation
  const handleSignUpWithEmail = async (email, password, additionalData = {}) => {
    try {
      const result = await signUpWithEmail(email, password, additionalData.displayName);
      
      if (result.success && result.user) {
        // Create user document in Firestore
        await createUserDocument(result.user, additionalData);
      }
      
      return result;
    } catch (error) {
      console.error('SignUp error in AuthContext:', error);
      return { success: false, error: error.message };
    }
  };

  const value = { 
    currentUser, 
    isLoggedIn: !!currentUser, 
    loading,
    signInWithEmail,
    signInWithGoogle,
    signUpWithEmail: handleSignUpWithEmail,
    signOut: signOutUser,
    resetPassword,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

