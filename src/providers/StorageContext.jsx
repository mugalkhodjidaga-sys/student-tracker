import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { indexedDBProvider } from './storage/IndexedDBProvider';
import { StudentRepository } from '../repositories/StudentRepository';
import { HealthRecordRepository } from '../repositories/HealthRecordRepository';
import { MedicineRepository } from '../repositories/MedicineRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { createStudentService } from '../services/studentService';
import { createHealthRecordService } from '../services/healthRecordService';
import { createMedicineService } from '../services/medicineService';
import { createVisitEntryService } from '../services/visitEntryService';
import { createDashboardService } from '../services/dashboardService';
import { createReportService } from '../services/reportService';
import { createBackupService } from '../services/backupService';
import { runSeedIfNeeded } from '../db/seed';
import { SJM_IMAGES } from '../utils/branding';

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const api = useMemo(() => {
    const provider = indexedDBProvider;
    const studentRepository = new StudentRepository(provider);
    const healthRecordRepository = new HealthRecordRepository(provider);
    const medicineRepository = new MedicineRepository(provider);
    const settingsRepository = new SettingsRepository(provider);

    const studentService = createStudentService(studentRepository);
    const medicineService = createMedicineService(medicineRepository);
    const healthRecordService = createHealthRecordService(
      healthRecordRepository,
      medicineRepository,
      studentRepository
    );
    const visitEntryService = createVisitEntryService(
      studentService,
      healthRecordService,
      medicineService
    );
    const dashboardService = createDashboardService(
      studentRepository,
      healthRecordRepository,
      healthRecordService
    );
    const reportService = createReportService(
      healthRecordRepository,
      studentRepository,
      healthRecordService
    );
    const backupService = createBackupService(provider, settingsRepository);

    return {
      provider,
      studentRepository,
      healthRecordRepository,
      medicineRepository,
      settingsRepository,
      studentService,
      healthRecordService,
      medicineService,
      visitEntryService,
      dashboardService,
      reportService,
      backupService,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await runSeedIfNeeded(api.provider, api.settingsRepository);
        if (!cancelled) setReady(true);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to initialize database');
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [api]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-urgent text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <img
            src={SJM_IMAGES.logo}
            alt=""
            className="mx-auto h-16 w-16 rounded-full border-2 border-emerald-700 object-cover"
          />
          <div className="mx-auto mt-4 h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-slate-600">Loading health records…</p>
        </div>
      </div>
    );
  }

  return (
    <StorageContext.Provider value={api}>{children}</StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) {
    throw new Error('useStorage must be used within StorageProvider');
  }
  return ctx;
}
