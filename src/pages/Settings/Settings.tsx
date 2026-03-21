import { useTasksStore } from '../../store/tasksStore';
import { haptic } from '../../utils/telegram';
import { useT } from '../../utils/useT';
import './Settings.css';

export function Settings() {
  const t = useT();
  const { settings, updateSettings } = useTasksStore();

  return (
    <div className="page">
      <h1 className="settings-title">{t.settingsTitle}</h1>

      <div className="card settings-section">
        <div className="settings-section__label hint">{t.themeLabel}</div>
        <div className="settings-row">
          {(['auto', 'light', 'dark'] as const).map((theme) => (
            <button
              key={theme}
              className={`settings-chip ${settings.theme === theme ? 'settings-chip--active' : ''}`}
              onClick={() => { haptic('light'); updateSettings({ theme }); }}
            >
              {theme === 'auto' ? t.themeAuto : theme === 'light' ? t.themeLight : t.themeDark}
            </button>
          ))}
        </div>
      </div>

      <div className="card settings-section">
        <div className="settings-section__label hint">{t.languageLabel}</div>
        <div className="settings-row">
          {(['ru', 'en'] as const).map((lang) => (
            <button
              key={lang}
              className={`settings-chip ${settings.language === lang ? 'settings-chip--active' : ''}`}
              onClick={() => { haptic('light'); updateSettings({ language: lang }); }}
            >
              {lang === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}
            </button>
          ))}
        </div>
      </div>

      <div className="card settings-section">
        <div className="settings-section__label hint">{t.aboutLabel}</div>
        <div style={{ fontSize: 14, color: 'var(--tg-theme-text-color)', marginTop: 8 }}>
          {t.aboutText}
        </div>
        <div className="hint" style={{ fontSize: 12, marginTop: 4 }}>
          {t.aboutHint}
        </div>
      </div>
    </div>
  );
}
