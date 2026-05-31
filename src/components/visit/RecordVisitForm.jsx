import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BLOOD_GROUPS,
  GENDER_OPTIONS,
  SEVERITY_OPTIONS,
} from '../../utils/constants';
import {
  isFieldValid,
  isMedicineFieldValid,
  medicineErrorKey,
} from '../../utils/validators';
import { SchoolBranding } from '../layout/SchoolBranding';
import { toDateInputValue } from '../../utils/dateHelpers';
import { useVisitEntry } from '../../hooks/useVisitEntry';
import { useStudentHistory } from '../../hooks/useStudentHistory';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { StudentLookup } from './StudentLookup';
import { StudentPrefillCard } from './StudentPrefillCard';
import { VisitHistoryPanel } from './VisitHistoryPanel';
import { IssueTypeSelector } from './IssueTypeSelector';
import {
  TreatmentSection,
  emptyMedicineRow,
} from '../medicine/TreatmentSection';
import { PhotoCapture, emptyPendingPhotos } from '../photos/PhotoCapture';

const emptyForm = () => ({
  localId: null,
  admissionNumber: '',
  name: '',
  age: '',
  gender: 'Male',
  className: '',
  roomNumber: '',
  bloodGroup: 'Unknown',
  allergies: '',
  guardianName: '',
  guardianPhone: '',
  visitDate: toDateInputValue(),
  issueType: '',
  symptoms: '',
  severity: 'Normal',
  medicines: [emptyMedicineRow()],
  treatedBy: '',
  recordNotes: '',
  temperature: '',
  bloodPressure: '',
  oxygenLevel: '',
  pendingPhotos: emptyPendingPhotos(),
});

