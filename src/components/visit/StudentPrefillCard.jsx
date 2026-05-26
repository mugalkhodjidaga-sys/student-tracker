import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function StudentPrefillCard({ student, onClear, editMode, onToggleEdit }) {
  if (!student) return null;

  return (
    <Card className="border-primary/30 bg-emerald-50/50">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-primary">Existing student found</p>
          <p className="text-lg font-semibold text-slate-800">{student.name}</p>
          <p className="text-sm text-slate-600">
            {student.admissionNumber && `#${student.admissionNumber} · `}
            {student.className} · {student.roomNumber} · Blood: {student.bloodGroup}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onToggleEdit}>
            {editMode ? 'Done editing' : 'Edit details'}
          </Button>
          <Button variant="secondary" size="sm" type="button" onClick={onClear}>
            Change
          </Button>
        </div>
      </div>
    </Card>
  );
}
