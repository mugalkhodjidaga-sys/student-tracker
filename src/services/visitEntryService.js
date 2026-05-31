import { buildTreatmentDoses } from '../utils/validators';
import { parseIssueSelection } from '../utils/issueHelpers';
import { ISSUE_CHIPS } from '../utils/constants';

export function createVisitEntryService(
  studentService,
  healthRecordService,
  medicineService,
  medicineCatalogService,
  attachmentService
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

      const medicineRows = payload.medicines?.length
        ? payload.medicines
        : [payload];

      const issueTypes = parseIssueSelection(payload.issueType, ISSUE_CHIPS);
      const savedMedicines = [];

      for (const row of medicineRows) {
        const treatmentDoses = buildTreatmentDoses(row);

        const medicine = await medicineService.create({
          studentId: student.localId,
          healthRecordId: healthRecord.localId,
          medicineGiven: row.medicineGiven.trim(),
          treatmentDoses,
          doseAmount: row.doseAmount?.trim() || '',
          doseUnit: row.doseUnit || '',
          foodTiming: row.foodTiming || '',
          schedule: row.schedule,
          schedulePreset: row.schedulePreset || 'custom',
          medicineNotes: row.medicineNotes?.trim() || '',
          ingestionNotes: row.medicineNotes?.trim() || '',
          startDate: payload.visitDate,
          endDate: payload.endDate || '',
        });

        savedMedicines.push(medicine);

        await medicineCatalogService.recordUsage({
          medicineGiven: row.medicineGiven,
          doseAmount: row.doseAmount,
          doseUnit: row.doseUnit,
          foodTiming: row.foodTiming,
          schedule: row.schedule,
          issueTypes,
        });
      }

      const attachments = await attachmentService.saveForVisit({
        healthRecordId: healthRecord.localId,
        studentId: student.localId,
        admissionNumber: student.admissionNumber,
        studentName: student.name,
        visitDate: payload.visitDate,
        photos: payload.pendingPhotos || [],
        accessToken: payload.accessToken || null,
      });

      await studentService.updateHealthStatus(
        student.localId,
        payload.severity
      );

      return { student, healthRecord, medicines: savedMedicines, attachments };
    },
  };
}
