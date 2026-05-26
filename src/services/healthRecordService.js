import { SCHOOL_ID } from '../utils/constants';
import { formatDisplayDate } from '../utils/dateHelpers';

export function createHealthRecordService(healthRepo, medicineRepo, studentRepo) {
  return {
    async getByStudent(studentId) {
      const records = await healthRepo.getByStudent(studentId);
      const medicines = await medicineRepo.getByHealthRecords(
        records.map((r) => r.localId)
      );

      return records.map((record) => ({
        ...record,
        medicine:
          medicines.find((m) => m.healthRecordId === record.localId) || null,
      }));
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
      const students = await studentRepo.getAll();
      const studentMap = Object.fromEntries(
        students.map((s) => [s.localId, s])
      );
      const medicines = await medicineRepo.getAll();

      return records.map((r) => ({
        ...r,
        student: studentMap[r.studentId],
        medicine:
          medicines.find((m) => m.healthRecordId === r.localId) || null,
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
