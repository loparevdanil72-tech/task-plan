import { useState, useRef } from 'react';
import type { Task } from '../../types/task';
import { StreakFlame } from '../StreakFlame/StreakFlame';
import { isCompletedToday, isDueToday } from '../../utils/streak';
import { haptic } from '../../utils/telegram';
import { useT } from '../../utils/useT';
import './TaskCard.css';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onDetail: (task: Task) => void;
}

export function TaskCard({ task, onToggle, onEdit, onArchive, onDelete, onDetail }: Props) {
  const t = useT();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bounce, setBounce] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const done = isCompletedToday(task);
  const due = isDueToday(task);

  const handleCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic('light');
    setBounce(true);
    setTimeout(() => setBounce(false), 400);
    onToggle(task.id);
  };

  const handleLongPressStart = () => {
    longPressTimer.current = setTimeout(() => {
      haptic('medium');
      setMenuOpen(true);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const freqLabel =
    task.frequency === 'custom'
      ? task.customDays.map((d) => t.days[d]).join(', ')
      : task.frequency === 'daily' ? t.freqDaily : t.freqWeekly;

  const nextMilestone = task.streak < 7 ? 7 : task.streak < 30 ? 30 : task.streak < 100 ? 100 : null;
  const daysToMilestone = nextMilestone ? nextMilestone - task.streak : null;

  return (
    <>
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}>
          <div className="context-menu card" onClick={(e) => e.stopPropagation()}>
            <button className="context-menu__item" onClick={() => { setMenuOpen(false); onEdit(task); }}>
              {t.menuEdit}
            </button>
            <button className="context-menu__item" onClick={() => { setMenuOpen(false); onDetail(task); }}>
              {t.menuDetail}
            </button>
            <div className="divider" />
            <button className="context-menu__item" onClick={() => { setMenuOpen(false); onArchive(task.id); }}>
              {t.menuArchive}
            </button>
            <button className="context-menu__item btn-danger" onClick={() => { setMenuOpen(false); onDelete(task.id); }}>
              {t.menuDelete}
            </button>
          </div>
        </div>
      )}

      <div
        className={`task-card card ${done ? 'task-card--done' : ''} ${!due ? 'task-card--not-due' : ''}`}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onClick={() => onDetail(task)}
      >
        <button
          className={`task-card__check ${done ? 'task-card__check--done' : ''} ${bounce ? 'task-card__check--bounce' : ''}`}
          onClick={handleCheck}
          aria-label={done ? t.cancel : t.save}
        >
          {done ? '✓' : ''}
        </button>

        <div className="task-card__body">
          <div className="task-card__title">
            <span className="task-card__emoji">{task.emoji}</span>
            <span className={done ? 'task-card__text--done' : ''}>{task.title}</span>
          </div>
          <div className="task-card__meta">
            <span className="hint">{freqLabel}</span>
            {daysToMilestone !== null && task.streak > 0 && (
              <span className="hint"> · {t.daysToMilestone(daysToMilestone)}</span>
            )}
          </div>
        </div>

        <div className="task-card__streak">
          <StreakFlame streak={task.streak} size="sm" />
          {task.streak > 0 && (
            <div className="task-card__freeze">
              {Array.from({ length: 2 }, (_, i) => (
                <span
                  key={i}
                  className={`task-card__shield ${i < (task.freezeTokens ?? 0) ? 'task-card__shield--active' : 'task-card__shield--empty'}`}
                >
                  {i < (task.freezeTokens ?? 0) ? '🛡️' : '✖'}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          className="task-card__menu-btn"
          onClick={(e) => { e.stopPropagation(); setMenuOpen(true); }}
          aria-label="Menu"
        >
          ···
        </button>
      </div>
    </>
  );
}
