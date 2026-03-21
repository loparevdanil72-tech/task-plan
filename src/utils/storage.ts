import type { Task, AppSettings } from '../types/task';

const TASKS_KEY = 'tasks';
const SETTINGS_KEY = 'appSettings';
const LAST_RESET_KEY = 'lastResetDate';

export const storage = {
  getTasks: (): Task[] => {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },
  saveTasks: (tasks: Task[]): void => {
    try {
      const json = JSON.stringify(tasks);
      if (json.length > 4.5 * 1024 * 1024) {
        console.warn('localStorage approaching 5MB limit');
      }
      localStorage.setItem(TASKS_KEY, json);
    } catch (e) {
      console.error('Failed to save tasks', e);
    }
  },
  getSettings: (): AppSettings => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : { theme: 'auto', language: 'ru' };
    } catch {
      return { theme: 'auto', language: 'ru' };
    }
  },
  saveSettings: (settings: AppSettings): void => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },
  getLastResetDate: (): string => {
    return localStorage.getItem(LAST_RESET_KEY) || '';
  },
  saveLastResetDate: (date: string): void => {
    localStorage.setItem(LAST_RESET_KEY, date);
  },
};
