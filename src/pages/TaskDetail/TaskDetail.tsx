import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTasksStore } from '../../store/tasksStore';
import { StreakFlame } from '../../components/StreakFlame/StreakFlame';
import { HeatmapCalendar } from '../../components/HeatmapCalendar/HeatmapCalendar';
import { getCompletionRate } from '../../utils/streak';
import { useT } from '../../utils/useT';
import './TaskDetail.css';

export function TaskDetail() {
  const t = useT();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks } = useTasksStore();
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 60 }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <div style={{ marginTop: 12 }}>{t.taskNotFound}</div>
        <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => navigate(-1)}>
          {t.back}
        </button>
      </div>
    );
  }

  const rate30 = getCompletionRate(task, 30);
  const totalCompleted = task.completionHistory.length;
  const createdDaysAgo = dayjs().diff(dayjs(task.createdAt), 'day');

  return (
    <div className="page">
      <button className="detail-back" onClick={() => navigate(-1)}>{t.back}</button>

      <div className="detail-hero card">
        <div className="detail-hero__emoji">{task.emoji}</div>
        <div className="detail-hero__title">{task.title}</div>
        {task.description && (
          <div className="detail-hero__desc hint">{task.description}</div>
        )}
        <div className="detail-hero__streak">
          <StreakFlame streak={task.streak} size="lg" />
        </div>
      </div>

      <div className="detail-stats">
        <div className="detail-stat card">
          <div className="detail-stat__value">{task.streak}</div>
          <div className="detail-stat__label hint">{t.currentStreak}</div>
        </div>
        <div className="detail-stat card">
          <div className="detail-stat__value">{task.maxStreak}</div>
          <div className="detail-stat__label hint">{t.maxStreak}</div>
        </div>
        <div className="detail-stat card">
          <div className="detail-stat__value">{rate30}%</div>
          <div className="detail-stat__label hint">{t.last30}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="detail-info-row">
          <span className="hint">{t.freqLabel}</span>
          <span>{t.freqLabels[task.frequency]}</span>
        </div>
        {task.frequency === 'custom' && (
          <div className="detail-info-row">
            <span className="hint">{t.daysLabel}</span>
            <span>{task.customDays.map((d) => t.days[d]).join(', ')}</span>
          </div>
        )}
        <div className="detail-info-row">
          <span className="hint">{t.totalDone}</span>
          <span>{totalCompleted} {t.timesLabel}</span>
        </div>
        <div className="detail-info-row">
          <span className="hint">{t.createdLabel}</span>
          <span>{createdDaysAgo === 0 ? t.today : t.daysAgo(createdDaysAgo)}</span>
        </div>
      </div>

      <div className="card">
        <div className="detail-section-title">{t.history}</div>
        <HeatmapCalendar completionHistory={task.completionHistory} />
      </div>
    </div>
  );
}
