import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { VisitHistoryItem } from '../components/visit/VisitHistoryItem';
import { EmptyState } from '../components/ui/EmptyState';

export function StudentProfile() {
  const { id } = useParams();
  const { studentService, healthRecordService } = useStorage();
  const [student, setStudent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await studentService.getById(id);
      const h = await healthRecordService.getByStudent(id);
      setStudent(s);
      setHistory(h);
      setLoading(false);
    }
    load();
  }, [id, studentService, healthRecordService]);

  if (loading) return <p className="text-slate-500">Loading…</p>;
  if (!student) return <p>Student not found.</p>;

  return (
    <div className="space-y-4">
      <Link to="/students" className="text-primary text-sm font-medium">
        ← Back to students
      </Link>

      <Card>
        <h1 className="text-2xl font-bold">{student.name}</h1>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {student.admissionNumber && (
            <>
              <dt className="text-slate-500">Admission</dt>
              <dd>{student.admissionNumber}</dd>
            </>
          )}
          <dt className="text-slate-500">Class / Room</dt>
          <dd>
            {student.className} · {student.roomNumber}
          </dd>
          <dt className="text-slate-500">Blood group</dt>
          <dd>{student.bloodGroup}</dd>
          <dt className="text-slate-500">Age / Gender</dt>
          <dd>
            {student.age} · {student.gender}
          </dd>
          {student.allergies && (
            <>
              <dt className="text-slate-500">Allergies</dt>
              <dd>{student.allergies}</dd>
            </>
          )}
          {student.guardianName && (
            <>
              <dt className="text-slate-500">Guardian</dt>
              <dd>
                {student.guardianName}
                {student.guardianPhone && ` · ${student.guardianPhone}`}
              </dd>
            </>
          )}
        </dl>
      </Card>

      <Card title={`Visit history (${history.length})`}>
        {history.length === 0 ? (
          <EmptyState message="No visits recorded for this student" />
        ) : (
          <div className="space-y-2">
            {history.map((v) => (
              <VisitHistoryItem key={v.localId} visit={v} />
            ))}
          </div>
        )}
      </Card>

      <Link to="/">
        <button
          type="button"
          className="w-full min-h-12 rounded-xl bg-primary font-semibold text-white"
        >
          Record new visit
        </button>
      </Link>
    </div>
  );
}
