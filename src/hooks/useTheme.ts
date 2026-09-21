'use client';

import { useCallback, useEffect, useState } from 'react';

export function applyTheme(dark: boolean) {
  const root = document.documentElement;
  if (dark) {
    root.classList.add('dark-theme');
    try {
      localStorage.setItem('theme', 'dark');
    } catch {}
  } else {
    root.classList.remove('dark-theme');
    try {
      localStorage.setItem('theme', 'light');
    } catch {}
  }
}

export function useTheme() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let initial = false;
    try {
      const saved = localStorage.getItem('theme');
      initial =
        saved === 'dark' ||
        (!saved && window.matchMedia?.('(prefers-color-scheme: dark)').matches) ||
        document.documentElement.classList.contains('dark-theme');
    } catch {
      initial = document.documentElement.classList.contains('dark-theme');
    }
    setIsDark(initial);
    applyTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    setIsDark((prev) => {
      applyTheme(!prev);
      return !prev;
    });
  }, []);

  return { isDark, mounted, toggle };
}
