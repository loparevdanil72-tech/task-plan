export type Frequency = 'daily' | 'weekly' | 'custom';

export interface Task {
  id: string;
  title: string;
  description?: string;
  emoji: string;
  frequency: Frequency;
  customDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  streak: number;
  maxStreak: number;
  freezeTokens: number; // 0–2, protects streak on missed day
  lastCompletedDate: string | null; // ISO date string YYYY-MM-DD
  completionHistory: string[]; // ISO date strings
  createdAt: string; // ISO
  isArchived: boolean;
}

export interface AppSettings {
  theme: 'auto' | 'light' | 'dark';
  language: 'ru' | 'en';
}

export type StreakLevel = 'none' | 'low' | 'medium' | 'high';
