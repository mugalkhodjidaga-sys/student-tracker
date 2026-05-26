import { SCHOOL_ID, SEVERITY } from '../utils/constants';
import { createSyncBase } from '../utils/syncHelpers';
import { toDateInputValue } from '../utils/dateHelpers';

function daysBack(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateInputValue(d);
}

export function buildSeedData() {
  const s1 = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    admissionNumber: 'SJM-001',
    name: 'Arjun Patil',
    age: 14,
    gender: 'Male',
    className: 'Class 8',
    roomNumber: 'Room 12',
    bloodGroup: 'B+',
    allergies: 'Peanuts',
    guardianName: 'Ramesh Patil',
    guardianPhone: '9876543210',
    admissionDate: '2023-06-01',
    healthStatus: 'healthy',
  };

  const s2 = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    admissionNumber: 'SJM-002',
    name: 'Priya Kulkarni',
    age: 13,
    gender: 'Female',
    className: 'Class 7',
    roomNumber: 'Room 5',
    bloodGroup: 'O+',
    allergies: '',
    guardianName: 'Sunita Kulkarni',
    guardianPhone: '9876543211',
    admissionDate: '2023-06-01',
    healthStatus: 'healthy',
  };

  const s3 = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    admissionNumber: 'SJM-003',
    name: 'Rahul Deshmukh',
    age: 15,
    gender: 'Male',
    className: 'Class 9',
    roomNumber: 'Room 8',
    bloodGroup: 'A+',
    allergies: 'Dust',
    guardianName: 'Vijay Deshmukh',
    guardianPhone: '9876543212',
    admissionDate: '2022-06-01',
    healthStatus: 'recovering',
  };

  const s4 = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    admissionNumber: 'SJM-004',
    name: 'Ananya Joshi',
    age: 12,
    gender: 'Female',
    className: 'Class 6',
    roomNumber: 'Room 3',
    bloodGroup: 'AB+',
    allergies: '',
    guardianName: 'Meera Joshi',
    guardianPhone: '9876543213',
    admissionDate: '2024-06-01',
    healthStatus: 'healthy',
  };

  const s5 = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    admissionNumber: 'SJM-005',
    name: 'Karthik Rao',
    age: 16,
    gender: 'Male',
    className: 'Class 10',
    roomNumber: 'Room 15',
    bloodGroup: 'O-',
    allergies: '',
    guardianName: 'Lakshmi Rao',
    guardianPhone: '9876543214',
    admissionDate: '2021-06-01',
    healthStatus: 'sick',
  };

  const students = [s1, s2, s3, s4, s5];

  const records = [];
  const medicines = [];

  const arjunVisits = [
    {
      issueType: 'Fever',
      symptoms: 'High temperature, body ache',
      severity: SEVERITY.MEDIUM,
      days: 14,
      medicine: 'Paracetamol 500mg',
      doses: '1 tablet after food, twice daily',
      schedule: { morning: true, afternoon: false, night: true },
    },
    {
      issueType: 'Cough',
      symptoms: 'Dry cough for 3 days',
      severity: SEVERITY.NORMAL,
      days: 5,
      medicine: 'Cough syrup',
      doses: '10ml three times daily',
      schedule: { morning: true, afternoon: true, night: true },
    },
  ];

  arjunVisits.forEach((v) => {
    const rec = {
      ...createSyncBase(),
      schoolId: SCHOOL_ID,
      studentId: s1.localId,
      issueType: v.issueType,
      symptoms: v.symptoms,
      severity: v.severity,
      visitDate: daysBack(v.days),
      treatedBy: 'Sister Meera',
      notes: '',
    };
    records.push(rec);
    medicines.push({
      ...createSyncBase(),
      schoolId: SCHOOL_ID,
      studentId: s1.localId,
      healthRecordId: rec.localId,
      medicineGiven: v.medicine,
      treatmentDoses: v.doses,
      schedule: v.schedule,
      ingestionNotes: '',
      startDate: rec.visitDate,
      endDate: '',
      isCompleted: v.days > 7,
    });
  });

  const rahulVisit = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    studentId: s3.localId,
    issueType: 'Injury/fall',
    symptoms: 'Bleeding after falling on playground, knee scrape',
    severity: SEVERITY.URGENT,
    visitDate: daysBack(3),
    treatedBy: 'Dr. Sharma',
    notes: 'Cleaned wound, bandaged',
  };
  records.push(rahulVisit);
  medicines.push({
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    studentId: s3.localId,
    healthRecordId: rahulVisit.localId,
    medicineGiven: 'Betadine + bandage',
    treatmentDoses: 'Apply antiseptic, change dressing daily',
    schedule: { morning: true, afternoon: true, night: false },
    ingestionNotes: 'Keep wound dry',
    startDate: rahulVisit.visitDate,
    endDate: '',
    isCompleted: false,
  });

  const karthikVisit = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    studentId: s5.localId,
    issueType: 'Stomach pain',
    symptoms: 'Stomach ache after lunch',
    severity: SEVERITY.MEDIUM,
    visitDate: daysBack(1),
    treatedBy: 'Sister Meera',
    notes: '',
  };
  records.push(karthikVisit);
  medicines.push({
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    studentId: s5.localId,
    healthRecordId: karthikVisit.localId,
    medicineGiven: 'ORS + antacid',
    treatmentDoses: 'ORS after each loose motion; antacid after food',
    schedule: { morning: true, afternoon: true, night: true },
    ingestionNotes: 'Light food only',
    startDate: karthikVisit.visitDate,
    endDate: '',
    isCompleted: false,
  });

  const priyaVisit = {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    studentId: s2.localId,
    issueType: 'Cold',
    symptoms: 'Runny nose, mild headache',
    severity: SEVERITY.NORMAL,
    visitDate: daysBack(7),
    treatedBy: 'Sister Meera',
    notes: '',
  };
  records.push(priyaVisit);
  medicines.push({
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    studentId: s2.localId,
    healthRecordId: priyaVisit.localId,
    medicineGiven: 'Steam inhalation + vitamin C',
    treatmentDoses: 'Steam twice daily',
    schedule: { morning: true, afternoon: false, night: true },
    ingestionNotes: '',
    startDate: priyaVisit.visitDate,
    endDate: '',
    isCompleted: true,
  });

  return { students, healthRecords: records, medicines };
}
