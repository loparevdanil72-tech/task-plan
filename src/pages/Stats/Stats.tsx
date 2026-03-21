import { useNavigate } from 'react-router-dom';
import { useTasksStore } from '../../store/tasksStore';
import { StreakFlame } from '../../components/StreakFlame/StreakFlame';
import { HeatmapCalendar } from '../../components/HeatmapCalendar/HeatmapCalendar';
import { getCompletionRate } from '../../utils/streak';
import { useT } from '../../utils/useT';
import './Stats.css';

export function Stats() {
  const t = useT();
  const { tasks } = useTasksStore();
  const navigate = useNavigate();

  const activeTasks = tasks.filter((task) => !task.isArchived);
  const activeStreaks = activeTasks.filter((task) => task.streak > 0).length;
  const bestTask = [...activeTasks].sort((a, b) => b.streak - a.streak)[0];

  const allDates = Array.from(
    new Set(activeTasks.flatMap((task) => task.completionHistory))
  );

  return (
    <div className="page">
      <h1 className="stats-title">{t.statsTitle}</h1>

      <div className="stats-summary">
        <div className="stats-summary__item card">
          <div className="stats-summary__value">{activeTasks.length}</div>
          <div className="stats-summary__label hint">{t.tasks}</div>
        </div>
        <div className="stats-summary__item card">
          <div className="stats-summary__value">{activeStreaks}</div>
          <div className="stats-summary__label hint">{t.activeStreaks}</div>
        </div>
        {bestTask && (
          <div className="stats-summary__item card">
            <div className="stats-summary__value">{bestTask.streak}</div>
            <div className="stats-summary__label hint">{t.bestStreak}</div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="stats-section-title">{t.overallActivity}</div>
        <HeatmapCalendar completionHistory={allDates} />
      </div>

      {activeTasks.length === 0 ? (
        <div className="stats-empty hint" style={{ textAlign: 'center', paddingTop: 32 }}>
          {t.noActiveTasks2}
        </div>
      ) : (
        activeTasks.map((task) => {
          const rate = getCompletionRate(task, 30);
          return (
            <div
              key={task.id}
              className="stats-task card"
              onClick={() => navigate(`/task/${task.id}`)}
            >
              <div className="stats-task__header">
                <span className="stats-task__emoji">{task.emoji}</span>
                <span className="stats-task__title">{task.title}</span>
                <StreakFlame streak={task.streak} size="sm" />
              </div>
              <div className="stats-task__row">
                <div className="stats-task__stat">
                  <div className="stats-task__stat-value">{task.maxStreak}</div>
                  <div className="stats-task__stat-label hint">{t.maxStreakLabel}</div>
                </div>
                <div className="stats-task__stat">
                  <div className="stats-task__stat-value">{rate}%</div>
                  <div className="stats-task__stat-label hint">{t.last30}</div>
                </div>
                <div className="stats-task__stat">
                  <div className="stats-task__stat-value">{task.completionHistory.length}</div>
                  <div className="stats-task__stat-label hint">{t.totalLabel}</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
