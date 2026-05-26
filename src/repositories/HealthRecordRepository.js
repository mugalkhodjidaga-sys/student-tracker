import { BaseRepository } from './BaseRepository';
import { TABLES } from '../utils/constants';
import { SEVERITY } from '../utils/constants';
import { isToday } from '../utils/dateHelpers';

export class HealthRecordRepository extends BaseRepository {
  constructor(provider) {
    super(provider, TABLES.HEALTH_RECORDS);
  }

  async getByStudent(studentId) {
    const items = await this.filter({ studentId });
    return items.sort(
      (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
    );
  }

  async getRecent(limit = 50) {
    const items = await this.getAll();
    return items
      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
      .slice(0, limit);
  }

  async getUrgent(days = 7) {
    const items = await this.getAll();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return items.filter(
      (r) =>
        r.severity === SEVERITY.URGENT &&
        new Date(r.visitDate) >= cutoff
    );
  }

  async getTodayRecords() {
    const items = await this.getAll();
    return items.filter((r) => isToday(r.visitDate));
  }
}
