import { TABLES } from '../utils/constants';

export class SettingsRepository {
  constructor(provider) {
    this.provider = provider;
    this.tableName = TABLES.SETTINGS;
  }

  async get(key) {
    const row = await this.provider.getById(this.tableName, key);
    return row?.value ?? null;
  }

  async set(key, value) {
    await this.provider.add(this.tableName, { key, value });
    return value;
  }
}
