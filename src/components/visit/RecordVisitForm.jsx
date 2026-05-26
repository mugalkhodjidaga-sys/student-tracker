import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BLOOD_GROUPS,
  GENDER_OPTIONS,
  SEVERITY_OPTIONS,
} from '../../utils/constants';
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
import { IssueTypeChips } from './IssueTypeChips';
import { MedicineScheduleCheckboxes } from './MedicineScheduleCheckboxes';

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
  medicineGiven: '',
  treatmentDoses: '',
  schedule: { morning: false, afternoon: false, night: false },
  ingestionNotes: '',
  treatedBy: '',
  notes: '',
  temperature: '',
  bloodPressure: '',
  oxygenLevel: '',
});

export function RecordVisitForm() {
  const { submit, loading, errors, success, resetSuccess } = useVisitEntry();
  const [form, setForm] = useState(emptyForm);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showVitals, setShowVitals] = useState(false);

  const studentId = selectedStudent?.localId || form.localId;
  const { history, summary, loading: historyLoading } = useStudentHistory(studentId);

  const showStudentFields = !selectedStudent || editMode;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
  }

  function handleClearStudent() {
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
          <div>
            <Input
              label="Type of issue *"
              placeholder="Fever, cough, injury…"
              value={form.issueType}
              onChange={(e) => update('issueType', e.target.value)}
              error={errors.issueType}
            />
            <div className="mt-3">
              <IssueTypeChips
                value={form.issueType}
                onChange={(v) => update('issueType', v)}
              />
            </div>
          </div>
          <Textarea
            label="Symptoms *"
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
        <div className="space-y-4">
          <Input
            label="Medicine given *"
            placeholder="e.g. Paracetamol 500mg"
            value={form.medicineGiven}
            onChange={(e) => update('medicineGiven', e.target.value)}
            error={errors.medicineGiven}
          />
          <Textarea
            label="Treatment / doses *"
            placeholder="e.g. 1 tablet after food, twice daily"
            value={form.treatmentDoses}
            onChange={(e) => update('treatmentDoses', e.target.value)}
            error={errors.treatmentDoses}
          />
          <MedicineScheduleCheckboxes
            schedule={form.schedule}
            onChange={(s) => update('schedule', s)}
            error={errors.schedule}
          />
          <Input
            label="Ingestion notes (optional)"
            placeholder="e.g. after food, with water"
            value={form.ingestionNotes}
            onChange={(e) => update('ingestionNotes', e.target.value)}
          />
          <Input
            label="Treated by"
            placeholder="Caretaker or doctor name"
            value={form.treatedBy}
            onChange={(e) => update('treatedBy', e.target.value)}
          />
        </div>
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
