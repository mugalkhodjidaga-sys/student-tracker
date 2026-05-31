import { normalizeName } from '../utils/syncHelpers';
import {
  sheetRowToStudent,
  studentToSheetPayload,
} from '../utils/sheetMappers';
import { sheetsApiClient, SheetsApiError } from '../services/sheetsApiClient';

/** In-memory cache — refreshed on getAll / mutations. */
let cache = [];
let cacheAt = 0;
const CACHE_TTL_MS = 30_000;

export class SheetsStudentRepository {
  constructor(apiClient = sheetsApiClient) {
    this.api = apiClient;
  }

  async _refresh(force = false) {
    const stale = Date.now() - cacheAt > CACHE_TTL_MS;
    if (!force && cache.length && !stale) return cache;

    const rows = await this.api.getStudents();
    cache = rows.map(sheetRowToStudent).filter((s) => s.localId && s.name);
    cacheAt = Date.now();
    return cache;
  }

  invalidateCache() {
    cache = [];
    cacheAt = 0;
  }

  async getAll() {
    const students = await this._refresh(true);
    return [...students].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  async getById(id) {
    const students = await this._refresh();
    return students.find((s) => s.localId === String(id)) || null;
  }

  async findByAdmissionNumber(admissionNumber) {
    if (!admissionNumber?.trim()) return null;
    const students = await this._refresh();
    const q = admissionNumber.trim().toLowerCase();
    return (
      students.find(
        (s) =>
          s.admissionNumber?.trim().toLowerCase() === q ||
          s.localId?.trim().toLowerCase() === q
      ) || null
    );
  }

  async findByName(name) {
    const normalized = normalizeName(name);
    if (!normalized) return null;
    const students = await this._refresh();
    return students.find((s) => normalizeName(s.name) === normalized) || null;
  }

  async searchStudents(query) {
    const q = (query || '').trim().toLowerCase();
    const students = await this._refresh();
    if (!q) return students;

    return students.filter((s) =>
      ['name', 'admissionNumber', 'className', 'roomNumber', 'guardianName'].some(
        (field) => s[field] && String(s[field]).toLowerCase().includes(q)
      )
    );
  }

  async add(data) {
    const payload = studentToSheetPayload(data);
    const result = await this.api.addStudent(payload);
    const studentId = String(result.studentId ?? result.StudentId ?? '');

    const student = {
      ...data,
      localId: studentId,
      cloudId: studentId,
      admissionNumber: studentId,
      syncStatus: 'synced',
      updatedAt: new Date().toISOString(),
    };

    this.invalidateCache();
    return student;
  }

  async update(id, patch) {
    const existing = await this.getById(id);
    if (!existing) return null;

    const merged = { ...existing, ...patch, updatedAt: new Date().toISOString() };

    try {
      await this.api.updateStudent(String(id), studentToSheetPayload(merged));
    } catch (err) {
      if (err instanceof SheetsApiError && err.message.includes('Invalid action')) {
        throw new SheetsApiError(
          'Student update is not deployed yet. Add updateStudent to Apps Script and redeploy.',
          { action: 'updateStudent' }
        );
      }
      throw err;
    }

    this.invalidateCache();
    return merged;
  }

  async delete(id) {
    this.invalidateCache();
    throw new Error('Delete student via Sheets is not available yet.');
  }
}
