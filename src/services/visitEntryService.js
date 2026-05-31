import { buildTreatmentDoses } from '../utils/validators';
import { parseIssueSelection } from '../utils/issueHelpers';
import { ISSUE_CHIPS } from '../utils/constants';

export function createVisitEntryService(
  studentService,
  healthRecordService,
  medicineService,
  medicineCatalogService
) {
  return {
    async saveVisit(payload) {
      const student = await studentService.upsertStudent({
        localId: payload.localId,
        admissionNumber: payload.admissionNumber,
        name: payload.name,
        age: payload.age,
        gender: payload.gender,
        className: payload.className,
        roomNumber: payload.roomNumber,
        bloodGroup: payload.bloodGroup,
        allergies: payload.allergies,
        guardianName: payload.guardianName,
        guardianPhone: payload.guardianPhone,
        admissionDate: payload.admissionDate,
      });

      const healthRecord = await healthRecordService.create({
        studentId: student.localId,
        issueType: payload.issueType.trim(),
        symptoms: payload.symptoms.trim(),
        severity: payload.severity,
        visitDate: payload.visitDate,
        treatedBy: payload.treatedBy?.trim() || '',
        notes: payload.recordNotes?.trim() || '',
        temperature: payload.temperature || '',
        bloodPressure: payload.bloodPressure || '',
        oxygenLevel: payload.oxygenLevel || '',
      });

      const treatmentDoses = buildTreatmentDoses(payload);

      const medicine = await medicineService.create({
        studentId: student.localId,
        healthRecordId: healthRecord.localId,
        medicineGiven: payload.medicineGiven.trim(),
        treatmentDoses,
        doseAmount: payload.doseAmount?.trim() || '',
        doseUnit: payload.doseUnit || '',
        foodTiming: payload.foodTiming || '',
        schedule: payload.schedule,
        schedulePreset: payload.schedulePreset || 'custom',
        medicineNotes: payload.medicineNotes?.trim() || '',
        ingestionNotes: payload.medicineNotes?.trim() || '',
        startDate: payload.visitDate,
        endDate: payload.endDate || '',
      });

      const issueTypes = parseIssueSelection(payload.issueType, ISSUE_CHIPS);
      await medicineCatalogService.recordUsage({
        medicineGiven: payload.medicineGiven,
        doseAmount: payload.doseAmount,
        doseUnit: payload.doseUnit,
        foodTiming: payload.foodTiming,
        schedule: payload.schedule,
        issueTypes,
      });

      await studentService.updateHealthStatus(
        student.localId,
        payload.severity
      );

      return { student, healthRecord, medicine };
    },
  };
}
