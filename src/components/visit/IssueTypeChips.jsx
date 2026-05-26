import { ISSUE_CHIPS } from '../../utils/constants';
import {
  MultiChipGroup,
  parseIssueSelection,
  joinIssueSelection,
} from '../ui/MultiChipGroup';

export function IssueTypeChips({ value, onChange }) {
  const allSelected = parseIssueSelection(value, ISSUE_CHIPS);
  const chipSelected = allSelected.filter((s) => ISSUE_CHIPS.includes(s));
  const extras = allSelected.filter((s) => !ISSUE_CHIPS.includes(s));

  function handleChipChange(fromChips) {
    onChange(joinIssueSelection([...fromChips, ...extras]));
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">
        Quick select (tap multiple)
      </p>
      <MultiChipGroup
        chips={ISSUE_CHIPS}
        selected={chipSelected}
        onChange={handleChipChange}
      />
    </div>
  );
}
