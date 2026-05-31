import { SCHEDULE_PRESETS } from '../../utils/constants';
import { SCHEDULE_PRESET_MAP, normalizeSchedule } from '../../utils/medicineHelpers';

const SLOTS = [
  { key: 'morning', label: 'Morning', hint: '~8 AM' },
  { key: 'noon', label: 'Noon', hint: '~1 PM' },
  { key: 'evening', label: 'Evening', hint: '~7 PM' },
  { key: 'night', label: 'Night', hint: '~9 PM' },
];

const PRESETS = [
  { id: SCHEDULE_PRESETS.ONCE_MORNING, label: 'Once (morning)' },
  { id: SCHEDULE_PRESETS.TWICE, label: 'Twice daily' },
  { id: SCHEDULE_PRESETS.THRICE, label: 'Thrice daily' },
  { id: SCHEDULE_PRESETS.AS_NEEDED, label: 'As needed (SOS)' },
];

export function SchedulePicker({ schedule, schedulePreset, onChange, error }) {
  const s = normalizeSchedule(schedule);

  function applyPreset(presetId) {
    onChange({
      schedule: { ...SCHEDULE_PRESET_MAP[presetId] },
      schedulePreset: presetId,
    });
  }

  function toggleSlot(key) {
    onChange({
      schedule: { ...s, [key]: !s[key] },
      schedulePreset: SCHEDULE_PRESETS.CUSTOM,
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">When to give *</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => applyPreset(id)}
            className={`min-h-9 rounded-full px-3 py-1.5 text-xs font-medium ${
              schedulePreset === id
                ? 'bg-emerald-100 text-primary ring-1 ring-primary'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SLOTS.map(({ key, label, hint }) => (
          <label
            key={key}
            className={`flex min-h-14 cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-2 py-2 text-center ${
              s[key]
                ? 'border-primary bg-emerald-50'
                : 'border-slate-200 bg-white'
            }`}
          >
            <input
              type="checkbox"
              checked={!!s[key]}
              onChange={() => toggleSlot(key)}
              className="sr-only"
            />
            <span className="font-semibold text-sm">{label}</span>
            <span className="text-xs text-slate-500">{hint}</span>
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-urgent">{error}</p>}
    </div>
  );
}
