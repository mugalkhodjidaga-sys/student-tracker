import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { formatDisplayDate } from '../utils/dateHelpers';
import { SEVERITY } from '../utils/constants';

export function Dashboard() {
  const { dashboardService } = useStorage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardService.getStats().then(setStats);
  }, [dashboardService]);

  if (!stats) return <p className="text-slate-500">Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: 'Total students', value: stats.totalStudents, color: 'text-slate-800' },
          { label: 'Sick today', value: stats.sickToday, color: 'text-medium' },
          { label: 'Urgent (7 days)', value: stats.urgentCount, color: 'text-urgent' },
          { label: 'Visits this week', value: stats.recordsThisWeek, color: 'text-primary' },
        ].map((s) => (
          <Card key={s.label} className="text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="mt-1 text-sm text-slate-600">{s.label}</p>
          </Card>
        ))}
      </div>

      {stats.urgentAlerts?.length > 0 && (
        <Card title="Emergency alerts" className="border-urgent/30">
          <div className="space-y-2">
            {stats.urgentAlerts.map((v) => (
              <div
                key={v.localId}
                className="rounded-xl bg-urgent-light p-3"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="font-semibold text-urgent">
                      {v.student?.name} — {v.issueType}
                    </p>
                    <p className="text-sm text-slate-700">
                      {formatDisplayDate(v.visitDate)} · {v.symptoms}
                    </p>
                  </div>
                  <SeverityBadge severity={SEVERITY.URGENT} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card title="Recent entries">
        {stats.recentEntries?.length === 0 ? (
          <p className="text-slate-500">No entries yet</p>
        ) : (
          <ul className="space-y-2">
            {stats.recentEntries.map((v) => (
              <li
                key={v.localId}
                className="flex justify-between border-b border-slate-100 py-2 last:border-0"
              >
                <span>
                  <strong>{v.student?.name}</strong> — {v.issueType}
                </span>
                <SeverityBadge severity={v.severity} />
              </li>
            ))}
          </ul>
        )}
        <Link to="/recent" className="mt-3 inline-block text-primary font-medium">
          View all →
        </Link>
      </Card>
    </div>
  );
}
