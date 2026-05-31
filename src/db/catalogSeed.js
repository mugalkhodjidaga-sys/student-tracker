import { CURRENT_CATALOG_SEED_VERSION, CATALOG_SEED_VERSION_KEY } from '../utils/constants';
import { buildMedicineCatalogSeed } from './medicineCatalogSeed';

export async function runCatalogSeedIfNeeded(provider, settingsRepo) {
  const current = await settingsRepo.get(CATALOG_SEED_VERSION_KEY);
  if (current === CURRENT_CATALOG_SEED_VERSION) return false;

  const catalog = buildMedicineCatalogSeed();
  await provider.bulkPut('medicineCatalog', catalog);
  await settingsRepo.set(CATALOG_SEED_VERSION_KEY, CURRENT_CATALOG_SEED_VERSION);

  return true;
}
