import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const THEME_KEY = 'smart_classroom_theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      try {
        const { theme: savedThemeValue, fontSize: savedFontSize } = JSON.parse(savedTheme);
        setTheme(savedThemeValue || 'light');
        setFontSize(savedFontSize || 'medium');
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-font-size', fontSize);

    // Save to localStorage
    localStorage.setItem(THEME_KEY, JSON.stringify({ theme, fontSize }));
  }, [theme, fontSize]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = (mode) => {
    setTheme(mode);
  };

  const increaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'small') return 'medium';
      if (prev === 'medium') return 'large';
      return 'large';
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'large') return 'medium';
      if (prev === 'medium') return 'small';
      return 'small';
    });
  };

  const value = {
    theme,
    fontSize,
    toggleTheme,
    setThemeMode,
    increaseFontSize,
    decreaseFontSize,
    isDark: theme === 'dark'
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};