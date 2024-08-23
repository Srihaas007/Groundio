//context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';  // Adjust this import according to your setup

// Define the context with a default value
const AuthContext = createContext({
  currentUser: null,
  isLoggedIn: false,
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setCurrentUser);
    return unsubscribe; // Cleanup subscription
  }, []);

  const value = { currentUser, isLoggedIn: !!currentUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;

