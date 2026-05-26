import { SCHOOL_ID } from '../utils/constants';

export function createMedicineService(medicineRepo) {
  return {
    async create(medicineData) {
      return medicineRepo.add({
        schoolId: SCHOOL_ID,
        isCompleted: false,
        ...medicineData,
      });
    },

    async getByStudent(studentId) {
      return medicineRepo.getByStudent(studentId);
    },
  };
}
