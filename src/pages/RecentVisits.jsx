import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDisplayDate } from '../utils/dateHelpers';

export function RecentVisits() {
  const { healthRecordService } = useStorage();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    healthRecordService.getRecent(50).then((data) => {
      setVisits(data);
      setLoading(false);
    });
  }, [healthRecordService]);

  const filtered = visits.filter((v) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      v.student?.name?.toLowerCase().includes(q) ||
      v.issueType?.toLowerCase().includes(q) ||
      v.symptoms?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Recent Visits</h1>
      <input
        type="search"
        placeholder="Search by name or issue…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full min-h-12 rounded-xl border-2 border-slate-200 px-4"
      />

      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : filtered.length === 0 ? (
        <EmptyState message="No visits recorded yet" />
      ) : (
        <div className="space-y-3">
          {filtered.map((v) => (
            <Card key={v.localId}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    to={`/students/${v.studentId}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {v.student?.name || 'Unknown'}
                  </Link>
                  <p className="text-sm text-slate-600">
                    {formatDisplayDate(v.visitDate)} — {v.issueType}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                    {v.symptoms}
                  </p>
                  {v.medicine && (
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {v.medicine.medicineGiven}
                    </p>
                  )}
                </div>
                <SeverityBadge severity={v.severity} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
