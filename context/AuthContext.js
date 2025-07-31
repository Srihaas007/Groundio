//context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authHelpers } from '../services/firebase';

// Define the context with a default value
const AuthContext = createContext({
  currentUser: null,
  isLoggedIn: false,
  loading: true,
  signIn: () => {},
  signOut: () => {},
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

  const signIn = async (user) => {
    setCurrentUser(user);
  };

  const signOut = async () => {
    try {
      await authHelpers.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = { 
    currentUser, 
    isLoggedIn: !!currentUser, 
    loading,
    signIn,
    signOut
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

