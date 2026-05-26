import { v4 as uuidv4 } from 'uuid';

export const SYNC_STATUS = {
  LOCAL: 'local',
  SYNCED: 'synced',
  PENDING: 'pending',
  FAILED: 'failed',
};

export function createSyncBase(overrides = {}) {
  const now = new Date().toISOString();
  return {
    localId: uuidv4(),
    cloudId: null,
    createdAt: now,
    updatedAt: now,
    syncStatus: SYNC_STATUS.LOCAL,
    ...overrides,
  };
}

export function touchRecord(record, patch = {}) {
  return {
    ...record,
    ...patch,
    updatedAt: new Date().toISOString(),
    syncStatus: SYNC_STATUS.LOCAL,
  };
}

export function normalizeName(name) {
  return (name || '').trim().toLowerCase().replace(/\s+/g, ' ');
}
