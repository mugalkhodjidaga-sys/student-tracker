export function MedicineScheduleCheckboxes({ schedule, onChange, error }) {
  const times = [
    { key: 'morning', label: 'Morning' },
    { key: 'afternoon', label: 'Afternoon' },
    { key: 'night', label: 'Night' },
  ];

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">When to give medicine</p>
      <div className="flex flex-wrap gap-3">
        {times.map(({ key, label }) => (
          <label
            key={key}
            className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-2 px-4 py-2 ${
              schedule[key]
                ? 'border-primary bg-emerald-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <input
              type="checkbox"
              checked={!!schedule[key]}
              onChange={(e) => onChange({ ...schedule, [key]: e.target.checked })}
              className="h-5 w-5 rounded accent-emerald-600"
            />
            <span className="font-medium">{label}</span>
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-urgent">{error}</p>}
    </div>
  );
}
