import { useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      setLoading(true);
      const session = await authService.getCurrentSession();
      setCurrentUser(session);
    } catch (err) {
      console.error('Load session error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (registrationNumber, password) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.signIn(registrationNumber, password);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.signUp(userData);
      await authService.saveSession(user);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setCurrentUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      if (!currentUser) throw new Error('No user logged in');
      
      const updatedUser = await authService.updateProfile(
        currentUser.registrationNumber,
        updates
      );
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!currentUser
  };
};