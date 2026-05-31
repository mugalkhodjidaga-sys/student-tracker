import { Link } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { SeverityBadge } from '../ui/SeverityBadge';
import { PhotoGallery } from '../photos/PhotoGallery';
import { useStorage } from '../../providers/StorageContext';
import { formatDisplayDate } from '../../utils/dateHelpers';
import {
  formatScheduleDisplay,
  formatDoseDisplay,
  formatFoodTiming,
  normalizeSchedule,
} from '../../utils/medicineHelpers';

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="border-b border-slate-100 py-3 last:border-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-base text-slate-800">{value}</dd>
    </div>
  );
}

function MedicineBlock({ med, index, total }) {
  const dose =
    med.doseAmount && med.doseUnit
      ? formatDoseDisplay(med.doseAmount, med.doseUnit)
      : med.treatmentDoses;

  return (
    <div className="rounded-xl bg-slate-50 p-3">
      {total > 1 && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Medicine {index + 1}
        </p>
      )}
      <DetailRow label="Medicine" value={med.medicineGiven} />
      <DetailRow label="Dose" value={dose} />
      <DetailRow
        label="Schedule"
        value={formatScheduleDisplay(normalizeSchedule(med.schedule))}
      />
      <DetailRow
        label="With food"
        value={formatFoodTiming(med.foodTiming) || med.ingestionNotes}
      />
      {(med.medicineNotes || med.ingestionNotes) && (
        <DetailRow
          label="Notes"
          value={med.medicineNotes || med.ingestionNotes}
        />
      )}
    </div>
  );
}

export function VisitDetailModal({ visit, open, onClose }) {
  const { attachmentService } = useStorage();
  if (!visit) return null;

  const student = visit.student;
  const medicines = visit.medicines?.length
    ? visit.medicines
    : visit.medicine
      ? [visit.medicine]
      : [];

  return (
    <Modal open={open} onClose={onClose} title="Visit details" wide>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          {student ? (
            <Link
              to={`/students/${visit.studentId}`}
              onClick={onClose}
              className="text-xl font-bold text-primary hover:underline"
            >
              {student.name}
            </Link>
          ) : (
            <p className="text-xl font-bold">Unknown student</p>
          )}
          {student?.admissionNumber && (
            <p className="text-sm text-slate-600">#{student.admissionNumber}</p>
          )}
        </div>
        <SeverityBadge severity={visit.severity} />
      </div>

      {student && (
        <div className="mb-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          {student.className} · {student.roomNumber} · Blood {student.bloodGroup}
          {student.allergies && ` · Allergies: ${student.allergies}`}
        </div>
      )}

      <dl>
        <DetailRow label="Visit date" value={formatDisplayDate(visit.visitDate)} />
        <DetailRow label="Type of issue" value={visit.issueType} />
        <DetailRow label="Symptoms" value={visit.symptoms} />
      </dl>

      {medicines.length > 0 && (
        <div className="my-4 space-y-3">
          {medicines.map((med, index) => (
            <MedicineBlock
              key={med.localId || index}
              med={med}
              index={index}
              total={medicines.length}
            />
          ))}
        </div>
      )}

      {visit.attachments?.length > 0 && (
        <div className="my-4">
          <PhotoGallery
            attachments={visit.attachments}
            getDisplayUrl={(a) => attachmentService.getDisplayUrl(a)}
          />
        </div>
      )}

      <dl>
        <DetailRow label="Treated by" value={visit.treatedBy} />
        {visit.temperature && (
          <DetailRow label="Temperature" value={visit.temperature} />
        )}
        {visit.bloodPressure && (
          <DetailRow label="Blood pressure" value={visit.bloodPressure} />
        )}
        {visit.oxygenLevel && (
          <DetailRow label="Oxygen level" value={visit.oxygenLevel} />
        )}
        {visit.notes && <DetailRow label="Visit notes" value={visit.notes} />}
      </dl>

      {student && (
        <Link
          to={`/students/${visit.studentId}`}
          onClick={onClose}
          className="mt-4 block text-center text-sm font-medium text-primary hover:underline"
        >
          View full student history →
        </Link>
      )}
    </Modal>
  );
}
