import type { AppSettings } from '../types/task';

const themes = {
  dark: {
    '--tg-theme-bg-color': '#1C1A20',
    '--tg-theme-secondary-bg-color': '#2A2730',
    '--tg-theme-text-color': '#F0ECF5',
    '--tg-theme-hint-color': '#8A8494',
    '--tg-theme-link-color': '#C4395A',
    '--tg-theme-button-color': '#8B1A3A',
    '--tg-theme-button-text-color': '#FFFFFF',
    '--accent': '#8B1A3A',
    '--danger': '#E53935',
    '--success': '#4CAF50',
  },
  light: {
    '--tg-theme-bg-color': '#FAF7F9',
    '--tg-theme-secondary-bg-color': '#EDE8ED',
    '--tg-theme-text-color': '#1C1A20',
    '--tg-theme-hint-color': '#7A7080',
    '--tg-theme-link-color': '#8B1A3A',
    '--tg-theme-button-color': '#8B1A3A',
    '--tg-theme-button-text-color': '#FFFFFF',
    '--accent': '#8B1A3A',
    '--danger': '#E53935',
    '--success': '#388E3C',
  },
};

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme: AppSettings['theme']) {
  const resolved = theme === 'auto' ? getSystemTheme() : theme;
  const vars = themes[resolved];
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  root.setAttribute('data-theme', resolved);
}

export function initThemeListener(getTheme: () => AppSettings['theme']) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', () => {
    if (getTheme() === 'auto') applyTheme('auto');
  });
}
