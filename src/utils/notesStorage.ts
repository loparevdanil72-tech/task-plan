const KEY = 'notes_data';
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function getUserId(): string | null {
  const id = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  return id ? String(id) : null;
}

function load(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function getNote(date: string): string {
  return load()[date] || '';
}

export function saveNote(date: string, text: string) {
  const data = load();
  if (text.trim()) {
    data[date] = text;
  } else {
    delete data[date];
  }
  localStorage.setItem(KEY, JSON.stringify(data));

  // Sync to backend
  const userId = getUserId();
  if (!userId) return;
  fetch(`${BACKEND}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, date, text: text.trim() }),
  }).catch(() => {/* backend may be offline */});
}
