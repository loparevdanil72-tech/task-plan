import { useState, useCallback } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useT } from '../../utils/useT';
import { getNote, saveNote } from '../../utils/notesStorage';
import { useTasksStore } from '../../store/tasksStore';
import './Notes.css';

dayjs.extend(isoWeek);

const RU_MONTHS = [
  'января','февраля','марта','апреля','мая','июня',
  'июля','августа','сентября','октября','ноября','декабря',
];
const RU_DAYS_FULL = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
const EN_DAYS_FULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function formatDate(d: dayjs.Dayjs, lang: string): string {
  if (lang === 'ru') {
    return `${d.date()} ${RU_MONTHS[d.month()]} ${d.year()}`;
  }
  return d.format('MMMM D, YYYY');
}

function getDayName(d: dayjs.Dayjs, lang: string): string {
  return lang === 'ru' ? RU_DAYS_FULL[d.day()] : EN_DAYS_FULL[d.day()];
}

export function Notes() {
  const t = useT();
  const language = useTasksStore((s) => s.settings.language);
  const today = dayjs();
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = today.isoWeekday(1).add(weekOffset, 'week');
  const days = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  const [drafts, setDrafts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    const ws = today.isoWeekday(1);
    for (let i = 0; i < 7; i++) {
      const d = ws.add(i, 'day').format('YYYY-MM-DD');
      init[d] = getNote(d);
    }
    return init;
  });

  const handleChange = useCallback((date: string, value: string) => {
    setDrafts((prev) => ({ ...prev, [date]: value }));
    saveNote(date, value);
  }, []);

  const todayStr = today.format('YYYY-MM-DD');

  const weekLabel = language === 'ru'
    ? `${weekStart.date()} ${RU_MONTHS[weekStart.month()]} — ${weekStart.add(6, 'day').date()} ${RU_MONTHS[weekStart.add(6, 'day').month()]} ${weekStart.add(6, 'day').year()}`
    : `${weekStart.format('MMM D')} – ${weekStart.add(6, 'day').format('MMM D, YYYY')}`;

  return (
    <div className="page notes-page">
      <div className="notes-header">
        <h1 className="notes-title">{t.notes}</h1>
        <div className="notes-week-nav">
          <button className="notes-nav-btn" onClick={() => setWeekOffset((o) => o - 1)}>‹</button>
          <span className="notes-week-label">{weekLabel}</span>
          <button className="notes-nav-btn" onClick={() => setWeekOffset((o) => o + 1)}>›</button>
        </div>
      </div>

      <div className="notes-list">
        {days.map((day) => {
          const dateStr = day.format('YYYY-MM-DD');
          const isToday = dateStr === todayStr;
          const note = drafts[dateStr] ?? getNote(dateStr);
          return (
            <div key={dateStr} className={`notes-card card ${isToday ? 'notes-card--today' : ''}`}>
              <div className="notes-card__header">
                <span className="notes-card__day">{getDayName(day, language)}</span>
                <span className="notes-card__date">{formatDate(day, language)}</span>
                {isToday && <span className="notes-card__today-badge">{t.notesToday}</span>}
              </div>
              <textarea
                className="notes-textarea"
                placeholder={t.notesPlaceholder}
                value={note}
                onChange={(e) => handleChange(dateStr, e.target.value)}
                rows={3}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
