import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/api-auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      // First try to get from localStorage (fast check)
      const user = authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        // Verify session in background
        authService.getCurrentSession().then(verifiedUser => {
          if (verifiedUser) {
            setCurrentUser(verifiedUser);
          }
        }).catch(() => {
          // Session invalid, clear it
          authService.signOut();
          setCurrentUser(null);
        });
      }
    } catch (error) {
      console.error('Load session error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (registrationNumber, password) => {
    const user = await authService.signIn(registrationNumber, password);
    setCurrentUser(user);
    return user;
  };

  const signOut = async () => {
    authService.signOut();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signOut,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};