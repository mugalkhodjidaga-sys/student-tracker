import { useState } from 'react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { formatDisplayDate } from '../../utils/dateHelpers';

export function VisitHistoryItem({ visit }) {
  const [expanded, setExpanded] = useState(false);
  const med = visit.medicine;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start justify-between gap-2 text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-800">
            {formatDisplayDate(visit.visitDate)} — {visit.issueType}
          </p>
          <p className="truncate text-sm text-slate-600">{visit.symptoms}</p>
          {med && (
            <p className="truncate text-sm text-slate-500">
              {med.medicineGiven}
            </p>
          )}
        </div>
        <SeverityBadge severity={visit.severity} />
      </button>

      {expanded && (
        <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 text-sm text-slate-600">
          <p>
            <strong>Symptoms:</strong> {visit.symptoms}
          </p>
          {med && (
            <>
              <p>
                <strong>Medicine:</strong> {med.medicineGiven}
              </p>
              <p>
                <strong>Doses:</strong> {med.treatmentDoses}
              </p>
              {med.ingestionNotes && (
                <p>
                  <strong>Notes:</strong> {med.ingestionNotes}
                </p>
              )}
            </>
          )}
          {visit.treatedBy && (
            <p>
              <strong>Treated by:</strong> {visit.treatedBy}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
