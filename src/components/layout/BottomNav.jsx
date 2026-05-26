import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Record', icon: '➕' },
  { to: '/recent', label: 'Recent', icon: '📋' },
  { to: '/students', label: 'Students', icon: '👥' },
  { to: '/dashboard', label: 'Home', icon: '📊' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white md:hidden">
      <div className="flex justify-around">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex min-h-14 min-w-[4rem] flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                isActive ? 'text-primary' : 'text-slate-500'
              }`
            }
          >
            <span className="text-lg" aria-hidden>
              {icon}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
