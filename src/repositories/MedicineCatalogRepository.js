import { BaseRepository } from './BaseRepository';
import { TABLES } from '../utils/constants';
import { normalizeName } from '../utils/syncHelpers';

export class MedicineCatalogRepository extends BaseRepository {
  constructor(provider) {
    super(provider, TABLES.MEDICINE_CATALOG);
  }

  async findByName(name) {
    const normalized = normalizeName(name);
    if (!normalized) return null;
    const items = await this.getAll();
    const matches = items.filter((m) => normalizeName(m.name) === normalized);
    if (!matches.length) return null;
    return matches.sort((a, b) => (b.useCount || 0) - (a.useCount || 0))[0];
  }

  /** One entry per medicine name — keeps highest useCount when duplicates exist. */
  dedupeByName(items) {
    const byName = new Map();
    for (const item of items) {
      const key = normalizeName(item.name);
      if (!key) continue;
      const existing = byName.get(key);
      if (!existing || (item.useCount || 0) > (existing.useCount || 0)) {
        byName.set(key, item);
      }
    }
    return [...byName.values()];
  }

  async search(query, issueTypes = []) {
    const q = (query || '').trim().toLowerCase();
    let items = await this.getAll();

    if (issueTypes.length > 0) {
      const selected = new Set(issueTypes.map((t) => t.toLowerCase()));
      items = items.filter((m) =>
        m.issueTypes?.some((t) => selected.has(t.toLowerCase()))
      );
    }

    if (q) {
      items = items.filter((m) => m.name.toLowerCase().includes(q));
    }

    items = this.dedupeByName(items);

    return items.sort((a, b) => (b.useCount || 0) - (a.useCount || 0));
  }

  async incrementUseCount(localId) {
    const item = await this.getById(localId);
    if (!item) return null;
    return this.update(localId, { useCount: (item.useCount || 0) + 1 });
  }
}
