export const SCHOOL_ID = 'shivayogi-jnana-mandir';
export const SCHOOL_NAME = 'Shivayogi Jnana Mandira';
export const SCHOOL_TAGLINE =
  'Free residential education — Divine Charitable Trust';

export const SEVERITY = {
  NORMAL: 'Normal',
  MEDIUM: 'Medium',
  URGENT: 'Urgent',
};

export const SEVERITY_OPTIONS = [SEVERITY.NORMAL, SEVERITY.MEDIUM, SEVERITY.URGENT];

export const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  SICK: 'sick',
  RECOVERING: 'recovering',
};

export const ISSUE_CHIPS = [
  'Fever',
  'Illness/Weakness',
  'Cough',
  'Cold',
  'Stomach pain',
  'Injury/fall',
  'Head Injury',
  'Wound',
  'Noose bleeding',
  'Scabies',
  'Itching',
  'Food poisoning',
  'Loose Motion',
  'Asthama',
  'Throast infection',

];

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export const TABLES = {
  STUDENTS: 'students',
  HEALTH_RECORDS: 'healthRecords',
  MEDICINES: 'medicines',
  MEDICINE_CATALOG: 'medicineCatalog',
  ATTACHMENTS: 'attachments',
  SETTINGS: 'settings',
};

export const FOOD_TIMING = {
  BEFORE_FOOD: 'before_food',
  AFTER_FOOD: 'after_food',
  WITH_FOOD: 'with_food',
  EMPTY_STOMACH: 'empty_stomach',
  NOT_APPLICABLE: 'not_applicable',
};

export const FOOD_TIMING_OPTIONS = [
  { value: FOOD_TIMING.BEFORE_FOOD, label: 'Before food' },
  { value: FOOD_TIMING.AFTER_FOOD, label: 'After food' },
  { value: FOOD_TIMING.WITH_FOOD, label: 'With food' },
  { value: FOOD_TIMING.EMPTY_STOMACH, label: 'Empty stomach' },
  { value: FOOD_TIMING.NOT_APPLICABLE, label: 'Not applicable (cream/bandage)' },
];

export const DOSE_UNITS = [
  { value: 'tablet', label: 'Tablet(s)', group: 'Oral' },
  { value: 'capsule', label: 'Capsule(s)', group: 'Oral' },
  { value: 'ml', label: 'ml (millilitre)', group: 'Liquid' },
  { value: 'tsp', label: 'Teaspoon', group: 'Liquid' },
  { value: 'spoon', label: 'Spoon', group: 'Liquid' },
  { value: 'sachet', label: 'Sachet', group: 'Oral' },
  { value: 'drops', label: 'Drops', group: 'Liquid' },
  { value: 'puff', label: 'Puff (inhaler)', group: 'Other' },
  { value: 'apply', label: 'Apply (thin layer)', group: 'Topical' },
  { value: 'tube', label: 'Tube', group: 'Topical' },
  { value: 'gel', label: 'Gel', group: 'Topical' },
  { value: 'cream', label: 'Cream', group: 'Topical' },
  { value: 'bandage', label: 'Bandage / dressing', group: 'Topical' },
  { value: 'as_directed', label: 'As directed', group: 'Other' },
];

export const SCHEDULE_PRESETS = {
  ONCE_MORNING: 'once_morning',
  TWICE: 'twice_daily',
  THRICE: 'thrice_daily',
  AS_NEEDED: 'as_needed',
  CUSTOM: 'custom',
};

export const EMPTY_SCHEDULE = () => ({
  morning: false,
  noon: false,
  evening: false,
  night: false,
});

export const SEED_VERSION_KEY = 'seedVersion';
export const CATALOG_SEED_VERSION_KEY = 'medicineCatalogSeedVersion';
export const CURRENT_SEED_VERSION = '1';
export const CURRENT_CATALOG_SEED_VERSION = '3';
