/**
 * Multi-select chips — toggles items in/out of selection array.
 */
export { parseIssueSelection, joinIssueSelection } from '../../utils/issueHelpers';

export function MultiChipGroup({ chips, selected = [], onChange }) {
  function toggle(chip) {
    const set = new Set(selected);
    if (set.has(chip)) {
      set.delete(chip);
    } else {
      set.add(chip);
    }
    onChange([...set]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => {
        const isOn = selected.includes(chip);
        return (
          <button
            key={chip}
            type="button"
            onClick={() => toggle(chip)}
            className={`min-h-10 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isOn
                ? 'bg-primary text-white ring-2 ring-primary ring-offset-1'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            aria-pressed={isOn}
          >
            {isOn ? '✓ ' : ''}
            {chip}
          </button>
        );
      })}
    </div>
  );
}

