import { useNavigate } from 'react-router-dom';
import { useTasksStore } from '../../store/tasksStore';
import { StreakFlame } from '../../components/StreakFlame/StreakFlame';
import { isDueToday, isCompletedToday } from '../../utils/streak';
import { haptic } from '../../utils/telegram';
import { useT } from '../../utils/useT';
import './Home.css';

export function Home() {
  const t = useT();
  const navigate = useNavigate();
  const tasks = useTasksStore((s) => s.tasks);
  const isReady = useTasksStore((s) => s.isReady);

  const activeTasks = tasks.filter((t) => !t.isArchived);
  const dueTasks = activeTasks.filter(isDueToday);
  const completedToday = dueTasks.filter(isCompletedToday);
  const totalStreak = activeTasks.reduce((sum, t) => sum + t.streak, 0);

  if (!isReady) return (
    <div className="page home-welcome" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div className="home-logo__icon" style={{ fontSize: 72 }}>🔥</div>
    </div>
  );

  return (
    <div className="page home-welcome">
      <div className="home-logo">
        <div className="home-logo__icon">🔥</div>
        <h1 className="home-logo__name">Task Plan</h1>
        <p className="home-logo__tagline">{t.homeTagline}</p>
      </div>

      <div className="home-stats-row">
        <div className="card home-stat">
          <div className="home-stat__value">{activeTasks.length}</div>
          <div className="home-stat__label hint">{t.homeStatTasks}</div>
        </div>
        <div className="card home-stat">
          <div className="home-stat__value home-stat__value--flame">
            <StreakFlame streak={totalStreak} size="sm" />
            {totalStreak}
          </div>
          <div className="home-stat__label hint">{t.homeStatStreak}</div>
        </div>
        <div className="card home-stat">
          <div className="home-stat__value">{completedToday.length}/{dueTasks.length}</div>
          <div className="home-stat__label hint">{t.homeStatToday}</div>
        </div>
      </div>

      <div className="home-desc card">
        <div className="home-desc__text">{t.homeDescription}</div>
      </div>

      <button
        className="home-go-btn btn-primary"
        onClick={() => { haptic('light'); navigate('/tasks'); }}
      >
        {t.homeGoTasks}
      </button>
    </div>
  );
}
