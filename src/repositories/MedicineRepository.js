import { BaseRepository } from './BaseRepository';
import { TABLES } from '../utils/constants';

export class MedicineRepository extends BaseRepository {
  constructor(provider) {
    super(provider, TABLES.MEDICINES);
  }

  async getByStudent(studentId) {
    return this.filter({ studentId });
  }

  async getByHealthRecord(healthRecordId) {
    const items = await this.filter({ healthRecordId });
    return items[0] || null;
  }

  async getByHealthRecords(recordIds) {
    if (!recordIds?.length) return [];
    const items = await this.getAll();
    return items.filter((m) => recordIds.includes(m.healthRecordId));
  }
}
