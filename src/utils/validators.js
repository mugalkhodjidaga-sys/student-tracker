import { FOOD_TIMING, SCHEDULE_PRESETS } from './constants';
import {
  hasAnyScheduleSlot,
  formatDoseDisplay,
} from './medicineHelpers';

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

  if (!payload.medicineGiven?.trim()) {
    errors.medicineGiven = 'Medicine is required';
  }

  if (!payload.doseAmount?.trim()) {
    errors.dose = 'Dose amount is required';
  }

  if (!payload.doseUnit?.trim()) {
    errors.dose = 'Dose unit is required';
  }

  if (
    payload.schedulePreset !== SCHEDULE_PRESETS.AS_NEEDED &&
    !hasAnyScheduleSlot(payload.schedule)
  ) {
    errors.schedule = 'Select when to give medicine, or choose As needed (SOS)';
  }

  if (!payload.foodTiming) {
    errors.foodTiming = 'Select before/after food option';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildTreatmentDoses(payload) {
  if (payload.treatmentDoses?.trim()) return payload.treatmentDoses.trim();
  return formatDoseDisplay(payload.doseAmount, payload.doseUnit);
}
