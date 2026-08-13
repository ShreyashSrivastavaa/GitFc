import React, { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Check saved preference or system theme
    const saved = localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initial = (saved as 'light' | 'dark') || system;
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
    if (initial === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
    if (next === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-9 h-9 rounded-full border border-slate-700 dark:border-slate-700 light-border bg-slate-900/80 hover:bg-slate-800 text-amber-400 flex items-center justify-center text-lg shadow transition-all duration-200 hover:scale-105 active:scale-95"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
