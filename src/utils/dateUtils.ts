import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

export const today = (): string => dayjs().format('YYYY-MM-DD');

export const isSameDay = (a: string, b: string): boolean =>
  dayjs(a).isSame(dayjs(b), 'day');

export const isYesterday = (date: string): boolean =>
  dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');

export const isTodayDate = (date: string): boolean =>
  dayjs(date).isSame(dayjs(), 'day');

export const getWeekStart = (date?: string): string =>
  dayjs(date).isoWeekday(1).format('YYYY-MM-DD');

export const getDayOfWeek = (date?: string): number =>
  dayjs(date).day(); // 0=Sun, 1=Mon, ..., 6=Sat

export const formatDate = (date: string): string =>
  dayjs(date).format('D MMM YYYY');

export const daysBetween = (a: string, b: string): number =>
  Math.abs(dayjs(b).diff(dayjs(a), 'day'));
