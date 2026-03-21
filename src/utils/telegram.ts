declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initDataUnsafe: {
          user?: { id: number; first_name?: string; username?: string };
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
        themeParams: Record<string, string>;
        colorScheme: 'light' | 'dark';
        onEvent: (event: string, callback: () => void) => void;
      };
    };
  }
}

export const tg = () => window.Telegram?.WebApp;

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  try {
    tg()?.HapticFeedback?.impactOccurred(style);
  } catch {
    // not in Telegram
  }
}

export function hapticNotification(type: 'error' | 'success' | 'warning') {
  try {
    tg()?.HapticFeedback?.notificationOccurred(type);
  } catch {
    // not in Telegram
  }
}

export function applyTelegramTheme() {
  const webapp = tg();
  if (!webapp) return;

  const params = webapp.themeParams;
  const root = document.documentElement;

  const map: Record<string, string> = {
    bg_color: '--tg-theme-bg-color',
    text_color: '--tg-theme-text-color',
    hint_color: '--tg-theme-hint-color',
    link_color: '--tg-theme-link-color',
    button_color: '--tg-theme-button-color',
    button_text_color: '--tg-theme-button-text-color',
    secondary_bg_color: '--tg-theme-secondary-bg-color',
  };

  for (const [key, cssVar] of Object.entries(map)) {
    if (params[key]) root.style.setProperty(cssVar, `#${params[key]}`);
  }
}

export function initTelegram() {
  const webapp = tg();
  if (!webapp) return;
  webapp.ready();
  webapp.expand();
  applyTelegramTheme();
  webapp.onEvent('themeChanged', applyTelegramTheme);
}

export function getTelegramUserId(): string | null {
  const id = tg()?.initDataUnsafe?.user?.id;
  return id ? String(id) : null;
}
