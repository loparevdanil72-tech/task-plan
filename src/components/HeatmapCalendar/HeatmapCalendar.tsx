import dayjs from 'dayjs';
import './HeatmapCalendar.css';

interface Props {
  completionHistory: string[];
  weeks?: number;
}

export function HeatmapCalendar({ completionHistory, weeks = 18 }: Props) {
  const set = new Set(completionHistory);
  const today = dayjs();
  const days: { date: string; completed: boolean; future: boolean }[] = [];

  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = today.subtract(i, 'day');
    const dateStr = d.format('YYYY-MM-DD');
    days.push({
      date: dateStr,
      completed: set.has(dateStr),
      future: d.isAfter(today),
    });
  }

  // Group into weeks
  const grid: typeof days[] = [];
  for (let i = 0; i < days.length; i += 7) {
    grid.push(days.slice(i, i + 7));
  }

  return (
    <div className="heatmap">
      <div className="heatmap__days-header">
        {['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'].map((d) => (
          <span key={d} className="heatmap__day-label">{d}</span>
        ))}
      </div>
      <div className="heatmap__grid">
        {grid.map((week, wi) => (
          <div key={wi} className="heatmap__week">
            {week.map((day) => (
              <div
                key={day.date}
                className={`heatmap__cell ${day.completed ? 'heatmap__cell--done' : ''} ${day.future ? 'heatmap__cell--future' : ''}`}
                title={day.date}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
