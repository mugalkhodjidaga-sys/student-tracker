export function ChipGroup({ chips, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onChange(chip)}
          className={`min-h-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            value === chip
              ? 'bg-primary text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
