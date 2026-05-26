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
        const parts = (r.issueType || 'Unknown')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        parts.forEach((key) => {
          symptomCounts[key] = (symptomCounts[key] || 0) + 1;
        });
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

      const severityBreakdown = { Normal: 0, Medium: 0, Urgent: 0 };
      recentRecords.forEach((r) => {
        if (severityBreakdown[r.severity] !== undefined) {
          severityBreakdown[r.severity] += 1;
        }
      });

      const visitsByDay = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
        const count = recentRecords.filter((r) => r.visitDate === key).length;
        visitsByDay.push({ label, value: count, date: key });
      }

      const totalVisits30 = recentRecords.length;

      return {
        sickStudentsCount: sickStudentIds.size,
        totalVisits30,
        topSymptoms,
        recentIllnesses,
        repeatIllness,
        severityBreakdown,
        visitsByDay,
      };
    },
  };
}
