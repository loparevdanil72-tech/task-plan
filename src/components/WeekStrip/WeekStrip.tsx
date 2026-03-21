import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import './WeekStrip.css';

dayjs.extend(isoWeek);

interface Props {
  completedDates: Set<string>; // all completed dates across all tasks
  language: 'ru' | 'en';
}

const DAY_NAMES = {
  ru: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
};

export function WeekStrip({ completedDates, language }: Props) {
  const today = dayjs();
  // isoWeekday: 1=Mon ... 7=Sun
  const weekStart = today.isoWeekday(1); // Monday of current week

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = weekStart.add(i, 'day');
    const dateStr = day.format('YYYY-MM-DD');
    const isToday = day.isSame(today, 'day');
    const isPast = day.isBefore(today, 'day');
    const isFuture = day.isAfter(today, 'day');
    const done = completedDates.has(dateStr);
    return { dateStr, label: DAY_NAMES[language][i], isToday, isPast, isFuture, done };
  });

  return (
    <div className="week-strip card">
      {days.map((day) => (
        <div
          key={day.dateStr}
          className={`week-strip__day ${day.isToday ? 'week-strip__day--today' : ''} ${day.isFuture ? 'week-strip__day--future' : ''}`}
        >
          <span className="week-strip__label">{day.label}</span>
          <span className={`week-strip__flame ${day.done ? 'week-strip__flame--on' : ''} ${day.isToday && !day.done ? 'week-strip__flame--today-empty' : ''}`}>
            {day.done ? '🔥' : '·'}
          </span>
        </div>
      ))}
    </div>
  );
}
