import { NavLink } from 'react-router-dom';
import { SCHOOL_NAME } from '../../utils/constants';

const links = [
  { to: '/', label: 'Record Visit', icon: '➕' },
  { to: '/recent', label: 'Recent', icon: '📋' },
  { to: '/students', label: 'Students', icon: '👥' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/reports', label: 'Reports', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-slate-200 md:bg-white md:fixed md:inset-y-0 md:left-0">
      <div className="border-b border-slate-200 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Health Tracker
        </p>
        <p className="mt-1 text-sm font-medium leading-tight text-slate-800">
          {SCHOOL_NAME}
        </p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-primary'
                  : 'text-slate-600 hover:bg-slate-50'
              }`
            }
          >
            <span aria-hidden>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
