// MochiThemeWrapper.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import './MochiThemeWrapper.scss';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  colors: {}
});

export const useTheme = () => useContext(ThemeContext);

const MochiThemeWrapper = ({
  children,
  defaultTheme = 'dark',
  fontFamily = 'Prelude',
  className = ''
}) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-mochi-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const colors = {
    primary: theme === 'dark' ? '#5b9dd9' : '#4a8bc2',
    secondary: theme === 'dark' ? '#7ab8e8' : '#3a7bb2',
    background: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
    surface: theme === 'dark' ? '#2a2a2a' : '#ffffff',
    text: theme === 'dark' ? '#ffffff' : '#1a1a1a',
    textSecondary: theme === 'dark' ? '#999999' : '#666666',
    border: theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3'
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      <div 
        className={`mochi-theme-wrapper mochi-theme-${theme} ${className}`}
        data-font-family={fontFamily}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default MochiThemeWrapper;
