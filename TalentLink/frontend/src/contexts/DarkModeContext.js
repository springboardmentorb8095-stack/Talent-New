import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Target only background color override - preserve other colors
  useEffect(() => {
    // Force light mode background only
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === null) {
      // Default to light mode background
      setDarkMode(false);
      document.body.style.backgroundColor = '#f9fafb';
    }
    
    // Block system theme changes for background only
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e) => {
      // Only override background color, preserve other colors
      if (!darkMode) {
        document.body.style.backgroundColor = '#f9fafb';
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [darkMode]);

  // Load user preference for background only
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      setDarkMode(isDark);
      
      // Only apply background color, let other colors work normally
      document.documentElement.classList.toggle('dark', isDark);
      document.body.style.backgroundColor = isDark ? '#0f172a' : '#f9fafb';
    }
  }, []);

  // Handle dark mode toggle - only background color
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Only toggle background color, preserve other colors
    document.documentElement.classList.toggle('dark', newDarkMode);
    document.body.style.backgroundColor = newDarkMode ? '#0f172a' : '#f9fafb';
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};