import { BaseRepository } from './BaseRepository';
import { TABLES } from '../utils/constants';

export class AttachmentRepository extends BaseRepository {
  constructor(provider) {
    super(provider, TABLES.ATTACHMENTS);
  }

  async getByHealthRecord(healthRecordId) {
    const items = await this.filter({ healthRecordId });
    return items.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }

  async getByHealthRecords(recordIds) {
    if (!recordIds?.length) return [];
    const items = await this.getAll();
    return items
      .filter((a) => recordIds.includes(a.healthRecordId))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async getByStudent(studentId) {
    const items = await this.filter({ studentId });
    return items.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  async getPendingSync() {
    const items = await this.getAll();
    return items.filter(
      (a) => a.syncStatus === 'pending' || a.syncStatus === 'failed'
    );
  }
}
