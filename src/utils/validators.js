import { FOOD_TIMING, SCHEDULE_PRESETS } from './constants';
import {
  hasAnyScheduleSlot,
  formatDoseDisplay,
} from './medicineHelpers';

function validateMedicineRow(med, index) {
  const errors = {};
  const prefix = `medicines.${index}`;

  if (!med.medicineGiven?.trim()) {
    errors[`${prefix}.medicineGiven`] = 'Medicine is required';
  }

  if (!med.doseAmount?.trim()) {
    errors[`${prefix}.dose`] = 'Dose amount is required';
  } else if (!med.doseUnit?.trim()) {
    errors[`${prefix}.dose`] = 'Dose unit is required';
  }

  if (
    med.schedulePreset !== SCHEDULE_PRESETS.AS_NEEDED &&
    !hasAnyScheduleSlot(med.schedule)
  ) {
    errors[`${prefix}.schedule`] =
      'Select when to give medicine, or choose As needed (SOS)';
  }

  if (!med.foodTiming) {
    errors[`${prefix}.foodTiming`] = 'Select before/after food option';
  }

  return errors;
}

export function validateVisitPayload(payload) {
  const errors = {};

  if (!payload.name?.trim()) {
    errors.name = 'Student name is required';
  }

  if (!payload.admissionNumber?.trim() && !payload.name?.trim()) {
    errors.lookup = 'Enter admission number or student name';
  }

  if (!payload.bloodGroup?.trim()) {
    errors.bloodGroup = 'Blood group is required';
  }

  if (!payload.age || Number(payload.age) < 1) {
    errors.age = 'Valid age is required';
  }

  if (!payload.gender) {
    errors.gender = 'Gender is required';
  }

  if (!payload.className?.trim()) {
    errors.className = 'Class is required';
  }

  if (!payload.roomNumber?.trim()) {
    errors.roomNumber = 'Room number is required';
  }

  if (!payload.visitDate) {
    errors.visitDate = 'Visit date is required';
  }

  if (!payload.issueType?.trim()) {
    errors.issueType = 'Type of issue is required';
  }

  if (!payload.symptoms?.trim()) {
    errors.symptoms = 'Symptoms description is required';
  }

  if (!payload.severity) {
    errors.severity = 'Severity is required';
  }

  const medicines = payload.medicines?.length
    ? payload.medicines
    : payload.medicineGiven
      ? [payload]
      : [];

  if (!medicines.length) {
    errors.medicines = 'Add at least one medicine';
  } else {
    medicines.forEach((med, index) => {
      Object.assign(errors, validateMedicineRow(med, index));
    });
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/** Clear a field error once the value satisfies that field's rule. */
export function isFieldValid(field, value, form = {}) {
  switch (field) {
    case 'name':
      return !!value?.trim();
    case 'bloodGroup':
      return !!value?.trim();
    case 'age':
      return value && Number(value) >= 1;
    case 'gender':
      return !!value;
    case 'className':
      return !!value?.trim();
    case 'roomNumber':
      return !!value?.trim();
    case 'visitDate':
      return !!value;
    case 'issueType':
      return !!value?.trim();
    case 'symptoms':
      return !!value?.trim();
    case 'severity':
      return !!value;
    default:
      return false;
  }
}

export function isMedicineFieldValid(field, value, medicine = {}) {
  switch (field) {
    case 'medicineGiven':
      return !!value?.trim();
    case 'doseAmount':
      return !!value?.trim() && !!medicine.doseUnit?.trim();
    case 'doseUnit':
      return !!medicine.doseAmount?.trim() && !!value?.trim();
    case 'foodTiming':
      return !!value;
    case 'schedule':
    case 'schedulePreset':
      if (medicine.schedulePreset === SCHEDULE_PRESETS.AS_NEEDED) return true;
      return hasAnyScheduleSlot(value ?? medicine.schedule);
    default:
      return false;
  }
}

export function medicineErrorKey(index, field) {
  if (field === 'doseAmount' || field === 'doseUnit') return `medicines.${index}.dose`;
  if (field === 'schedule' || field === 'schedulePreset') {
    return `medicines.${index}.schedule`;
  }
  return `medicines.${index}.${field}`;
}

export function buildTreatmentDoses(medicine) {
  if (medicine.treatmentDoses?.trim()) return medicine.treatmentDoses.trim();
  return formatDoseDisplay(medicine.doseAmount, medicine.doseUnit);
}
