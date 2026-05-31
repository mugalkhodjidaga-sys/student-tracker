import { useState } from 'react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { formatDisplayDate } from '../../utils/dateHelpers';
import { buildTreatmentSummary } from '../../utils/medicineHelpers';

export function VisitHistoryItem({ visit }) {
  const [expanded, setExpanded] = useState(false);
  const med = visit.medicine;
  const summary = buildTreatmentSummary(med);

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
          {summary && (
            <p className="truncate text-sm text-slate-500">{summary}</p>
          )}
        </div>
        <SeverityBadge severity={visit.severity} />
      </button>

      {expanded && med && (
        <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 text-sm text-slate-600">
          <p>
            <strong>Symptoms:</strong> {visit.symptoms}
          </p>
          <p>
            <strong>Medicine:</strong> {med.medicineGiven}
          </p>
          {med.treatmentDoses && (
            <p>
              <strong>Dose:</strong> {med.treatmentDoses}
            </p>
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
