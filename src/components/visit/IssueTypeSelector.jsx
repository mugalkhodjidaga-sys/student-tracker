import { useState } from 'react';
import { ISSUE_CHIPS } from '../../utils/constants';
import { parseIssueSelection, joinIssueSelection } from '../../utils/issueHelpers';
import { Input } from '../ui/Input';

/**
 * Checklist panel for 15+ issue types — better on mobile than a multi-select dropdown.
 * Chips alone are too crowded; native <select multiple> is hard to use on phones.
 */
export function IssueTypeSelector({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const selected = parseIssueSelection(value, ISSUE_CHIPS);
  const selectedKnown = selected.filter((s) => ISSUE_CHIPS.includes(s));

  function toggle(issue) {
    const allSelected = parseIssueSelection(value, ISSUE_CHIPS);
    const extras = allSelected.filter((s) => !ISSUE_CHIPS.includes(s));
    const set = new Set(selectedKnown);
    if (set.has(issue)) set.delete(issue);
    else set.add(issue);
    onChange(joinIssueSelection([...set, ...extras]));
  }

  const summary =
    selectedKnown.length === 0
      ? 'Tap to select issue type(s)'
      : selectedKnown.join(', ');

  return (
    <div>
      <Input
        label="Type of issue *"
        placeholder="Or describe in your own words below…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
      />

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex w-full min-h-12 items-center justify-between rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-left text-base hover:border-primary"
        >
          <span className={selectedKnown.length ? 'font-medium text-slate-800' : 'text-slate-500'}>
            {summary}
          </span>
          <span className="text-slate-400">{open ? '▲' : '▼'}</span>
        </button>

        {open && (
          <div className="mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
            <p className="mb-2 px-2 text-xs font-medium text-slate-500">
              Select all that apply
            </p>
            {ISSUE_CHIPS.map((issue) => {
              const isOn = selectedKnown.includes(issue);
              return (
                <label
                  key={issue}
                  className={`mb-1 flex min-h-12 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${
                    isOn ? 'bg-emerald-100' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isOn}
                    onChange={() => toggle(issue)}
                    className="h-5 w-5 rounded accent-emerald-600"
                  />
                  <span className="font-medium text-slate-800">{issue}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
