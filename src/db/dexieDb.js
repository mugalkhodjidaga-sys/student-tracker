import Dexie from 'dexie';
import { TABLES } from '../utils/constants';

export const db = new Dexie('AshramHealthDB');

db.version(1).stores({
  [TABLES.STUDENTS]:
    'localId, schoolId, admissionNumber, name, className, roomNumber, healthStatus, updatedAt',
  [TABLES.HEALTH_RECORDS]:
    'localId, studentId, schoolId, severity, visitDate, issueType, updatedAt',
  [TABLES.MEDICINES]:
    'localId, studentId, healthRecordId, schoolId, isCompleted, updatedAt',
  [TABLES.ATTACHMENTS]: 'localId, recordId, createdAt',
  [TABLES.SETTINGS]: 'key',
});

export default db;
