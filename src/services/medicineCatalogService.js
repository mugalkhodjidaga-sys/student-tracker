import { SCHOOL_ID, FOOD_TIMING } from '../utils/constants';
import { normalizeName } from '../utils/syncHelpers';
import { formatDoseDisplay } from '../utils/medicineHelpers';

export function createMedicineCatalogService(catalogRepo) {
  return {
    async getSuggestions(query, issueTypes = [], limit = 10) {
      const items = await catalogRepo.search(query, issueTypes);
      return items.slice(0, limit);
    },

    async getByIssueTypes(issueTypes, limit = 8) {
      if (!issueTypes?.length) return catalogRepo.getAll().then((all) => all.slice(0, limit));
      return catalogRepo.search('', issueTypes).then((items) => items.slice(0, limit));
    },

    async recordUsage(payload) {
      const name = payload.medicineGiven?.trim();
      if (!name) return null;

      let existing = await catalogRepo.findByName(name);

      const catalogData = {
        schoolId: SCHOOL_ID,
        name,
        issueTypes: payload.issueTypes || existing?.issueTypes || [],
        defaultDoseAmount: payload.doseAmount || '1',
        defaultDoseUnit: payload.doseUnit || 'tablet',
        defaultFoodTiming: payload.foodTiming || FOOD_TIMING.AFTER_FOOD,
        defaultSchedule: payload.schedule || existing?.defaultSchedule,
        isCustom: !existing || existing.isCustom,
      };

      if (existing) {
        return catalogRepo.update(existing.localId, {
          ...catalogData,
          useCount: (existing.useCount || 0) + 1,
        });
      }

      return catalogRepo.add({
        ...catalogData,
        useCount: 1,
        isCustom: true,
      });
    },

    async applyCatalogDefaults(catalogItem) {
      if (!catalogItem) return null;
      return {
        medicineGiven: catalogItem.name,
        doseAmount: catalogItem.defaultDoseAmount || '1',
        doseUnit: catalogItem.defaultDoseUnit || 'tablet',
        foodTiming: catalogItem.defaultFoodTiming || FOOD_TIMING.AFTER_FOOD,
        schedule: catalogItem.defaultSchedule
          ? { ...catalogItem.defaultSchedule }
          : { morning: true, noon: false, evening: true, night: false },
        treatmentDoses: formatDoseDisplay(
          catalogItem.defaultDoseAmount,
          catalogItem.defaultDoseUnit
        ),
      };
    },
  };
}
