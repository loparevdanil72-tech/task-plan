import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { useTasksStore } from '../../store/tasksStore';
import { TaskCard } from '../../components/TaskCard/TaskCard';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet';
import { TaskForm } from '../../components/TaskForm/TaskForm';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { WeekStrip } from '../../components/WeekStrip/WeekStrip';
import { isDueToday, isCompletedToday } from '../../utils/streak';
import { haptic, hapticNotification } from '../../utils/telegram';
import { useT } from '../../utils/useT';
import type { Task } from '../../types/task';
import './Tasks.css';

export function Tasks() {
  const t = useT();
  const language = useTasksStore((s) => s.settings.language);
  const { tasks, addTask, updateTask, archiveTask, deleteTask, toggleComplete, runStreakReset } = useTasksStore();
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [congrats, setCongrats] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  useEffect(() => {
    runStreakReset();
    const interval = setInterval(runStreakReset, 60_000);
    return () => clearInterval(interval);
  }, [runStreakReset]);

  const activeTasks = tasks.filter((t) => !t.isArchived);
  const dueTasks = activeTasks.filter(isDueToday);
  const completedToday = dueTasks.filter(isCompletedToday);
  const allDone = dueTasks.length > 0 && completedToday.length === dueTasks.length;

  const sorted = [...activeTasks].sort((a, b) => {
    const aDone = isCompletedToday(a) ? 1 : 0;
    const bDone = isCompletedToday(b) ? 1 : 0;
    return aDone - bDone;
  });

  const allCompletedDates = new Set(
    activeTasks.flatMap((task) => task.completionHistory)
  );

  const handleToggle = (id: string) => {
    toggleComplete(id);
    setTimeout(() => {
      const updated = useTasksStore.getState().tasks;
      const due = updated.filter((t) => !t.isArchived && isDueToday(t));
      const done = due.filter(isCompletedToday);
      if (due.length > 0 && done.length === due.length) {
        hapticNotification('success');
        setCongrats(true);
        setTimeout(() => setCongrats(false), 2500);
      }
    }, 100);
  };

  const dateStr = dayjs().locale(language).format('dddd, D MMMM');
  const dateCapitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <div className="page">
      <div className="tasks-header">
        <div>
          <div className="tasks-header__date">{dateCapitalized}</div>
          <div className="tasks-header__subtitle hint">
            {activeTasks.length === 0
              ? t.noActiveTasks
              : t.tasksCount(activeTasks.length, activeTasks.reduce((s, t) => s + t.streak, 0))}
          </div>
        </div>
        <button
          className="tasks-add-btn"
          onClick={() => { haptic('light'); setEditTask(null); setShowForm(true); }}
        >
          {t.addTask}
        </button>
      </div>

      <WeekStrip completedDates={allCompletedDates} language={language} />

      {dueTasks.length > 0 && (
        <div className="card tasks-progress">
          <ProgressBar completed={completedToday.length} total={dueTasks.length} />
        </div>
      )}

      {congrats && <div className="tasks-congrats">{t.allDone}</div>}
      {allDone && !congrats && dueTasks.length > 0 && (
        <div className="tasks-all-done hint">{t.allDoneHint}</div>
      )}

      {sorted.length === 0 ? (
        <div className="tasks-empty">
          <div className="tasks-empty__icon">🎯</div>
          <div className="tasks-empty__text">{t.addFirstTask}</div>
          <div className="hint">{t.pressBelow}</div>
        </div>
      ) : (
        <div className="tasks-list">
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={(task) => { setEditTask(task); setShowForm(true); }}
              onArchive={archiveTask}
              onDelete={deleteTask}
              onDetail={(task) => navigate(`/task/${task.id}`)}
            />
          ))}
        </div>
      )}

      <button
        className="tasks-fab"
        onClick={() => { haptic('light'); setEditTask(null); setShowForm(true); }}
        aria-label={t.addTask}
      >
        +
      </button>

      {showForm && (
        <BottomSheet onClose={() => setShowForm(false)}>
          <TaskForm
            initial={editTask || undefined}
            onSave={(data) => {
              if (editTask) updateTask(editTask.id, data);
              else addTask(data);
              setShowForm(false);
            }}
            onClose={() => setShowForm(false)}
          />
        </BottomSheet>
      )}
    </div>
  );
}
