export class BaseRepository {
  constructor(provider, tableName, idField = 'localId') {
    this.provider = provider;
    this.tableName = tableName;
    this.idField = idField;
  }

  async getAll() {
    const items = await this.provider.getAll(this.tableName);
    return items.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }

  async getById(id) {
    return this.provider.getById(this.tableName, id);
  }

  async add(data) {
    return this.provider.add(this.tableName, data);
  }

  async update(id, patch) {
    return this.provider.update(this.tableName, id, patch);
  }

  async delete(id) {
    return this.provider.delete(this.tableName, id);
  }

  async search(query, fields) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return this.getAll();

    const items = await this.getAll();
    return items.filter((item) =>
      fields.some((field) => {
        const val = item[field];
        return val && String(val).toLowerCase().includes(q);
      })
    );
  }

  async filter(criteria = {}) {
    const items = await this.getAll();
    return items.filter((item) =>
      Object.entries(criteria).every(([key, value]) => {
        if (value === undefined || value === '' || value === null) return true;
        return item[key] === value;
      })
    );
  }
}
