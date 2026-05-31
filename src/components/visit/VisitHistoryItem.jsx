import { useState } from 'react';
import { SeverityBadge } from '../ui/SeverityBadge';
import { formatDisplayDate } from '../../utils/dateHelpers';
import {
  buildMedicinesSummary,
  buildTreatmentSummary,
} from '../../utils/medicineHelpers';

export function VisitHistoryItem({ visit }) {
  const [expanded, setExpanded] = useState(false);
  const medicines = visit.medicines?.length
    ? visit.medicines
    : visit.medicine
      ? [visit.medicine]
      : [];
  const summary = buildMedicinesSummary(medicines);

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
          {visit.attachments?.length > 0 && (
            <p className="text-xs text-slate-400">
              📷 {visit.attachments.length} photo{visit.attachments.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
        <SeverityBadge severity={visit.severity} />
      </button>

      {expanded && medicines.length > 0 && (
        <div className="mt-3 space-y-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
          <p>
            <strong>Symptoms:</strong> {visit.symptoms}
          </p>
          {medicines.map((med, index) => (
            <div key={med.localId || index} className="rounded-lg bg-white p-2">
              <p>
                <strong>Medicine {medicines.length > 1 ? index + 1 : ''}:</strong>{' '}
                {med.medicineGiven}
              </p>
              {buildTreatmentSummary(med) && (
                <p className="text-slate-500">{buildTreatmentSummary(med)}</p>
              )}
            </div>
          ))}
          {visit.treatedBy && (
            <p>
              <strong>Treated by:</strong> {visit.treatedBy}
            </p>
          )}
          {visit.attachments?.length > 0 && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              {visit.attachments.map((a) => (
                <img
                  key={a.localId}
                  src={a.previewDataUrl || (a.driveFileId ? `https://drive.google.com/thumbnail?id=${a.driveFileId}&sz=w200` : '')}
                  alt={a.fileName || 'Visit photo'}
                  className="aspect-square rounded-lg object-cover"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
