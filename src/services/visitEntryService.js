import { SCHOOL_ID } from '../utils/constants';

export function createVisitEntryService(
  studentService,
  healthRecordService,
  medicineService
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
        notes: payload.notes?.trim() || '',
        temperature: payload.temperature || '',
        bloodPressure: payload.bloodPressure || '',
        oxygenLevel: payload.oxygenLevel || '',
      });

      const medicine = await medicineService.create({
        studentId: student.localId,
        healthRecordId: healthRecord.localId,
        medicineGiven: payload.medicineGiven.trim(),
        treatmentDoses: payload.treatmentDoses.trim(),
        schedule: payload.schedule,
        ingestionNotes: payload.ingestionNotes?.trim() || '',
        startDate: payload.visitDate,
        endDate: payload.endDate || '',
      });

      await studentService.updateHealthStatus(
        student.localId,
        payload.severity
      );

      return { student, healthRecord, medicine };
    },
  };
}
