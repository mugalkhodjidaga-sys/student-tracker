import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { RecordVisit } from '../pages/RecordVisit';
import { RecentVisits } from '../pages/RecentVisits';
import { StudentsList } from '../pages/StudentsList';
import { StudentProfile } from '../pages/StudentProfile';
import { Dashboard } from '../pages/Dashboard';
import { Reports } from '../pages/Reports';
import { Settings } from '../pages/Settings';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<RecordVisit />} />
        <Route path="recent" element={<RecentVisits />} />
        <Route path="students" element={<StudentsList />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
