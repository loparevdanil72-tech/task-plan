import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Task, AppSettings } from '../types/task';
import { storage } from '../utils/storage';
import { checkAndResetStreaks, isCompletedToday, isDueToday } from '../utils/streak';
import { today } from '../utils/dateUtils';
import { syncNotificationStatus } from '../utils/notifications';

interface TasksState {
  tasks: Task[];
  settings: AppSettings;
  lastResetDate: string;
  isReady: boolean;
  // Actions
  initialize: () => void;
  addTask: (data: Omit<Task, 'id' | 'streak' | 'maxStreak' | 'freezeTokens' | 'lastCompletedDate' | 'completionHistory' | 'createdAt' | 'isArchived'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  archiveTask: (id: string) => void;
  restoreTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  runStreakReset: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  settings: { theme: 'auto', language: 'ru' },
  lastResetDate: '',
  isReady: false,

  initialize: () => {
    const tasks = storage.getTasks();
    const settings = storage.getSettings();
    const lastResetDate = storage.getLastResetDate();
    const todayStr = today();

    // Migrate existing tasks that don't have freezeTokens yet
    const migratedTasks = tasks.map((t) =>
      t.freezeTokens === undefined ? { ...t, freezeTokens: 2 } : t
    );

    // Reset streaks if date changed
    let updatedTasks = migratedTasks;
    if (lastResetDate && lastResetDate !== todayStr) {
      updatedTasks = checkAndResetStreaks(migratedTasks, lastResetDate);
      storage.saveTasks(updatedTasks);
    }
    storage.saveLastResetDate(todayStr);

    set({ tasks: updatedTasks, settings, lastResetDate: todayStr, isReady: true });
  },

  addTask: (data: Omit<Task, 'id' | 'streak' | 'maxStreak' | 'freezeTokens' | 'lastCompletedDate' | 'completionHistory' | 'createdAt' | 'isArchived'>) => {
    const task: Task = {
      ...data,
      id: uuidv4(),
      streak: 0,
      maxStreak: 0,
      freezeTokens: 2,
      lastCompletedDate: null,
      completionHistory: [],
      createdAt: new Date().toISOString(),
      isArchived: false,
    };
    const tasks = [task, ...get().tasks];
    storage.saveTasks(tasks);
    set({ tasks });
  },

  updateTask: (id, data) => {
    const tasks = get().tasks.map((t) => (t.id === id ? { ...t, ...data } : t));
    storage.saveTasks(tasks);
    set({ tasks });
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id);
    storage.saveTasks(tasks);
    set({ tasks });
  },

  archiveTask: (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, isArchived: true } : t
    );
    storage.saveTasks(tasks);
    set({ tasks });
  },

  restoreTask: (id) => {
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, isArchived: false } : t
    );
    storage.saveTasks(tasks);
    set({ tasks });
  },

  toggleComplete: (id) => {
    const todayStr = today();
    const tasks = get().tasks.map((t) => {
      if (t.id !== id) return t;
      const alreadyDone = isCompletedToday(t);
      if (alreadyDone) {
        // Undo completion
        const history = t.completionHistory.filter((d) => d !== todayStr);
        const newStreak = Math.max(0, t.streak - 1);
        return {
          ...t,
          completionHistory: history,
          lastCompletedDate: history.length > 0 ? history[history.length - 1] : null,
          streak: newStreak,
          maxStreak: t.maxStreak,
        };
      } else {
        // Complete
        const history = [...t.completionHistory, todayStr];
        const newStreak = t.streak + 1;
        // Award a freeze token every 7-day milestone (up to max 2)
        const earnedToken = newStreak % 7 === 0 && (t.freezeTokens ?? 0) < 2;
        return {
          ...t,
          completionHistory: history,
          lastCompletedDate: todayStr,
          streak: newStreak,
          maxStreak: Math.max(t.maxStreak, newStreak),
          freezeTokens: earnedToken ? Math.min(2, (t.freezeTokens ?? 0) + 1) : (t.freezeTokens ?? 2),
        };
      }
    });
    storage.saveTasks(tasks);
    set({ tasks });

    // Sync completion status to notification backend
    const active = tasks.filter((t) => !t.isArchived);
    const due = active.filter(isDueToday);
    const done = due.filter(isCompletedToday);
    syncNotificationStatus(due.length > 0 && done.length === due.length);
  },

  updateSettings: (s) => {
    const settings = { ...get().settings, ...s };
    storage.saveSettings(settings);
    set({ settings });
  },

  runStreakReset: () => {
    const todayStr = today();
    const { tasks, lastResetDate } = get();
    if (lastResetDate === todayStr) return;
    const updated = checkAndResetStreaks(tasks, lastResetDate || todayStr);
    storage.saveTasks(updated);
    storage.saveLastResetDate(todayStr);
    set({ tasks: updated, lastResetDate: todayStr });
  },
}));
