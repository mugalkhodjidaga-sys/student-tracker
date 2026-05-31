import { SCHOOL_ID, HEALTH_STATUS } from './constants';
import { createSyncBase } from './syncHelpers';

/** Parse API response — supports object array or raw sheet rows `[headers, ...rows]`. */
export function parseSheetRows(data) {
  if (!data) return [];
  if (!Array.isArray(data)) return [];
  if (data.length === 0) return [];

  if (Array.isArray(data[0])) {
    const [headers, ...rows] = data;
    if (!headers?.length) return [];
    return rows
      .filter((row) => row.some((cell) => cell !== '' && cell != null))
      .map((row) => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] ?? '';
        });
        return obj;
      });
  }

  return data;
}

export const parseStudentsResponse = parseSheetRows;

export function sheetRowToStudent(row) {
  const studentId = String(row.StudentId ?? row.studentId ?? '').trim();
  const now = new Date().toISOString();

  return {
    ...createSyncBase({
      localId: studentId,
      cloudId: studentId,
      syncStatus: 'synced',
    }),
    schoolId: SCHOOL_ID,
    admissionNumber: studentId,
    name: String(row.Name ?? row.name ?? '').trim(),
    age: Number(row.Age ?? row.age ?? 0) || '',
    gender: String(row.Gender ?? row.gender ?? 'Male').trim() || 'Male',
    className: String(row.Class ?? row.className ?? '').trim(),
    roomNumber: String(row.Room ?? row.room ?? '').trim(),
    bloodGroup: String(row.BloodGroup ?? row.bloodGroup ?? 'Unknown').trim() || 'Unknown',
    allergies: String(row.Allergies ?? row.allergies ?? '').trim(),
    guardianName: String(row.GuardianName ?? row.guardianName ?? '').trim(),
    guardianPhone: String(row.GuardianPhone ?? row.guardianPhone ?? '').trim(),
    admissionDate: row.AdmissionDate || now.split('T')[0],
    healthStatus: row.HealthStatus || HEALTH_STATUS.HEALTHY,
    updatedAt: now,
  };
}

export function studentToSheetPayload(student) {
  return {
    Name: student.name?.trim() || '',
    Age: student.age ?? '',
    Gender: student.gender || '',
    Room: student.roomNumber?.trim() || '',
    BloodGroup: student.bloodGroup || '',
    GuardianName: student.guardianName?.trim() || '',
    GuardianPhone: student.guardianPhone?.trim() || '',
    Class: student.className?.trim() || '',
    Allergies: student.allergies?.trim() || '',
    HealthStatus: student.healthStatus || HEALTH_STATUS.HEALTHY,
  };
}

function formatVisitDate(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return value.toISOString().split('T')[0];
  }
  const str = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const d = new Date(str);
  if (!Number.isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return str;
}

export function sheetRowToHealthRecord(row) {
  const recordId = String(row.RecordId ?? '').trim();
  const now = new Date().toISOString();

  return {
    ...createSyncBase({
      localId: recordId,
      cloudId: recordId,
      syncStatus: 'synced',
    }),
    schoolId: SCHOOL_ID,
    studentId: String(row.StudentId ?? '').trim(),
    visitDate: formatVisitDate(row.VisitDate),
    issueType: String(row.IssueType ?? row.Diagnosis ?? '').trim(),
    symptoms: String(row.Symptoms ?? '').trim(),
    severity: String(row.Severity ?? 'Normal').trim() || 'Normal',
    treatedBy: String(row.TreatedBy ?? '').trim(),
    notes: String(row.Notes ?? '').trim(),
    temperature: String(row.Temperature ?? '').trim(),
    bloodPressure: String(row.BloodPressure ?? '').trim(),
    oxygenLevel: String(row.OxygenLevel ?? '').trim(),
    updatedAt: now,
  };
}

export function healthRecordToSheetPayload(record) {
  return {
    StudentId: record.studentId,
    VisitDate: record.visitDate,
    IssueType: record.issueType || '',
    Symptoms: record.symptoms || '',
    Severity: record.severity || '',
    TreatedBy: record.treatedBy || '',
    Notes: record.notes || '',
    Temperature: record.temperature || '',
    BloodPressure: record.bloodPressure || '',
    OxygenLevel: record.oxygenLevel || '',
  };
}

