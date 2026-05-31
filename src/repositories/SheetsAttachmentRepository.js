import {
  sheetRowToAttachment,
  attachmentToSheetPayload,
  attachmentUpdateToSheet,
} from '../utils/sheetMappers';
import { pendingBlobStore } from '../utils/pendingBlobStore';
import { sheetsApiClient } from '../services/sheetsApiClient';

let cache = [];
let cacheAt = 0;
const CACHE_TTL_MS = 20_000;

export class SheetsAttachmentRepository {
  constructor(apiClient = sheetsApiClient) {
    this.api = apiClient;
  }

  async _refresh(force = false) {
    const stale = Date.now() - cacheAt > CACHE_TTL_MS;
    if (!force && cache.length && !stale) return cache;

    const rows = await this.api.getAttachments();
    cache = rows.map(sheetRowToAttachment).filter((a) => a.localId);
    cacheAt = Date.now();
    return cache;
  }

  invalidateCache() {
    cache = [];
    cacheAt = 0;
  }

  async getAll() {
    const attachments = await this._refresh(true);
    return attachments.map((a) => this._withLocalBlob(a));
  }

  _withLocalBlob(attachment) {
    const fullDataUrl = pendingBlobStore.get(attachment.localId);
    return fullDataUrl ? { ...attachment, fullDataUrl } : attachment;
  }

  async getById(id) {
    const attachments = await this._refresh();
    const found = attachments.find((a) => a.localId === String(id));
    return found ? this._withLocalBlob(found) : null;
  }

  async getByHealthRecord(healthRecordId) {
    const attachments = await this._refresh();
    return attachments
      .filter((a) => a.healthRecordId === String(healthRecordId))
      .map((a) => this._withLocalBlob(a))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async getByHealthRecords(recordIds) {
    if (!recordIds?.length) return [];
    const attachments = await this._refresh();
    const idSet = new Set(recordIds.map(String));
    return attachments
      .filter((a) => idSet.has(a.healthRecordId))
      .map((a) => this._withLocalBlob(a))
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  async getByStudent(studentId) {
    const attachments = await this._refresh();
    return attachments
      .filter((a) => a.studentId === String(studentId))
      .map((a) => this._withLocalBlob(a));
  }

  async getPendingSync() {
    const attachments = await this.getAll();
    return attachments.filter(
      (a) => a.syncStatus === 'pending' || a.syncStatus === 'failed'
    );
  }

  async add(data) {
    const { fullDataUrl, ...sheetData } = data;
    const preview = sheetData.previewDataUrl || '';

    // Keep thumbnail in sheet (small); full image in session until Drive upload
    const payload = attachmentToSheetPayload({
      ...sheetData,
      previewDataUrl: preview.slice(0, 45000),
    });

    const result = await this.api.addAttachment(payload);
    const attachmentId = String(result.attachmentId ?? '');

    if (fullDataUrl) {
      pendingBlobStore.set(attachmentId, fullDataUrl);
    }

    const attachment = {
      ...data,
      localId: attachmentId,
      cloudId: attachmentId,
      fullDataUrl: fullDataUrl || '',
      updatedAt: new Date().toISOString(),
    };

    this.invalidateCache();
    return attachment;
  }

  async update(id, patch) {
    const sheetPatch = attachmentUpdateToSheet(id, patch);
    await this.api.updateAttachment(id, sheetPatch);

    if (patch.fullDataUrl === '') {
      pendingBlobStore.remove(id);
    }

    this.invalidateCache();
    const updated = await this.getById(id);
    return updated || { localId: id, ...patch };
  }

  async delete(id) {
    pendingBlobStore.remove(id);
    this.invalidateCache();
    throw new Error('Delete attachment via Sheets is not available yet.');
  }

  async filter(criteria = {}) {
    const attachments = await this.getAll();
    return attachments.filter((item) =>
      Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === '' || value === null) return true;
        return item[key] === value;
      })
    );
  }
}
