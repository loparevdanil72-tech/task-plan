import { useState } from 'react';
import type { Task, Frequency } from '../../types/task';
import { haptic } from '../../utils/telegram';
import { useT } from '../../utils/useT';
import './TaskForm.css';

interface Props {
  initial?: Partial<Task>;
  onSave: (data: Omit<Task, 'id' | 'streak' | 'maxStreak' | 'freezeTokens' | 'lastCompletedDate' | 'completionHistory' | 'createdAt' | 'isArchived'>) => void;
  onClose: () => void;
}

const EMOJIS = ['⭐', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '🎯', '✍️', '🎵', '💊', '🚶', '🧹', '💻', '🌿'];

export function TaskForm({ initial, onSave, onClose }: Props) {
  const t = useT();
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [emoji, setEmoji] = useState(initial?.emoji || '⭐');
  const [frequency, setFrequency] = useState<Frequency>(initial?.frequency || 'daily');
  const [customDays, setCustomDays] = useState<number[]>(initial?.customDays || [1, 3, 5]);
  const [error, setError] = useState('');

  const toggleDay = (day: number) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = () => {
    if (!title.trim()) { setError(t.errorTitle); haptic('medium'); return; }
    if (title.length > 100) { setError(t.errorLength); haptic('medium'); return; }
    if (frequency === 'custom' && customDays.length === 0) { setError(t.errorDays); haptic('medium'); return; }
    haptic('light');
    onSave({ title: title.trim(), description: description.trim(), emoji, frequency, customDays });
  };

  const freqOptions: { value: Frequency; label: string }[] = [
    { value: 'daily', label: t.daily },
    { value: 'weekly', label: t.weekly },
    { value: 'custom', label: t.custom },
  ];

  return (
    <div>
      <div className="bottom-sheet__handle" />
      <h2 className="task-form__title">{initial?.id ? t.editTask : t.newTask}</h2>

      <div className="form-field">
        <label className="form-label">{t.icon}</label>
        <div className="emoji-grid">
          {EMOJIS.map((e) => (
            <button
              key={e}
              className={`emoji-btn ${emoji === e ? 'emoji-btn--active' : ''}`}
              onClick={() => setEmoji(e)}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">{t.titleLabel}</label>
        <input
          className="form-input"
          type="text"
          placeholder={t.titlePlaceholder}
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(''); }}
          maxLength={100}
          autoFocus
        />
        <div className="task-form__char-count hint">{title.length}/100</div>
      </div>

      <div className="form-field">
        <label className="form-label">{t.descriptionLabel}</label>
        <input
          className="form-input"
          type="text"
          placeholder={t.descriptionPlaceholder}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label className="form-label">{t.frequency}</label>
        <div className="freq-tabs">
          {freqOptions.map((f) => (
            <button
              key={f.value}
              className={`freq-tab ${frequency === f.value ? 'freq-tab--active' : ''}`}
              onClick={() => setFrequency(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {frequency === 'custom' && (
        <div className="form-field">
          <label className="form-label">{t.weekdays}</label>
          <div className="day-picker">
            {t.days.map((name, idx) => (
              <button
                key={idx}
                className={`day-btn ${customDays.includes(idx) ? 'day-btn--active' : ''}`}
                onClick={() => toggleDay(idx)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <div className="task-form__error">{error}</div>}

      <div className="task-form__actions">
        <button className="btn-primary" onClick={handleSubmit}>
          {initial?.id ? t.save : t.createTask}
        </button>
        <button className="btn-secondary" style={{ marginTop: 8 }} onClick={onClose}>
          {t.cancel}
        </button>
      </div>
    </div>
  );
}
