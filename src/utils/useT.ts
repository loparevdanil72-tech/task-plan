import { useTasksStore } from '../store/tasksStore';
import { translations } from './i18n';

export function useT() {
  const language = useTasksStore((s) => s.settings.language);
  return translations[language];
}
