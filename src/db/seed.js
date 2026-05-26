import { CURRENT_SEED_VERSION, SEED_VERSION_KEY } from '../utils/constants';
import { buildSeedData } from './seedData';

export async function runSeedIfNeeded(provider, settingsRepo) {
  const current = await settingsRepo.get(SEED_VERSION_KEY);
  if (current === CURRENT_SEED_VERSION) return false;

  const { students, healthRecords, medicines } = buildSeedData();

  await provider.bulkPut('students', students);
  await provider.bulkPut('healthRecords', healthRecords);
  await provider.bulkPut('medicines', medicines);
  await settingsRepo.set(SEED_VERSION_KEY, CURRENT_SEED_VERSION);

  return true;
}
