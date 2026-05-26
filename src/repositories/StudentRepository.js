import { BaseRepository } from './BaseRepository';
import { TABLES } from '../utils/constants';
import { normalizeName } from '../utils/syncHelpers';

export class StudentRepository extends BaseRepository {
  constructor(provider) {
    super(provider, TABLES.STUDENTS);
  }

  async findByAdmissionNumber(admissionNumber) {
    if (!admissionNumber?.trim()) return null;
    const items = await this.getAll();
    const q = admissionNumber.trim().toLowerCase();
    return (
      items.find(
        (s) => s.admissionNumber?.trim().toLowerCase() === q
      ) || null
    );
  }

  async findByName(name) {
    const normalized = normalizeName(name);
    if (!normalized) return null;
    const items = await this.getAll();
    return items.find((s) => normalizeName(s.name) === normalized) || null;
  }

  async searchStudents(query) {
    return this.search(query, [
      'name',
      'admissionNumber',
      'className',
      'roomNumber',
      'guardianName',
    ]);
  }
}
