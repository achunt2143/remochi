// MochiThemeWrapper.jsx
import React, { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import './MochiThemeWrapper.scss';

const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
  colors: {}
});

const LATO_FONT_HREF = 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;500;600;700&display=swap';

// Loaded via a <link> tag rather than a CSS @import — see the comment atop
// MochiThemeWrapper.scss for why an @import there isn't reliable once
// Rollup bundles every component's styles into one file. Guarded so
// mounting multiple ThemeWrappers (or remounting one) doesn't inject the
// same stylesheet link repeatedly.
function ensureLatoFontLoaded() {
  if (document.querySelector(`link[href="${LATO_FONT_HREF}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = LATO_FONT_HREF;
  document.head.appendChild(link);
}

export const useTheme = () => useContext(ThemeContext);

const MochiThemeWrapper = ({
  children,
  defaultTheme = 'dark',
  fontFamily = 'Prelude',
  className = ''
}) => {
  const [theme, setTheme] = useState(defaultTheme);

  // Layout effect (not a plain effect) so this commits before the browser
  // paints — the --mochi-* color variables every component (including
  // ones portaled to document.body, like Dialog) reads are keyed off this
  // attribute, so a post-paint update here would flash unstyled content.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-mochi-theme', theme);
  }, [theme]);

  // Lato is a fallback in the default 'Prelude' font stack too (in case
  // the local system fonts it prefers aren't available), so this loads
  // unconditionally rather than only for fontFamily === 'Lato'.
  useEffect(() => {
    ensureLatoFontLoaded();
  }, []);

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
