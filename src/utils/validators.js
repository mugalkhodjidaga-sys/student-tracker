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
    errors.medicineGiven = 'Medicine given is required';
  }

  if (!payload.treatmentDoses?.trim()) {
    errors.treatmentDoses = 'Treatment / doses is required';
  }

  const schedule = payload.schedule || {};
  if (!schedule.morning && !schedule.afternoon && !schedule.night) {
    errors.schedule = 'Select at least one time: Morning, Afternoon, or Night';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
