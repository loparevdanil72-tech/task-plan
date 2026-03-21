const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

function getUserId(): string | null {
  return String(window.Telegram?.WebApp?.initDataUnsafe?.user?.id ?? '') || null;
}

export function registerForNotifications() {
  const userId = getUserId();
  if (!userId) return;

  const timezoneOffset = new Date().getTimezoneOffset();

  fetch(`${BACKEND}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, chatId: userId, timezoneOffset }),
  }).catch(() => {/* backend may be offline */});
}

export function syncNotificationStatus(allDone: boolean) {
  const userId = getUserId();
  if (!userId) return;

  fetch(`${BACKEND}/api/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, allDone }),
  }).catch(() => {/* backend may be offline */});
}
