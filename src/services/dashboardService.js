import { SEVERITY } from '../utils/constants';
import { isToday } from '../utils/dateHelpers';

export function createDashboardService(
  studentRepo,
  healthRepo,
  healthRecordService
) {
  return {
    async getStats() {
      const [students, records, urgent] = await Promise.all([
        studentRepo.getAll(),
        healthRepo.getAll(),
        healthRepo.getUrgent(7),
      ]);

      const todayRecords = records.filter((r) => isToday(r.visitDate));
      const sickStudentIds = new Set(todayRecords.map((r) => r.studentId));

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recordsThisWeek = records.filter(
        (r) => new Date(r.visitDate) >= weekAgo
      );

      const recent = await healthRecordService.getRecent(5);

      return {
        totalStudents: students.length,
        sickToday: sickStudentIds.size,
        urgentCount: urgent.length,
        recordsThisWeek: recordsThisWeek.length,
        urgentAlerts: await healthRecordService.getRecent(10).then((items) =>
          items.filter((i) => i.severity === SEVERITY.URGENT).slice(0, 5)
        ),
        recentEntries: recent,
      };
    },
  };
}
