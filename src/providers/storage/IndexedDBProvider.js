import { StorageProvider } from './StorageProvider';
import db from '../../db/dexieDb';
import { TABLES } from '../../utils/constants';
import { createSyncBase, touchRecord } from '../../utils/syncHelpers';

const ALL_TABLES = [
  TABLES.STUDENTS,
  TABLES.HEALTH_RECORDS,
  TABLES.MEDICINES,
  TABLES.MEDICINE_CATALOG,
  TABLES.ATTACHMENTS,
  TABLES.SETTINGS,
];

export class IndexedDBProvider extends StorageProvider {
  getTable(table) {
    if (!db[table]) {
      throw new Error(`Unknown table: ${table}`);
    }
    return db[table];
  }

  async getAll(table) {
    return this.getTable(table).toArray();
  }

  async getById(table, id) {
    const key = table === TABLES.SETTINGS ? id : id;
    if (table === TABLES.SETTINGS) {
      return this.getTable(table).get(key);
    }
    return this.getTable(table).get(key);
  }

  async add(table, item) {
    const record =
      table === TABLES.SETTINGS
        ? item
        : { ...createSyncBase(), ...item };

    if (table === TABLES.SETTINGS) {
      await this.getTable(table).put(record);
      return record;
    }

    await this.getTable(table).put(record);
    return record;
  }

  async update(table, id, patch) {
    if (table === TABLES.SETTINGS) {
      const existing = await this.getById(table, id);
      const updated = { ...existing, ...patch, key: id };
      await this.getTable(table).put(updated);
      return updated;
    }

    const existing = await this.getById(table, id);
    if (!existing) return null;

    const updated = touchRecord(existing, patch);
    await this.getTable(table).put(updated);
    return updated;
  }

  async delete(table, id) {
    await this.getTable(table).delete(id);
  }

  async bulkPut(table, items) {
    await this.getTable(table).bulkPut(items);
  }

  async clearTable(table) {
    await this.getTable(table).clear();
  }

  async clearAll() {
    await Promise.all(ALL_TABLES.map((t) => this.clearTable(t)));
  }

  async exportAll() {
    const [students, healthRecords, medicines, medicineCatalog, settings] =
      await Promise.all([
      this.getAll(TABLES.STUDENTS),
      this.getAll(TABLES.HEALTH_RECORDS),
      this.getAll(TABLES.MEDICINES),
      this.getAll(TABLES.MEDICINE_CATALOG),
      this.getAll(TABLES.SETTINGS),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      students,
      healthRecords,
      medicines,
      medicineCatalog,
      settings,
    };
  }

  async importAll(data) {
    if (data.students?.length) {
      await this.bulkPut(TABLES.STUDENTS, data.students);
    }
    if (data.healthRecords?.length) {
      await this.bulkPut(TABLES.HEALTH_RECORDS, data.healthRecords);
    }
    if (data.medicines?.length) {
      await this.bulkPut(TABLES.MEDICINES, data.medicines);
    }
    if (data.medicineCatalog?.length) {
      await this.bulkPut(TABLES.MEDICINE_CATALOG, data.medicineCatalog);
    }
    if (data.settings?.length) {
      await this.bulkPut(TABLES.SETTINGS, data.settings);
    }
  }
}

export const indexedDBProvider = new IndexedDBProvider();
