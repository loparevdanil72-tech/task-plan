import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { Task, StreakLevel } from '../types/task';
import { today, getWeekStart, getDayOfWeek } from './dateUtils';

dayjs.extend(isoWeek);

/**
 * Returns true if the task streak should be reset for the given "previous date"
 * (the date from which we are checking, i.e. lastResetDate).
 */
export function shouldResetStreak(task: Task, previousDate: string): boolean {
  if (task.streak === 0) return false;

  const prev = dayjs(previousDate);
  const now = dayjs(today());

  if (task.frequency === 'daily') {
    // Must have completed on previousDate
    return !task.completionHistory.includes(previousDate);
  }

  if (task.frequency === 'weekly') {
    // Must have completed at least once during the week of previousDate
    const weekStart = dayjs(getWeekStart(previousDate));
    const weekEnd = weekStart.add(6, 'day');
    // Only reset if a full week has passed and nothing was completed
    if (now.isAfter(weekEnd)) {
      const completedInWeek = task.completionHistory.some((d) => {
        const dd = dayjs(d);
        return dd.isSame(weekStart, 'day') || (dd.isAfter(weekStart) && dd.isBefore(weekEnd.add(1, 'day')));
      });
      return !completedInWeek;
    }
    return false;
  }

  if (task.frequency === 'custom') {
    // For each missed scheduled day between previousDate and today, reset
    const daysBetween = now.diff(prev, 'day');
    for (let i = 1; i <= daysBetween; i++) {
      const checkDate = prev.add(i - 1, 'day');
      const dow = checkDate.day();
      if (task.customDays.includes(dow)) {
        const dateStr = checkDate.format('YYYY-MM-DD');
        if (!task.completionHistory.includes(dateStr)) {
          return true;
        }
      }
    }
    return false;
  }

  return false;
}

/**
 * Check all tasks and reset streaks for missed periods.
 * Returns updated tasks array.
 */
export function checkAndResetStreaks(tasks: Task[], lastResetDate: string): Task[] {
  const todayStr = today();
  if (lastResetDate === todayStr) return tasks;

  return tasks.map((task) => {
    if (task.isArchived) return task;
    if (shouldResetStreak(task, lastResetDate)) {
      const tokens = task.freezeTokens ?? 0;
      if (tokens > 0) {
        // Freeze token absorbs the miss — streak survives
        return { ...task, freezeTokens: tokens - 1 };
      }
      return { ...task, streak: 0 };
    }
    return task;
  });
}

/**
 * Get the current streak level for visual display.
 */
export function getStreakLevel(streak: number): StreakLevel {
  if (streak === 0) return 'none';
  if (streak < 7) return 'low';
  if (streak < 30) return 'medium';
  return 'high';
}

/**
 * Get completion rate for last N days.
 */
export function getCompletionRate(task: Task, days: number): number {
  const todayStr = today();
  let scheduled = 0;
  let completed = 0;

  for (let i = 0; i < days; i++) {
    const date = dayjs(todayStr).subtract(i, 'day');
    const dateStr = date.format('YYYY-MM-DD');
    const dow = date.day();

    let isScheduled = false;
    if (task.frequency === 'daily') isScheduled = true;
    else if (task.frequency === 'weekly') isScheduled = dow === 1; // Monday
    else if (task.frequency === 'custom') isScheduled = task.customDays.includes(dow);

    if (isScheduled) {
      scheduled++;
      if (task.completionHistory.includes(dateStr)) completed++;
    }
  }

  return scheduled === 0 ? 0 : Math.round((completed / scheduled) * 100);
}

/**
 * Check if task is due today.
 */
export function isDueToday(task: Task): boolean {
  if (task.isArchived) return false;
  const dow = getDayOfWeek();
  if (task.frequency === 'daily') return true;
  if (task.frequency === 'weekly') return dow === 1;
  if (task.frequency === 'custom') return task.customDays.includes(dow);
  return false;
}

/**
 * Check if task is completed today.
 */
export function isCompletedToday(task: Task): boolean {
  return task.completionHistory.includes(today());
}
