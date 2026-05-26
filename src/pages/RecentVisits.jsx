import { useEffect, useState } from 'react';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { SeverityBadge } from '../components/ui/SeverityBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { VisitDetailModal } from '../components/health/VisitDetailModal';
import { formatDisplayDate } from '../utils/dateHelpers';

export function RecentVisits() {
  const { healthRecordService } = useStorage();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

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
      <p className="text-sm text-slate-600">Tap a visit to see full details</p>
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
            <button
              key={v.localId}
              type="button"
              onClick={() => setSelected(v)}
              className="w-full text-left"
            >
              <Card className="cursor-pointer transition-shadow hover:shadow-md active:scale-[0.99]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-primary">
                      {v.student?.name || 'Unknown'}
                    </p>
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
                <p className="mt-2 text-xs font-medium text-slate-400">
                  Tap for details →
                </p>
              </Card>
            </button>
          ))}
        </div>
      )}

      <VisitDetailModal
        visit={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
