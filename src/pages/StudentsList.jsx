import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { SJM_IMAGES } from '../utils/branding';
import { SheetsApiError } from '../services/sheetsApiClient';

const statusColors = {
  healthy: 'bg-healthy-light text-healthy',
  sick: 'bg-urgent-light text-urgent',
  recovering: 'bg-medium-light text-medium',
};

export function StudentsList() {
  const { studentService } = useStorage();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    studentService
      .getAll()
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err instanceof SheetsApiError
            ? err.message
            : err.message || 'Could not load students from Google Sheets.'
        );
        setLoading(false);
      });
  }, [studentService]);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      s.name?.toLowerCase().includes(q) ||
      s.admissionNumber?.toLowerCase().includes(q) ||
      s.className?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Students</h1>
      <p className="text-sm text-slate-500">Live from Google Sheets — shared across all caretakers</p>
      <input
        type="search"
        placeholder="Search students…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full min-h-12 rounded-xl border-2 border-slate-200 px-4"
      />

      {error && (
        <p className="rounded-xl bg-urgent-light p-3 text-sm text-urgent">{error}</p>
      )}

      {loading ? (
        <p className="text-slate-500">Loading from Google Sheets…</p>
      ) : filtered.length === 0 && !error ? (
        <EmptyState
          message="No students in the sheet yet. Record a visit to add one."
          image={SJM_IMAGES.campus}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((s) => (
            <Link key={s.localId} to={`/students/${s.localId}`}>
              <Card className="hover:border-primary transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{s.name}</p>
                    <p className="text-sm text-slate-600">
                      {s.admissionNumber && `#${s.admissionNumber} · `}
                      {s.className && `${s.className} · `}
                      {s.roomNumber}
                    </p>
                    <p className="text-sm text-slate-500">Blood: {s.bloodGroup}</p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${statusColors[s.healthStatus] || 'bg-slate-100'}`}
                  >
                    {s.healthStatus}
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
