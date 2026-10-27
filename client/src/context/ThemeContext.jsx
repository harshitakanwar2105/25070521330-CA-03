import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Default dark mode true rakhte hain kyunki FLEXI Garage ka primary aesthetic dark hai
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('flexi_theme');
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('flexi_theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);