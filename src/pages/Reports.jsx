import { useEffect, useState } from 'react';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { formatDisplayDate } from '../utils/dateHelpers';

export function Reports() {
  const { reportService } = useStorage();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    reportService.getReports().then(setReports);
  }, [reportService]);

  if (!reports) return <p className="text-slate-500">Loading reports…</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <Card title="Students with illness (last 30 days)">
        <p className="text-3xl font-bold text-medium">{reports.sickStudentsCount}</p>
      </Card>

      <Card title="Most common issues">
        {reports.topSymptoms.length === 0 ? (
          <p className="text-slate-500">No data yet</p>
        ) : (
          <ul className="space-y-2">
            {reports.topSymptoms.map(({ symptom, count }) => (
              <li key={symptom} className="flex justify-between">
                <span>{symptom}</span>
                <span className="font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Students with repeated illness">
        {reports.repeatIllness.length === 0 ? (
          <p className="text-slate-500">None in last 30 days</p>
        ) : (
          <ul className="space-y-2">
            {reports.repeatIllness.map(({ student, count }) => (
              <li key={student.localId} className="flex justify-between">
                <span>{student.name}</span>
                <span className="font-semibold">{count} visits</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recent illnesses">
        <ul className="space-y-2">
          {reports.recentIllnesses.map((v) => (
            <li key={v.localId} className="text-sm">
              <strong>{v.student?.name}</strong> — {v.issueType} (
              {formatDisplayDate(v.visitDate)})
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
