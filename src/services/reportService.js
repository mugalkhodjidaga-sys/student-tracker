import { daysAgo } from '../utils/dateHelpers';

export function createReportService(healthRepo, studentRepo, healthRecordService) {
  return {
    async getReports() {
      const [records, students] = await Promise.all([
        healthRepo.getAll(),
        studentRepo.getAll(),
      ]);

      const studentMap = Object.fromEntries(
        students.map((s) => [s.localId, s])
      );

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentRecords = records.filter(
        (r) => new Date(r.visitDate) >= thirtyDaysAgo
      );

      const sickStudentIds = new Set(recentRecords.map((r) => r.studentId));

      const symptomCounts = {};
      recentRecords.forEach((r) => {
        const key = (r.issueType || 'Unknown').trim();
        symptomCounts[key] = (symptomCounts[key] || 0) + 1;
      });

      const topSymptoms = Object.entries(symptomCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([symptom, count]) => ({ symptom, count }));

      const visitCountByStudent = {};
      recentRecords.forEach((r) => {
        visitCountByStudent[r.studentId] =
          (visitCountByStudent[r.studentId] || 0) + 1;
      });

      const repeatIllness = Object.entries(visitCountByStudent)
        .filter(([, count]) => count >= 2)
        .map(([studentId, count]) => ({
          student: studentMap[studentId],
          count,
        }))
        .filter((x) => x.student);

      const recentIllnesses = await healthRecordService.getRecent(10);

      return {
        sickStudentsCount: sickStudentIds.size,
        topSymptoms,
        recentIllnesses,
        repeatIllness,
      };
    },
  };
}
