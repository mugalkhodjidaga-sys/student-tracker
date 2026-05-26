/**
 * Abstract storage provider — swap IndexedDBProvider for ApiProvider later.
 */
export class StorageProvider {
  async getAll(table) {
    throw new Error('getAll not implemented');
  }

  async getById(table, id) {
    throw new Error('getById not implemented');
  }

  async add(table, item) {
    throw new Error('add not implemented');
  }

  async update(table, id, patch) {
    throw new Error('update not implemented');
  }

  async delete(table, id) {
    throw new Error('delete not implemented');
  }

  async bulkPut(table, items) {
    throw new Error('bulkPut not implemented');
  }

  async clearTable(table) {
    throw new Error('clearTable not implemented');
  }

  async clearAll() {
    throw new Error('clearAll not implemented');
  }

  async exportAll() {
    throw new Error('exportAll not implemented');
  }

  async importAll(data) {
    throw new Error('importAll not implemented');
  }
}
