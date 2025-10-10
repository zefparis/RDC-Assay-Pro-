import { useEffect, useState, useCallback } from 'react';

const THEME_KEY = 'rdc-theme';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  // Initialize from localStorage or system preference
  useEffect(() => {
    try {
      const saved = (typeof window !== 'undefined' && localStorage.getItem(THEME_KEY)) as Theme | null;
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light');
      setTheme(initial);
      const root = document.documentElement;
      if (initial === 'dark') root.classList.add('dark');
      else root.classList.remove('dark');
    } catch {}
  }, []);

  const set = useCallback((next: Theme) => {
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    const root = document.documentElement;
    if (next === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, []);

  const toggle = useCallback(() => set(theme === 'dark' ? 'light' : 'dark'), [theme, set]);

  return { theme, isDark: theme === 'dark', setTheme: set, toggleTheme: toggle };
}
