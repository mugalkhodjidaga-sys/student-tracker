export function createBackupService(provider, settingsRepo) {
  return {
    async exportData() {
      return provider.exportAll();
    },

    async importData(data) {
      await provider.importAll(data);
    },

    async clearAll() {
      await provider.clearAll();
      await settingsRepo.set('seedVersion', null);
    },
  };
}
