import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DOSE_UNITS } from '../../utils/constants';

export function DoseInput({ doseAmount, doseUnit, onAmountChange, onUnitChange, error }) {
  const unitOptions = [
    { value: '', label: 'Select unit…' },
    ...DOSE_UNITS.map((u) => ({ value: u.value, label: u.label })),
  ];

  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-slate-700">Dose *</p>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label=""
          type="text"
          inputMode="decimal"
          placeholder="e.g. 1, 5, 10"
          value={doseAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          aria-label="Dose amount"
        />
        <Select
          label=""
          value={doseUnit}
          onChange={(e) => onUnitChange(e.target.value)}
          options={unitOptions}
          aria-label="Dose unit"
        />
      </div>
      {error && <p className="mt-1 text-sm text-urgent">{error}</p>}
    </div>
  );
}
