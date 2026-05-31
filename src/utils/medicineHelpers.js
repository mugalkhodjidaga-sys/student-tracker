import { FOOD_TIMING_OPTIONS, DOSE_UNITS } from './constants';

const foodLabel = Object.fromEntries(
  FOOD_TIMING_OPTIONS.map((o) => [o.value, o.label])
);

const unitLabel = Object.fromEntries(
  DOSE_UNITS.map((o) => [o.value, o.label])
);

/** Normalize legacy schedule keys (afternoon → noon, night-only → evening) */
export function normalizeSchedule(schedule = {}) {
  return {
    morning: !!(schedule.morning || schedule.Morning),
    noon: !!(schedule.noon || schedule.afternoon || schedule.Afternoon),
    evening: !!(schedule.evening || schedule.night || schedule.Night),
    night: !!schedule.night && !schedule.evening,
  };
}

export function formatScheduleDisplay(schedule) {
  const s = normalizeSchedule(schedule);
  const parts = [];
  if (s.morning) parts.push('Morning');
  if (s.noon) parts.push('Noon');
  if (s.evening) parts.push('Evening');
  if (s.night) parts.push('Night');
  return parts.length ? parts.join(', ') : 'As needed';
}

export function formatDoseDisplay(amount, unit) {
  if (!amount && !unit) return '';
  const unitText = unitLabel[unit] || unit || '';
  if (unit === 'as_directed') return 'As directed';
  if (unit === 'apply') return 'Apply thin layer';
  return `${amount} ${unitText}`.trim();
}

export function formatFoodTiming(value) {
  return foodLabel[value] || value || '';
}

export function buildTreatmentSummary(med) {
  if (!med) return '';
  const parts = [med.medicineGiven];
  const dose =
    med.doseAmount && med.doseUnit
      ? formatDoseDisplay(med.doseAmount, med.doseUnit)
      : med.treatmentDoses;
  if (dose) parts.push(dose);
  if (med.foodTiming) parts.push(formatFoodTiming(med.foodTiming));
  return parts.filter(Boolean).join(' · ');
}

export const SCHEDULE_PRESET_MAP = {
  once_morning: { morning: true, noon: false, evening: false, night: false },
  twice_daily: { morning: true, noon: false, evening: true, night: false },
  thrice_daily: { morning: true, noon: true, evening: true, night: false },
  as_needed: { morning: false, noon: false, evening: false, night: false },
};

export function detectSchedulePreset(schedule) {
  const s = normalizeSchedule(schedule);
  for (const [key, preset] of Object.entries(SCHEDULE_PRESET_MAP)) {
    if (
      s.morning === preset.morning &&
      s.noon === preset.noon &&
      s.evening === preset.evening &&
      s.night === preset.night
    ) {
      return key;
    }
  }
  return 'custom';
}

export function hasAnyScheduleSlot(schedule) {
  const s = normalizeSchedule(schedule);
  return s.morning || s.noon || s.evening || s.night;
}