export function sheetRowToMedicine(row) {
  const medicineId = String(row.MedicineId ?? '').trim();
  let schedule = {};
  try {
    schedule = row.ScheduleJson ? JSON.parse(row.ScheduleJson) : {};
  } catch {
    schedule = {};
  }

  const now = new Date().toISOString();

  return {
    ...createSyncBase({
      localId: medicineId,
      cloudId: medicineId,
      syncStatus: 'synced',
    }),
    schoolId: SCHOOL_ID,
    studentId: String(row.StudentId ?? '').trim(),
    healthRecordId: String(row.RecordId ?? '').trim(),
    medicineGiven: String(row.MedicineName ?? '').trim(),
    treatmentDoses: String(row.Dosage ?? '').trim(),
    doseAmount: String(row.DoseAmount ?? '').trim(),
    doseUnit: String(row.DoseUnit ?? '').trim(),
    foodTiming: String(row.FoodTiming ?? '').trim(),
    schedule,
    schedulePreset: String(row.SchedulePreset ?? 'custom').trim(),
    medicineNotes: String(row.MedicineNotes ?? '').trim(),
    ingestionNotes: String(row.MedicineNotes ?? '').trim(),
    startDate: formatVisitDate(row.StartDate),
    endDate: formatVisitDate(row.EndDate),
    isCompleted: false,
    updatedAt: now,
  };
}

export function medicineToSheetPayload(medicine) {
  return {
    RecordId: medicine.healthRecordId,
    StudentId: medicine.studentId,
    MedicineName: medicine.medicineGiven || '',
    Dosage: medicine.treatmentDoses || '',
    DoseAmount: medicine.doseAmount || '',
    DoseUnit: medicine.doseUnit || '',
    FoodTiming: medicine.foodTiming || '',
    ScheduleJson: JSON.stringify(medicine.schedule || {}),
    SchedulePreset: medicine.schedulePreset || 'custom',
    MedicineNotes: medicine.medicineNotes || medicine.ingestionNotes || '',
    StartDate: medicine.startDate || '',
    EndDate: medicine.endDate || '',
  };
}

export function sheetRowToAttachment(row) {
  const attachmentId = String(row.AttachmentId ?? '').trim();
  const now = new Date().toISOString();

  return {
    ...createSyncBase({
      localId: attachmentId,
      cloudId: attachmentId,
      syncStatus: String(row.SyncStatus ?? 'pending').trim() || 'pending',
    }),
    schoolId: SCHOOL_ID,
    healthRecordId: String(row.RecordId ?? '').trim(),
    studentId: String(row.StudentId ?? '').trim(),
    fileName: String(row.FileName ?? '').trim(),
    driveFileId: String(row.DriveFileId ?? '').trim() || null,
    driveWebViewLink: String(row.DriveWebViewLink ?? '').trim(),
    driveThumbnailLink: '',
    previewDataUrl: String(row.PreviewDataUrl ?? '').trim(),
    uploadError: String(row.UploadError ?? '').trim(),
    uploadedAt: row.UploadedAt || null,
    mimeType: 'image/jpeg',
    updatedAt: now,
  };
}

export function attachmentToSheetPayload(attachment) {
  return {
    RecordId: attachment.healthRecordId,
    StudentId: attachment.studentId,
    FileName: attachment.fileName || '',
    DriveFileId: attachment.driveFileId || '',
    DriveWebViewLink: attachment.driveWebViewLink || '',
    SyncStatus: attachment.syncStatus || 'pending',
    UploadError: attachment.uploadError || '',
    UploadedAt: attachment.uploadedAt || '',
    PreviewDataUrl: attachment.previewDataUrl || '',
  };
}

export function attachmentUpdateToSheet(attachmentId, patch) {
  const out = { attachmentId: String(attachmentId) };
  if (patch.driveFileId !== undefined) out.DriveFileId = patch.driveFileId || '';
  if (patch.driveWebViewLink !== undefined) out.DriveWebViewLink = patch.driveWebViewLink || '';
  if (patch.syncStatus !== undefined) out.SyncStatus = patch.syncStatus;
  if (patch.uploadError !== undefined) out.UploadError = patch.uploadError || '';
  if (patch.uploadedAt !== undefined) out.UploadedAt = patch.uploadedAt || '';
  if (patch.previewDataUrl !== undefined) out.PreviewDataUrl = patch.previewDataUrl || '';
  return out;
}
