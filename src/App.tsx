import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useTasksStore } from './store/tasksStore';
import { TabBar } from './components/TabBar/TabBar';
import { Home } from './pages/Home/Home';
import { Tasks } from './pages/Tasks/Tasks';
import { TaskDetail } from './pages/TaskDetail/TaskDetail';
import { Stats } from './pages/Stats/Stats';
import { Archive } from './pages/Archive/Archive';
import { Settings } from './pages/Settings/Settings';
import { Notes } from './pages/Notes/Notes';
import { initTelegram } from './utils/telegram';
import { registerForNotifications } from './utils/notifications';
import { applyTheme, initThemeListener } from './utils/theme';
import './styles/global.css';

export default function App() {
  const initialize = useTasksStore((s) => s.initialize);
  const theme = useTasksStore((s) => s.settings.theme);

  useEffect(() => {
    initTelegram();
    initialize();
    registerForNotifications();
  }, [initialize]);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system theme changes (for 'auto' mode)
  useEffect(() => {
    initThemeListener(() => useTasksStore.getState().settings.theme);
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
      <TabBar />
    </HashRouter>
  );
}
