import { useEffect, useState } from 'react';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { BarChart, DonutStat } from '../components/ui/BarChart';
import { formatDisplayDate } from '../utils/dateHelpers';

export function Reports() {
  const { reportService } = useStorage();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    reportService.getReports().then(setReports);
  }, [reportService]);

  if (!reports) return <p className="text-slate-500">Loading reports…</p>;

  const severitySegments = [
    { label: 'Normal', value: reports.severityBreakdown.Normal },
    { label: 'Medium', value: reports.severityBreakdown.Medium },
    { label: 'Urgent', value: reports.severityBreakdown.Urgent },
  ].filter((s) => s.value > 0);

  const issueChartData = reports.topSymptoms.map(({ symptom, count }) => ({
    label: symptom,
    value: count,
  }));

  const dayChartData = reports.visitsByDay.map(({ label, value }) => ({
    label,
    value,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports & analytics</h1>
      <p className="text-sm text-slate-600">Last 30 days (this device)</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card title="Students treated" className="text-center">
          <p className="text-4xl font-bold text-medium">{reports.sickStudentsCount}</p>
          <p className="mt-1 text-sm text-slate-500">unique students</p>
        </Card>
        <Card title="Total visits" className="text-center">
          <p className="text-4xl font-bold text-primary">{reports.totalVisits30}</p>
          <p className="mt-1 text-sm text-slate-500">in 30 days</p>
        </Card>
      </div>

      <Card title="Visits this week">
        <BarChart data={dayChartData} labelKey="label" valueKey="value" maxBars={7} />
      </Card>

      <Card title="By severity">
        {severitySegments.length === 0 ? (
          <p className="text-slate-500">No visits yet</p>
        ) : (
          <DonutStat segments={severitySegments} />
        )}
      </Card>

      <Card title="Most common issues">
        {issueChartData.length === 0 ? (
          <p className="text-slate-500">No data yet</p>
        ) : (
          <BarChart data={issueChartData} labelKey="label" valueKey="value" />
        )}
      </Card>

      <Card title="Students with repeated illness">
        {reports.repeatIllness.length === 0 ? (
          <p className="text-slate-500">None in last 30 days</p>
        ) : (
          <BarChart
            data={reports.repeatIllness.map(({ student, count }) => ({
              label: student.name,
              value: count,
            }))}
            labelKey="label"
            valueKey="value"
          />
        )}
      </Card>

      <Card title="Recent illnesses">
        <ul className="space-y-2">
          {reports.recentIllnesses.map((v) => (
            <li key={v.localId} className="text-sm border-b border-slate-100 pb-2 last:border-0">
              <strong>{v.student?.name}</strong> — {v.issueType} (
              {formatDisplayDate(v.visitDate)})
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
