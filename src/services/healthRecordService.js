import { SCHOOL_ID } from '../utils/constants';
import { formatDisplayDate } from '../utils/dateHelpers';

function attachMedicines(records, medicines) {
  return records.map((record) => ({
    ...record,
    medicines: medicines.filter((m) => m.healthRecordId === record.localId),
    medicine: medicines.find((m) => m.healthRecordId === record.localId) || null,
  }));
}

function attachPhotos(records, attachments) {
  return records.map((record) => ({
    ...record,
    attachments: attachments.filter((a) => a.healthRecordId === record.localId),
  }));
}

export function createHealthRecordService(
  healthRepo,
  medicineRepo,
  studentRepo,
  attachmentRepo
) {
  return {
    async getByStudent(studentId) {
      const records = await healthRepo.getByStudent(studentId);
      const recordIds = records.map((r) => r.localId);
      const [medicines, attachments] = await Promise.all([
        medicineRepo.getByHealthRecords(recordIds),
        attachmentRepo.getByHealthRecords(recordIds),
      ]);

      return attachPhotos(
        attachMedicines(records, medicines),
        attachments
      );
    },

    async getStudentVisitSummary(studentId) {
      const history = await this.getByStudent(studentId);
      const count = history.length;

      if (count === 0) {
        return { count: 0, lastVisit: null, lastIssue: null };
      }

      const last = history[0];
      return {
        count,
        lastVisit: last.visitDate,
        lastIssue: last.issueType,
        lastFormatted: formatDisplayDate(last.visitDate),
      };
    },

    async getRecent(limit = 50) {
      const records = await healthRepo.getRecent(limit);
      const recordIds = records.map((r) => r.localId);
      const students = await studentRepo.getAll();
      const studentMap = Object.fromEntries(
        students.map((s) => [s.localId, s])
      );
      const [medicines, attachments] = await Promise.all([
        medicineRepo.getAll().then((all) =>
          all.filter((m) => recordIds.includes(m.healthRecordId))
        ),
        attachmentRepo.getByHealthRecords(recordIds),
      ]);

      return attachPhotos(
        attachMedicines(records, medicines),
        attachments
      ).map((r) => ({
        ...r,
        student: studentMap[r.studentId],
      }));
    },

    async getUrgent() {
      return healthRepo.getUrgent();
    },

    async getTodaySick() {
      const today = await healthRepo.getTodayRecords();
      const studentIds = [...new Set(today.map((r) => r.studentId))];
      return studentIds.length;
    },

    async create(recordData) {
      return healthRepo.add({
        schoolId: SCHOOL_ID,
        ...recordData,
      });
    },
  };
}