export function RecordVisitForm() {
  const { submit, loading, errors, success, resetSuccess, clearError, clearErrors } =
    useVisitEntry();
  const [form, setForm] = useState(emptyForm);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showVitals, setShowVitals] = useState(false);

  const studentId = selectedStudent?.localId || form.localId;
  const { history, summary, loading: historyLoading } = useStudentHistory(studentId);

  const showStudentFields = !selectedStudent || editMode;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field] && isFieldValid(field, value, form)) {
      clearError(field);
    }
  }

  function updateMedicine(index, field, value) {
    setForm((prev) => {
      const medicines = [...prev.medicines];
      medicines[index] = { ...medicines[index], [field]: value };
      return { ...prev, medicines };
    });

    const medicine = form.medicines[index];
    const nextMedicine = { ...medicine, [field]: value };
    const errorKey = medicineErrorKey(index, field);

    if (errors[errorKey] && isMedicineFieldValid(field, value, nextMedicine)) {
      clearError(errorKey);
    }
    if (errors.medicines) {
      clearError('medicines');
    }
  }

  function addMedicine() {
    setForm((prev) => ({
      ...prev,
      medicines: [...prev.medicines, emptyMedicineRow()],
    }));
    if (errors.medicines) clearError('medicines');
  }

  function removeMedicine(index) {
    setForm((prev) => {
      if (prev.medicines.length <= 1) return prev;
      return {
        ...prev,
        medicines: prev.medicines.filter((_, i) => i !== index),
      };
    });
    clearErrors(
      Object.keys(errors).filter((key) => key.startsWith(`medicines.${index}.`))
    );
  }

  function handleSelectStudent(student) {
    setSelectedStudent(student);
    setEditMode(false);
    setForm((prev) => ({
      ...prev,
      localId: student.localId,
      admissionNumber: student.admissionNumber || '',
      name: student.name,
      age: String(student.age),
      gender: student.gender,
      className: student.className,
      roomNumber: student.roomNumber,
      bloodGroup: student.bloodGroup,
      allergies: student.allergies || '',
      guardianName: student.guardianName || '',
      guardianPhone: student.guardianPhone || '',
    }));
    if (errors.name && student.name?.trim()) clearError('name');
  }

  function revokePhotoUrls(photoList) {
    photoList.forEach((p) => {
      if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
    });
  }

  function setPendingPhotos(photos) {
    setForm((prev) => ({ ...prev, pendingPhotos: photos }));
  }

  function handleClearStudent() {
    revokePhotoUrls(form.pendingPhotos || []);
    setSelectedStudent(null);
    setEditMode(false);
    setForm(emptyForm());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await submit(form);
    if (result.ok) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleRecordAnother() {
    resetSuccess();
    handleClearStudent();
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <Card className="py-10">
          <span className="text-5xl" aria-hidden>
            ✅
          </span>
          <h2 className="mt-4 text-2xl font-bold text-healthy">Visit saved!</h2>
          <p className="mt-2 text-slate-600">
            Health record for <strong>{form.name}</strong> has been stored on this device.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={handleRecordAnother}>
              Record another visit
            </Button>
            <Link to="/recent">
              <Button variant="outline" size="lg" className="w-full">
                View recent visits
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-4 text-center md:text-left">
        <SchoolBranding size="lg" showTagline className="justify-center md:justify-start" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Record Visit</h1>
          <p className="mt-1 text-slate-600">Log student health visit and treatment</p>
        </div>
      </header>

      <Card title="1. Find student">
        <StudentLookup
          admissionNumber={form.admissionNumber}
          name={form.name}
          onAdmissionChange={(v) => update('admissionNumber', v)}
          onNameChange={(v) => update('name', v)}
          onSelect={handleSelectStudent}
        />

        <StudentPrefillCard
          student={selectedStudent}
          editMode={editMode}
          onToggleEdit={() => setEditMode(!editMode)}
          onClear={handleClearStudent}
        />

        {selectedStudent && (
          <div className="mt-4">
            <VisitHistoryPanel
              history={history}
              summary={summary}
              loading={historyLoading}
            />
          </div>
        )}

        {showStudentFields && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Age *"
              type="number"
              min="1"
              max="25"
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              error={errors.age}
            />
            <Select
              label="Gender *"
              value={form.gender}
              onChange={(e) => update('gender', e.target.value)}
              options={GENDER_OPTIONS}
              error={errors.gender}
            />
            <Input
              label="Class *"
              placeholder="e.g. Class 8"
              value={form.className}
              onChange={(e) => update('className', e.target.value)}
              error={errors.className}
            />
            <Input
              label="Room *"
              placeholder="e.g. Room 12"
              value={form.roomNumber}
              onChange={(e) => update('roomNumber', e.target.value)}
              error={errors.roomNumber}
            />
            <Select
              label="Blood group *"
              value={form.bloodGroup}
              onChange={(e) => update('bloodGroup', e.target.value)}
              options={BLOOD_GROUPS}
              error={errors.bloodGroup}
            />
            <Input
              label="Allergies"
              value={form.allergies}
              onChange={(e) => update('allergies', e.target.value)}
            />
            <Input
              label="Guardian name"
              value={form.guardianName}
              onChange={(e) => update('guardianName', e.target.value)}
            />
            <Input
              label="Guardian phone"
              type="tel"
              value={form.guardianPhone}
              onChange={(e) => update('guardianPhone', e.target.value)}
            />
          </div>
        )}
        {errors.name && <p className="mt-2 text-sm text-urgent">{errors.name}</p>}
      </Card>

      <Card title="2. Visit details">
        <div className="space-y-4">
          <Input
            label="Visit date *"
            type="date"
            value={form.visitDate}
            onChange={(e) => update('visitDate', e.target.value)}
            error={errors.visitDate}
          />
          <IssueTypeSelector
            value={form.issueType}
            onChange={(v) => update('issueType', v)}
            error={errors.issueType}
          />
          <Textarea
            label="Investigation / symptoms *"
            placeholder="Describe what happened…"
            value={form.symptoms}
            onChange={(e) => update('symptoms', e.target.value)}
            error={errors.symptoms}
            rows={3}
          />
          <Select
            label="Severity *"
            value={form.severity}
            onChange={(e) => update('severity', e.target.value)}
            options={SEVERITY_OPTIONS}
            error={errors.severity}
          />
          <button
            type="button"
            className="text-sm font-medium text-primary"
            onClick={() => setShowVitals(!showVitals)}
          >
            {showVitals ? '− Hide' : '+ Add'} optional vitals
          </button>
          {showVitals && (
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Temperature"
                placeholder="e.g. 101°F"
                value={form.temperature}
                onChange={(e) => update('temperature', e.target.value)}
              />
              <Input
                label="Blood pressure"
                placeholder="e.g. 120/80"
                value={form.bloodPressure}
                onChange={(e) => update('bloodPressure', e.target.value)}
              />
              <Input
                label="Oxygen level"
                placeholder="e.g. 98%"
                value={form.oxygenLevel}
                onChange={(e) => update('oxygenLevel', e.target.value)}
              />
            </div>
          )}
        </div>
      </Card>

      <Card title="3. Treatment">
        <TreatmentSection
          medicines={form.medicines}
          issueType={form.issueType}
          treatedBy={form.treatedBy}
          onUpdateMedicine={updateMedicine}
          onAddMedicine={addMedicine}
          onRemoveMedicine={removeMedicine}
          onTreatedByChange={(v) => update('treatedBy', v)}
          errors={errors}
        />
      </Card>

      <Card title="4. Reference photos (optional)">
        <p className="mb-3 text-sm text-slate-600">
          Capture injury, wound, or condition for doctor reference. Stored in Google Drive when signed in.
        </p>
        <PhotoCapture
          photos={form.pendingPhotos}
          onChange={setPendingPhotos}
          disabled={loading}
        />
      </Card>

      {errors.form && (
        <p className="rounded-xl bg-urgent-light p-3 text-urgent">{errors.form}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Saving…' : 'Save Visit'}
      </Button>
    </form>
  );
}
