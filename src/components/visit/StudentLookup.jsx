import { useEffect, useState } from 'react';
import { useStorage } from '../../providers/StorageContext';
import { Input } from '../ui/Input';

export function StudentLookup({ onSelect, admissionNumber, name, onAdmissionChange, onNameChange }) {
  const { studentService } = useStorage();
  const [suggestions, setSuggestions] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    const q = admissionNumber?.trim() || name?.trim();
    if (!q || q.length < 1) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await studentService.search(q);
      setSuggestions(results.slice(0, 6));
    }, 200);

    return () => clearTimeout(timer);
  }, [admissionNumber, name, studentService]);

  async function handleAdmissionBlur() {
    if (!admissionNumber?.trim()) return;
    const found = await studentService.findByAdmissionNumber(admissionNumber);
    if (found) onSelect(found);
  }

  function pickStudent(student) {
    onSelect(student);
    setShowList(false);
  }

  return (
    <div className="space-y-4">
      <Input
        label="Admission number"
        placeholder="e.g. SJM-001"
        value={admissionNumber}
        onChange={(e) => onAdmissionChange(e.target.value)}
        onBlur={handleAdmissionBlur}
        onFocus={() => setShowList(true)}
      />
      <div className="relative">
        <Input
          label="Student name *"
          placeholder="Start typing name…"
          value={name}
          onChange={(e) => {
            onNameChange(e.target.value);
            setShowList(true);
          }}
          onFocus={() => setShowList(true)}
        />
        {showList && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
            {suggestions.map((s) => (
              <li key={s.localId}>
                <button
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-emerald-50"
                  onClick={() => pickStudent(s)}
                >
                  <span className="font-medium">{s.name}</span>
                  {s.admissionNumber && (
                    <span className="ml-2 text-sm text-slate-500">
                      #{s.admissionNumber}
                    </span>
                  )}
                  <span className="block text-sm text-slate-500">
                    {s.className} · {s.roomNumber}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
