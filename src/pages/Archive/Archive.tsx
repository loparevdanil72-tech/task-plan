import { useState } from 'react';
import { useTasksStore } from '../../store/tasksStore';
import { haptic } from '../../utils/telegram';
import { useT } from '../../utils/useT';
import './Archive.css';

export function Archive() {
  const t = useT();
  const { tasks, restoreTask, deleteTask } = useTasksStore();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const archived = tasks.filter((task) => task.isArchived);

  return (
    <div className="page">
      <h1 className="archive-title">{t.archiveTitle}</h1>

      {archived.length === 0 ? (
        <div style={{ textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <div className="hint">{t.archiveEmpty}</div>
        </div>
      ) : (
        archived.map((task) => (
          <div key={task.id} className="archive-card card">
            <div className="archive-card__info">
              <span className="archive-card__emoji">{task.emoji}</span>
              <div>
                <div className="archive-card__title">{task.title}</div>
                <div className="hint" style={{ fontSize: 12 }}>
                  {t.streakWas(task.streak, task.maxStreak)}
                </div>
              </div>
            </div>
            <div className="archive-card__actions">
              <button
                className="btn-secondary archive-btn"
                onClick={() => { haptic('light'); restoreTask(task.id); }}
              >
                {t.restore}
              </button>
              <button
                className="btn-secondary archive-btn btn-danger"
                onClick={() => setConfirmDelete(task.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}

      {confirmDelete && (
        <div className="overlay" onClick={() => setConfirmDelete(null)}>
          <div className="archive-confirm card" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>{t.deleteConfirm}</div>
            <div className="hint" style={{ marginBottom: 16 }}>{t.deleteWarning}</div>
            <button
              className="btn-primary"
              style={{ background: 'var(--danger)' }}
              onClick={() => { deleteTask(confirmDelete); setConfirmDelete(null); }}
            >
              {t.delete}
            </button>
            <button className="btn-secondary" style={{ marginTop: 8 }} onClick={() => setConfirmDelete(null)}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
