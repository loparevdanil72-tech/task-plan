import { NavLink } from 'react-router-dom';
import { useT } from '../../utils/useT';
import './TabBar.css';

export function TabBar() {
  const t = useT();
  const TABS = [
    { to: '/', icon: '🔥', label: t.home },
    { to: '/tasks', icon: '✅', label: t.tasks },
    { to: '/archive', icon: '📦', label: t.archive },
    { to: '/stats', icon: '📊', label: t.stats },
    { to: '/settings', icon: '⚙️', label: t.settings },
  ];

  return (
    <nav className="tab-bar">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) => `tab-bar__item ${isActive ? 'tab-bar__item--active' : ''}`}
        >
          <span className="tab-bar__icon">{tab.icon}</span>
          <span className="tab-bar__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
