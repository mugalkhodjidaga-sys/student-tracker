import { CURRENT_CATALOG_SEED_VERSION, CATALOG_SEED_VERSION_KEY, TABLES } from '../utils/constants';
import { buildMedicineCatalogSeed } from './medicineCatalogSeed';

export async function runCatalogSeedIfNeeded(provider, settingsRepo) {
  const current = await settingsRepo.get(CATALOG_SEED_VERSION_KEY);
  if (current === CURRENT_CATALOG_SEED_VERSION) return false;

  await provider.clearTable(TABLES.MEDICINE_CATALOG);
  const catalog = buildMedicineCatalogSeed();
  await provider.bulkPut(TABLES.MEDICINE_CATALOG, catalog);
  await settingsRepo.set(CATALOG_SEED_VERSION_KEY, CURRENT_CATALOG_SEED_VERSION);

  return true;
}
