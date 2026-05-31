import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { indexedDBProvider } from './storage/IndexedDBProvider';
import { StudentRepository } from '../repositories/StudentRepository';
import { SheetsStudentRepository } from '../repositories/SheetsStudentRepository';
import { USE_SHEETS_DB } from '../config/sheetsApi';
import { HealthRecordRepository } from '../repositories/HealthRecordRepository';
import { MedicineRepository } from '../repositories/MedicineRepository';
import { SheetsHealthRecordRepository } from '../repositories/SheetsHealthRecordRepository';
import { SheetsMedicineRepository } from '../repositories/SheetsMedicineRepository';
import { SheetsAttachmentRepository } from '../repositories/SheetsAttachmentRepository';
import { MedicineCatalogRepository } from '../repositories/MedicineCatalogRepository';
import { SettingsRepository } from '../repositories/SettingsRepository';
import { createStudentService } from '../services/studentService';
import { createHealthRecordService } from '../services/healthRecordService';
import { createMedicineService } from '../services/medicineService';
import { createMedicineCatalogService } from '../services/medicineCatalogService';
import { createVisitEntryService } from '../services/visitEntryService';
import { createDashboardService } from '../services/dashboardService';
import { createReportService } from '../services/reportService';
import { AttachmentRepository } from '../repositories/AttachmentRepository';
import { createAttachmentService } from '../services/attachmentService';
import { googleAuthService } from '../services/googleAuthService';
import { googleDriveService } from '../services/googleDriveService';
import { createBackupService } from '../services/backupService';
import { runCatalogSeedIfNeeded } from '../db/catalogSeed';
import { runSeedIfNeeded } from '../db/seed';

import { SJM_IMAGES } from '../utils/branding';

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const api = useMemo(() => {
    const provider = indexedDBProvider;
    const studentRepository = USE_SHEETS_DB
      ? new SheetsStudentRepository()
      : new StudentRepository(provider);
    const healthRecordRepository = USE_SHEETS_DB
      ? new SheetsHealthRecordRepository()
      : new HealthRecordRepository(provider);
    const medicineRepository = USE_SHEETS_DB
      ? new SheetsMedicineRepository()
      : new MedicineRepository(provider);
    const medicineCatalogRepository = new MedicineCatalogRepository(provider);
    const attachmentRepository = USE_SHEETS_DB
      ? new SheetsAttachmentRepository()
      : new AttachmentRepository(provider);
    const settingsRepository = new SettingsRepository(provider);

    const attachmentService = createAttachmentService(
      attachmentRepository,
      googleDriveService,
      googleAuthService
    );

    const studentService = createStudentService(studentRepository);
    const medicineService = createMedicineService(medicineRepository);
    const medicineCatalogService = createMedicineCatalogService(
      medicineCatalogRepository
    );
    const healthRecordService = createHealthRecordService(
      healthRecordRepository,
      medicineRepository,
      studentRepository,
      attachmentRepository
    );
    const visitEntryService = createVisitEntryService(
      studentService,
      healthRecordService,
      medicineService,
      medicineCatalogService,
      attachmentService
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
      medicineCatalogRepository,
      attachmentRepository,
      settingsRepository,
      studentService,
      healthRecordService,
      medicineService,
      medicineCatalogService,
      attachmentService,
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
        await runCatalogSeedIfNeeded(api.provider, api.settingsRepository);
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
