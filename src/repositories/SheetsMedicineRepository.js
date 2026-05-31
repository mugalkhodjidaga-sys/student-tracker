import {
  sheetRowToMedicine,
  medicineToSheetPayload,
} from '../utils/sheetMappers';
import { sheetsApiClient } from '../services/sheetsApiClient';

let cache = [];
let cacheAt = 0;
const CACHE_TTL_MS = 20_000;

export class SheetsMedicineRepository {
  constructor(apiClient = sheetsApiClient) {
    this.api = apiClient;
  }

  async _refresh(force = false) {
    const stale = Date.now() - cacheAt > CACHE_TTL_MS;
    if (!force && cache.length && !stale) return cache;

    const rows = await this.api.getMedicines();
    cache = rows.map(sheetRowToMedicine).filter((m) => m.localId);
    cacheAt = Date.now();
    return cache;
  }

  invalidateCache() {
    cache = [];
    cacheAt = 0;
  }

  async getAll() {
    const medicines = await this._refresh(true);
    return [...medicines].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  async getById(id) {
    const medicines = await this._refresh();
    return medicines.find((m) => m.localId === String(id)) || null;
  }

  async getByStudent(studentId) {
    const medicines = await this._refresh();
    return medicines.filter((m) => m.studentId === String(studentId));
  }

  async getByHealthRecord(healthRecordId) {
    const medicines = await this._refresh();
    return medicines.filter((m) => m.healthRecordId === String(healthRecordId));
  }

  async getByHealthRecords(recordIds) {
    if (!recordIds?.length) return [];
    const medicines = await this._refresh();
    const idSet = new Set(recordIds.map(String));
    return medicines.filter((m) => idSet.has(m.healthRecordId));
  }

  async add(data) {
    const result = await this.api.addMedicine(medicineToSheetPayload(data));
    const medicineId = String(result.medicineId ?? '');

    const medicine = {
      ...data,
      localId: medicineId,
      cloudId: medicineId,
      syncStatus: 'synced',
      updatedAt: new Date().toISOString(),
    };

    this.invalidateCache();
    return medicine;
  }

  async update(id, patch) {
    throw new Error('Update medicine via Sheets is not available yet.');
  }

  async delete(id) {
    throw new Error('Delete medicine via Sheets is not available yet.');
  }

  async filter(criteria = {}) {
    const medicines = await this._refresh();
    return medicines.filter((item) =>
      Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === '' || value === null) return true;
        return item[key] === value;
      })
    );
  }
}
