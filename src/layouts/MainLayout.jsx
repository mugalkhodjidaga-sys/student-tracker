import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="md:pl-64">
        <div className="mx-auto max-w-4xl px-4 py-6 pb-24 md:pb-8 md:py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
