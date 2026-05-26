import { ISSUE_CHIPS } from '../../utils/constants';
import { ChipGroup } from '../ui/ChipGroup';

export function IssueTypeChips({ value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-slate-700">Quick select issue type</p>
      <ChipGroup chips={ISSUE_CHIPS} value={value} onChange={onChange} />
    </div>
  );
}
