// MochiThemeWrapper.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
// Fonts (Prelude, falling back to the bundled Lato) are declared in this
// stylesheet — nothing is fetched from a font CDN at runtime.
import './MochiThemeWrapper.scss';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'dark';
}

function getInitialTheme(storageKey, defaultTheme) {
  if (storageKey && typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === 'dark' || stored === 'light' || stored === 'system') {
        return stored;
      }
    } catch {
      // Ignore localStorage access errors (e.g. sandboxed iframes)
    }
  }
  return defaultTheme;
}

export const DARK_THEME_COLORS = {
  primary: '#5ab8f5',
  primaryHover: '#6ba5db',
  primaryActive: '#4a8bc2',
  secondary: '#7ab8e8',
  secondaryHover: '#8ac2ed',
  secondaryActive: '#6aaedb',
  background: '#1a1a1a',
  surface: '#2a2a2a',
  surfaceElevated: '#333333',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  textMuted: '#666666',
  border: '#646464',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#ef5350',
  info: '#2196f3',
  selected: '#ffb80d',
  selectedSoft: 'rgba(255, 184, 13, 0.35)',
  toggleTrack: '#646464',
  toggleKnob: '#404040',
  mark: '#c4c4c4',
  panelBg: '#404040',
  panelBorder: '#333333',
  fieldBg: '#606060',
  fieldBorder: '#404040',
  fieldText: '#eeeeee',
  popupBorder: '#646464',
  accent: '#69cdff',
  sliderTrack: '#646464',
};

export const LIGHT_THEME_COLORS = {
  primary: '#4a8bc2',
  primaryHover: '#5b9dd9',
  primaryActive: '#3a7bb2',
  secondary: '#6aaedb',
  secondaryHover: '#7ab8e8',
  secondaryActive: '#5a9ecb',
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceElevated: '#fafafa',
  text: '#1a1a1a',
  textSecondary: '#555555',
  textMuted: '#888888',
  border: 'rgba(0, 0, 0, 0.12)',
  borderLight: 'rgba(0, 0, 0, 0.06)',
  success: '#388e3c',
  warning: '#e65100',
  error: '#c62828',
  info: '#1565c0',
  selected: '#ffb80d',
  selectedSoft: 'rgba(255, 184, 13, 0.35)',
  toggleTrack: '#646464',
  toggleKnob: '#ffffff',
  mark: '#ffffff',
  panelBg: '#f5f5f5',
  panelBorder: '#666666',
  fieldBg: '#ffffff',
  fieldBorder: 'rgba(0, 0, 0, 0.12)',
  fieldText: '#1a1a1a',
  popupBorder: '#646464',
  accent: '#69cdff',
  sliderTrack: '#a2a2a2',
};

export const ThemeContext = createContext({
  theme: 'dark',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: true,
  isLight: false,
  colors: DARK_THEME_COLORS,
  _isThemeContext: false,
});

export const useTheme = () => useContext(ThemeContext);

const MochiThemeWrapper = ({
  children,
  theme: controlledTheme,
  defaultTheme,
  onThemeChange,
  storageKey = null,
  syncHtml,
  fontFamily = 'Prelude',
  className = '',
  ...rest
}) => {
  const parentTheme = useContext(ThemeContext);
  const isNested = parentTheme && parentTheme._isThemeContext;

  // By default, sync <html> data-mochi-theme attribute only on the root wrapper
  // so nested wrappers can style subtrees locally without clobbering the root document.
  const shouldSyncHtml = syncHtml !== undefined ? syncHtml : !isNested;

  // Controlled vs uncontrolled theme state. Uncontrolled state stays
  // undefined until something picks a theme (a stored choice, an explicit
  // defaultTheme, or setTheme/toggleTheme); until then a nested wrapper
  // follows its parent live, and a root wrapper falls back to dark.
  const isControlled = controlledTheme !== undefined;
  const [uncontrolledTheme, setUncontrolledTheme] = useState(() =>
    getInitialTheme(storageKey, defaultTheme)
  );

  const activeTheme = isControlled
    ? controlledTheme
    : uncontrolledTheme ?? (isNested ? parentTheme.theme : undefined) ?? 'dark';

  // Track system preference dynamically if activeTheme is 'system'
  const [systemPreference, setSystemPreference] = useState(getSystemTheme);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => setSystemPreference(e.matches ? 'dark' : 'light');
    if (mq.addEventListener) {
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    } else if (mq.addListener) {
      mq.addListener(onChange);
      return () => mq.removeListener(onChange);
    }
  }, []);

  const resolvedTheme =
    activeTheme === 'system'
      ? systemPreference
      : activeTheme === 'light'
      ? 'light'
      : 'dark';

  // Synchronize document.documentElement attribute
  useIsomorphicLayoutEffect(() => {
    if (shouldSyncHtml && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-mochi-theme', resolvedTheme);
    }
  }, [shouldSyncHtml, resolvedTheme]);

  // Persist to localStorage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem(storageKey, activeTheme);
      } catch {
        // ignore storage errors
      }
    }
  }, [storageKey, activeTheme]);

  const setTheme = useCallback(
    (newTheme) => {
      if (!isControlled) {
        setUncontrolledTheme(newTheme);
      }
      const newResolved =
        newTheme === 'system'
          ? getSystemTheme()
          : newTheme === 'light'
          ? 'light'
          : 'dark';
      if (onThemeChange) {
        onThemeChange(newTheme, newResolved);
      }
    },
    [isControlled, onThemeChange]
  );

  const toggleTheme = useCallback(() => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  }, [resolvedTheme, setTheme]);

  const colors = resolvedTheme === 'dark' ? DARK_THEME_COLORS : LIGHT_THEME_COLORS;

  const contextValue = useMemo(
    () => ({
      theme: activeTheme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      isDark: resolvedTheme === 'dark',
      isLight: resolvedTheme === 'light',
      colors,
      _isThemeContext: true,
    }),
    [activeTheme, resolvedTheme, setTheme, toggleTheme, colors]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={`mochi-theme-wrapper ${shouldSyncHtml ? 'mochi-theme-wrapper--root ' : ''}mochi-theme-${resolvedTheme} ${className}`}
        data-mochi-theme={resolvedTheme}
        data-font-family={fontFamily}
        {...rest}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default MochiThemeWrapper;
