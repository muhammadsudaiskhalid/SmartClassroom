import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const session = await authService.getCurrentSession();
      setCurrentUser(session);
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

  const signUp = async (userData) => {
    const user = await authService.signUp(userData);
    await authService.saveSession(user);
    setCurrentUser(user);
    return user;
  };

  const signOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
  };

  const updateProfile = async (updates) => {
    if (!currentUser) throw new Error('No user logged in');
    const updatedUser = await authService.updateProfile(
      currentUser.registrationNumber,
      updates
    );
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
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