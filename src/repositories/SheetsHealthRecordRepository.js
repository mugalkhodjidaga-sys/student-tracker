import { SEVERITY } from '../utils/constants';
import { isToday } from '../utils/dateHelpers';
import {
  sheetRowToHealthRecord,
  healthRecordToSheetPayload,
} from '../utils/sheetMappers';
import { sheetsApiClient } from '../services/sheetsApiClient';

let cache = [];
let cacheAt = 0;
const CACHE_TTL_MS = 20_000;

export class SheetsHealthRecordRepository {
  constructor(apiClient = sheetsApiClient) {
    this.api = apiClient;
  }

  async _refresh(force = false) {
    const stale = Date.now() - cacheAt > CACHE_TTL_MS;
    if (!force && cache.length && !stale) return cache;

    const rows = await this.api.getHealthRecords();
    cache = rows.map(sheetRowToHealthRecord).filter((r) => r.localId);
    cacheAt = Date.now();
    return cache;
  }

  invalidateCache() {
    cache = [];
    cacheAt = 0;
  }

  async getAll() {
    const records = await this._refresh(true);
    return [...records].sort(
      (a, b) => new Date(b.visitDate) - new Date(a.visitDate)
    );
  }

  async getById(id) {
    const records = await this._refresh();
    return records.find((r) => r.localId === String(id)) || null;
  }

  async getByStudent(studentId) {
    const records = await this._refresh();
    return records
      .filter((r) => r.studentId === String(studentId))
      .sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  }

  async getRecent(limit = 50) {
    const records = await this.getAll();
    return records.slice(0, limit);
  }

  async getUrgent(days = 7) {
    const records = await this.getAll();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    return records.filter(
      (r) =>
        r.severity === SEVERITY.URGENT &&
        new Date(r.visitDate) >= cutoff
    );
  }

  async getTodayRecords() {
    const records = await this.getAll();
    return records.filter((r) => isToday(r.visitDate));
  }

  async add(data) {
    const result = await this.api.addHealthRecord(healthRecordToSheetPayload(data));
    const recordId = String(result.recordId ?? '');

    const record = {
      ...data,
      localId: recordId,
      cloudId: recordId,
      syncStatus: 'synced',
      updatedAt: new Date().toISOString(),
    };

    this.invalidateCache();
    return record;
  }

  async update(id, patch) {
    throw new Error('Update health record via Sheets is not available yet.');
  }

  async delete(id) {
    throw new Error('Delete health record via Sheets is not available yet.');
  }

  async filter(criteria = {}) {
    const records = await this._refresh();
    return records.filter((item) =>
      Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === '' || value === null) return true;
        return item[key] === value;
      })
    );
  }
}
