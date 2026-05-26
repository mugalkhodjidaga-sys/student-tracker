import { SCHOOL_ID, HEALTH_STATUS } from '../utils/constants';

export function createStudentService(studentRepo) {
  return {
    async getAll() {
      return studentRepo.getAll();
    },

    async getById(id) {
      return studentRepo.getById(id);
    },

    async findByAdmissionNumber(num) {
      return studentRepo.findByAdmissionNumber(num);
    },

    async searchByName(query) {
      return studentRepo.searchStudents(query);
    },

    async search(query) {
      return studentRepo.searchStudents(query);
    },

    async upsertStudent(data) {
      let existing = null;

      if (data.localId) {
        existing = await studentRepo.getById(data.localId);
      }

      if (!existing && data.admissionNumber?.trim()) {
        existing = await studentRepo.findByAdmissionNumber(data.admissionNumber);
      }

      if (!existing && data.name?.trim()) {
        existing = await studentRepo.findByName(data.name);
      }

      const studentPayload = {
        schoolId: SCHOOL_ID,
        admissionNumber: data.admissionNumber?.trim() || '',
        name: data.name.trim(),
        age: Number(data.age),
        gender: data.gender,
        className: data.className.trim(),
        roomNumber: data.roomNumber.trim(),
        bloodGroup: data.bloodGroup,
        allergies: data.allergies?.trim() || '',
        guardianName: data.guardianName?.trim() || '',
        guardianPhone: data.guardianPhone?.trim() || '',
        admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
        healthStatus: data.healthStatus || HEALTH_STATUS.HEALTHY,
      };

      if (existing) {
        return studentRepo.update(existing.localId, studentPayload);
      }

      return studentRepo.add(studentPayload);
    },

    async updateHealthStatus(studentId, severity) {
      const status =
        severity === 'Urgent' || severity === 'Medium'
          ? HEALTH_STATUS.SICK
          : HEALTH_STATUS.RECOVERING;

      return studentRepo.update(studentId, { healthStatus: status });
    },

    async delete(id) {
      return studentRepo.delete(id);
    },
  };
}
