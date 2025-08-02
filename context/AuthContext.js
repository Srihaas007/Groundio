// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authHelpers } from '../services/firebase';

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
    const unsubscribe = authHelpers.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    
    return unsubscribe; // Cleanup subscription
  }, []);

  const value = { 
    currentUser, 
    isLoggedIn: !!currentUser, 
    loading,
    signInWithEmail: authHelpers.signInWithEmail,
    signInWithGoogle: authHelpers.signInWithGoogle,
    signUpWithEmail: authHelpers.signUpWithEmail,
    signOut: authHelpers.signOut,
    resetPassword: authHelpers.resetPassword,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

