import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { VisitHistoryItem } from './VisitHistoryItem';
export function VisitHistoryPanel({ history, summary, loading }) {
  if (loading) {
    return (
      <Card title="Previous visits">
        <p className="text-slate-500">Loading history…</p>
      </Card>
    );
  }

  if (!summary || summary.count === 0) {
    return (
      <Card title="Previous visits">
        <EmptyState
          message="No previous visits — first time in health records"
          icon="✨"
        />
      </Card>
    );
  }

  return (
    <Card
      title="Previous visits"
      subtitle={`Treated ${summary.count} time${summary.count > 1 ? 's' : ''} before · Last visit: ${summary.lastFormatted} — ${summary.lastIssue}`}
    >
      <div className="max-h-[40vh] space-y-2 overflow-y-auto pr-1">
        {history.map((visit) => (
          <VisitHistoryItem key={visit.localId} visit={visit} />
        ))}
      </div>
    </Card>
  );
}
