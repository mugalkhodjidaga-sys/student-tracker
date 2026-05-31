import { FOOD_TIMING_OPTIONS } from '../../utils/constants';

export function FoodTimingChips({ value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">With food</p>
      <div className="flex flex-wrap gap-2">
        {FOOD_TIMING_OPTIONS.map(({ value: v, label }) => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`min-h-10 rounded-full px-3 py-2 text-sm font-medium transition-colors ${
              value === v
                ? 'bg-primary text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
