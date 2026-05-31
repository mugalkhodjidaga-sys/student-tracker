import { useStorage } from '../../providers/StorageContext';
import { FOOD_TIMING, SCHEDULE_PRESETS } from '../../utils/constants';
import { SCHEDULE_PRESET_MAP, formatDoseDisplay, detectSchedulePreset } from '../../utils/medicineHelpers';
import { MedicineAutocomplete } from './MedicineAutocomplete';
import { DoseInput } from './DoseInput';
import { FoodTimingChips } from './FoodTimingChips';
import { SchedulePicker } from './SchedulePicker';
import { Input } from '../ui/Input';

export function TreatmentSection({ form, update, errors }) {
  const { medicineCatalogService } = useStorage();

  async function handleCatalogSelect(item) {
    const defaults = await medicineCatalogService.applyCatalogDefaults(item);
    if (!defaults) return;
    update('medicineGiven', defaults.medicineGiven);
    update('doseAmount', defaults.doseAmount);
    update('doseUnit', defaults.doseUnit);
    update('foodTiming', defaults.foodTiming);
    update('schedule', defaults.schedule);
    update('schedulePreset', detectSchedulePreset(defaults.schedule));
    update('treatmentDoses', defaults.treatmentDoses);
  }

  function handleScheduleChange({ schedule, schedulePreset }) {
    update('schedule', schedule);
    update('schedulePreset', schedulePreset);
  }

  function handleDoseAmount(v) {
    update('doseAmount', v);
    update('treatmentDoses', formatDoseDisplay(v, form.doseUnit));
  }

  function handleDoseUnit(v) {
    update('doseUnit', v);
    update('treatmentDoses', formatDoseDisplay(form.doseAmount, v));
  }

  return (
    <div className="space-y-4">
      <MedicineAutocomplete
        value={form.medicineGiven}
        onChange={(v) => update('medicineGiven', v)}
        onSelectCatalog={handleCatalogSelect}
        issueType={form.issueType}
      />
      {errors.medicineGiven && (
        <p className="text-sm text-urgent">{errors.medicineGiven}</p>
      )}

      <DoseInput
        doseAmount={form.doseAmount}
        doseUnit={form.doseUnit}
        onAmountChange={handleDoseAmount}
        onUnitChange={handleDoseUnit}
        error={errors.dose}
      />

      <SchedulePicker
        schedule={form.schedule}
        schedulePreset={form.schedulePreset}
        onChange={handleScheduleChange}
        error={errors.schedule}
      />

      <FoodTimingChips
        value={form.foodTiming}
        onChange={(v) => update('foodTiming', v)}
      />

      <Input
        label="Extra notes (optional)"
        placeholder="e.g. only if fever above 100°F"
        value={form.medicineNotes}
        onChange={(e) => update('medicineNotes', e.target.value)}
      />

      <Input
        label="Treated by"
        placeholder="Caretaker or doctor name"
        value={form.treatedBy}
        onChange={(e) => update('treatedBy', e.target.value)}
      />
    </div>
  );
}

export function emptyTreatmentFields() {
  return {
    medicineGiven: '',
    doseAmount: '1',
    doseUnit: 'tablet',
    treatmentDoses: '',
    schedule: { ...SCHEDULE_PRESET_MAP[SCHEDULE_PRESETS.TWICE] },
    schedulePreset: SCHEDULE_PRESETS.TWICE,
    foodTiming: FOOD_TIMING.AFTER_FOOD,
    medicineNotes: '',
    treatedBy: '',
  };
}
