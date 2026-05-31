import { useStorage } from '../../providers/StorageContext';
import { FOOD_TIMING, SCHEDULE_PRESETS } from '../../utils/constants';
import {
  SCHEDULE_PRESET_MAP,
  formatDoseDisplay,
  detectSchedulePreset,
} from '../../utils/medicineHelpers';
import { MedicineAutocomplete } from './MedicineAutocomplete';
import { DoseInput } from './DoseInput';
import { FoodTimingChips } from './FoodTimingChips';
import { SchedulePicker } from './SchedulePicker';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

function newMedicineId() {
  return globalThis.crypto?.randomUUID?.() ?? `med-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function MedicineRow({
  index,
  medicine,
  issueType,
  canRemove,
  onUpdate,
  onRemove,
  onSelectCatalog,
  errors,
}) {
  function update(field, value) {
    onUpdate(index, field, value);
  }

  function handleScheduleChange({ schedule, schedulePreset }) {
    onUpdate(index, 'schedule', schedule);
    onUpdate(index, 'schedulePreset', schedulePreset);
  }

  function handleDoseAmount(v) {
    onUpdate(index, 'doseAmount', v);
    onUpdate(index, 'treatmentDoses', formatDoseDisplay(v, medicine.doseUnit));
  }

  function handleDoseUnit(v) {
    onUpdate(index, 'doseUnit', v);
    onUpdate(index, 'treatmentDoses', formatDoseDisplay(medicine.doseAmount, v));
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-700">
          Medicine {index + 1}
        </p>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-urgent text-urgent hover:bg-red-50 min-h-8 px-3"
            onClick={() => onRemove(index)}
          >
            Remove
          </Button>
        )}
      </div>

      <MedicineAutocomplete
        value={medicine.medicineGiven}
        onChange={(v) => update('medicineGiven', v)}
        onSelectCatalog={(item) => onSelectCatalog(index, item)}
        issueType={issueType}
      />
      {errors[`medicines.${index}.medicineGiven`] && (
        <p className="text-sm text-urgent">
          {errors[`medicines.${index}.medicineGiven`]}
        </p>
      )}

      <DoseInput
        doseAmount={medicine.doseAmount}
        doseUnit={medicine.doseUnit}
        onAmountChange={handleDoseAmount}
        onUnitChange={handleDoseUnit}
        error={errors[`medicines.${index}.dose`]}
      />

      <SchedulePicker
        schedule={medicine.schedule}
        schedulePreset={medicine.schedulePreset}
        onChange={handleScheduleChange}
        error={errors[`medicines.${index}.schedule`]}
      />

      <FoodTimingChips
        value={medicine.foodTiming}
        onChange={(v) => update('foodTiming', v)}
      />
      {errors[`medicines.${index}.foodTiming`] && (
        <p className="text-sm text-urgent">
          {errors[`medicines.${index}.foodTiming`]}
        </p>
      )}

      <Input
        label="Extra notes (optional)"
        placeholder="e.g. only if fever above 100°F"
        value={medicine.medicineNotes}
        onChange={(e) => update('medicineNotes', e.target.value)}
      />
    </div>
  );
}

export function TreatmentSection({
  medicines,
  issueType,
  treatedBy,
  onUpdateMedicine,
  onAddMedicine,
  onRemoveMedicine,
  onTreatedByChange,
  errors,
}) {
  const { medicineCatalogService } = useStorage();

  async function handleCatalogSelect(index, item) {
    const defaults = await medicineCatalogService.applyCatalogDefaults(item);
    if (!defaults) return;
    onUpdateMedicine(index, 'medicineGiven', defaults.medicineGiven);
    onUpdateMedicine(index, 'doseAmount', defaults.doseAmount);
    onUpdateMedicine(index, 'doseUnit', defaults.doseUnit);
    onUpdateMedicine(index, 'foodTiming', defaults.foodTiming);
    onUpdateMedicine(index, 'schedule', defaults.schedule);
    onUpdateMedicine(
      index,
      'schedulePreset',
      detectSchedulePreset(defaults.schedule)
    );
    onUpdateMedicine(index, 'treatmentDoses', defaults.treatmentDoses);
  }

  return (
    <div className="space-y-4">
      {medicines.map((medicine, index) => (
        <MedicineRow
          key={medicine.id}
          index={index}
          medicine={medicine}
          issueType={issueType}
          canRemove={medicines.length > 1}
          onUpdate={onUpdateMedicine}
          onRemove={onRemoveMedicine}
          onSelectCatalog={handleCatalogSelect}
          errors={errors}
        />
      ))}

      {errors.medicines && (
        <p className="text-sm text-urgent">{errors.medicines}</p>
      )}

      <Button type="button" variant="outline" className="w-full" onClick={onAddMedicine}>
        + Add another medicine
      </Button>

      <Input
        label="Treated by"
        placeholder="Caretaker or doctor name"
        value={treatedBy}
        onChange={(e) => onTreatedByChange(e.target.value)}
      />
    </div>
  );
}

export function emptyMedicineRow() {
  return {
    id: newMedicineId(),
    medicineGiven: '',
    doseAmount: '1',
    doseUnit: 'tablet',
    treatmentDoses: '',
    schedule: { ...SCHEDULE_PRESET_MAP[SCHEDULE_PRESETS.TWICE] },
    schedulePreset: SCHEDULE_PRESETS.TWICE,
    foodTiming: FOOD_TIMING.AFTER_FOOD,
    medicineNotes: '',
  };
}

/** @deprecated use emptyMedicineRow — kept for any legacy imports */
export function emptyTreatmentFields() {
  return { ...emptyMedicineRow(), treatedBy: '' };
}
