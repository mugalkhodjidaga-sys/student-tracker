import { SCHOOL_ID, FOOD_TIMING, ISSUE_CHIPS } from '../utils/constants';
import { createSyncBase } from '../utils/syncHelpers';

function entry(name, issueTypes, defaults = {}) {
  return {
    ...createSyncBase(),
    schoolId: SCHOOL_ID,
    name,
    issueTypes,
    defaultDoseAmount: defaults.doseAmount ?? '1',
    defaultDoseUnit: defaults.doseUnit ?? 'tablet',
    defaultFoodTiming: defaults.foodTiming ?? FOOD_TIMING.AFTER_FOOD,
    defaultSchedule: defaults.schedule ?? {
      morning: true,
      noon: false,
      evening: true,
      night: false,
    },
    useCount: defaults.useCount ?? 0,
    isCustom: false,
  };
}

/**
 * School medicine catalog — maps to ISSUE_CHIPS; sync-ready for future API.
 */
export function buildMedicineCatalogSeed() {
  const all = ISSUE_CHIPS;

  return [
    // Fever / weakness
    entry('Paracetamol 500mg', ['Fever', 'Illness/Weakness', 'Head Injury'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 50,
    }),
    entry('Paracetamol syrup (250mg/5ml)', ['Fever'], {
      doseAmount: '5',
      doseUnit: 'ml',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 30,
    }),
    entry('Ibuprofen 400mg', ['Fever', 'Injury/fall', 'Head Injury'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 15,
    }),

    // Cough / cold / throat
    entry('Cough syrup', ['Cough', 'Cold', 'Throast infection'], {
      doseAmount: '10',
      doseUnit: 'ml',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 35,
    }),
    entry('Steam inhalation', ['Cough', 'Cold', 'Asthama'], {
      doseAmount: '1',
      doseUnit: 'as_directed',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 20,
    }),
    entry('Saline nasal drops', ['Cold'], {
      doseAmount: '2',
      doseUnit: 'drops',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 12,
    }),
    entry('Warm salt water gargle', ['Throast infection', 'Cough'], {
      doseAmount: '1',
      doseUnit: 'as_directed',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 18,
    }),
    entry('Inhaler (Salbutamol)', ['Asthama'], {
      doseAmount: '1',
      doseUnit: 'puff',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 8,
    }),

    // Stomach / loose motion / food poisoning
    entry('ORS (Oral Rehydration Salts)', ['Loose Motion', 'Food poisoning', 'Stomach pain'], {
      doseAmount: '1',
      doseUnit: 'sachet',
      foodTiming: FOOD_TIMING.WITH_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 40,
    }),
    entry('Antacid (Digene / ENO)', ['Stomach pain', 'Food poisoning'], {
      doseAmount: '1',
      doseUnit: 'spoon',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 25,
    }),
    entry('Domperidone', ['Stomach pain', 'Food poisoning', 'Loose Motion'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.BEFORE_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 10,
    }),
    entry('Zinc syrup', ['Loose Motion'], {
      doseAmount: '5',
      doseUnit: 'ml',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 14,
    }),

    // Injury / wound / bleeding
    entry('Betadine antiseptic', ['Injury/fall', 'Wound', 'Head Injury', 'Noose bleeding'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 28,
    }),
    entry('Bandage / gauze dressing', ['Wound', 'Injury/fall', 'Noose bleeding'], {
      doseAmount: '1',
      doseUnit: 'bandage',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 22,
    }),
    entry('Soframycin cream', ['Wound', 'Injury/fall', 'Scabies'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 16,
    }),
    entry('Diclofenac gel', ['Injury/fall', 'Illness/Weakness'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 12,
    }),
    entry('Ice pack / rest', ['Injury/fall', 'Head Injury'], {
      doseAmount: '1',
      doseUnit: 'as_directed',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 20,
    }),

    // Nose bleeding
    entry('Nasal compression + head elevation', ['Noose bleeding'], {
      doseAmount: '1',
      doseUnit: 'as_directed',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: false, noon: false, evening: false, night: false },
      useCount: 5,
    }),

    // Skin — scabies / itching
    entry('Permethrin 5% cream', ['Scabies'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 10,
    }),
    entry('Calamine lotion', ['Itching', 'Scabies'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 15,
    }),
    entry('Cetirizine 10mg', ['Itching', 'Cold', 'Asthama'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 18,
    }),

    // General / vitamins
    entry('Vitamin C', ['Cold', 'Illness/Weakness'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 12,
    }),
    entry('Multivitamin syrup', ['Illness/Weakness'], {
      doseAmount: '5',
      doseUnit: 'ml',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 8,
    }),

    // Deworming (common in residential schools)
    entry('Albendazole 400mg', all, {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 6,
    }),

    // Additional tablets by issue type
    entry('Dolo 650 (Paracetamol)', ['Fever', 'Illness/Weakness', 'Head Injury'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 22,
    }),
    entry('Combiflam', ['Fever', 'Injury/fall', 'Head Injury'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 14,
    }),
    entry('Azithromycin 500mg', ['Throast infection', 'Cough', 'Fever'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.BEFORE_FOOD,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 11,
    }),
    entry('Amoxicillin 250mg', ['Throast infection', 'Fever', 'Wound'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 9,
    }),
    entry('Ambroxol syrup', ['Cough', 'Throast infection', 'Cold'], {
      doseAmount: '5',
      doseUnit: 'ml',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 13,
    }),
    entry('Chlorpheniramine 4mg', ['Cold', 'Itching', 'Asthama'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 10,
    }),
    entry('Montelukast 10mg', ['Asthama', 'Cough'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 7,
    }),
    entry('Pantoprazole 40mg', ['Stomach pain', 'Food poisoning'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.BEFORE_FOOD,
      schedule: { morning: true, noon: false, evening: false, night: false },
      useCount: 12,
    }),
    entry('Ondansetron 4mg', ['Food poisoning', 'Stomach pain', 'Loose Motion'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.BEFORE_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 8,
    }),
    entry('Loperamide 2mg', ['Loose Motion'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 9,
    }),
    entry('Metronidazole 400mg', ['Food poisoning', 'Stomach pain', 'Loose Motion'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 7,
    }),
    entry('Meftal Spas', ['Stomach pain', 'Illness/Weakness'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 11,
    }),
    entry('Mupirocin ointment', ['Wound', 'Scabies', 'Injury/fall'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 10,
    }),
    entry('Hydrocortisone cream', ['Itching', 'Scabies'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 8,
    }),
    entry('Levocetirizine 5mg', ['Itching', 'Cold', 'Asthama'], {
      doseAmount: '1',
      doseUnit: 'tablet',
      foodTiming: FOOD_TIMING.AFTER_FOOD,
      schedule: { morning: false, noon: false, evening: true, night: false },
      useCount: 12,
    }),
    entry('Silver sulfadiazine cream', ['Wound', 'Injury/fall'], {
      doseAmount: '1',
      doseUnit: 'apply',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: true, evening: true, night: false },
      useCount: 6,
    }),
    entry('Phenylephrine nasal drops', ['Cold', 'Noose bleeding'], {
      doseAmount: '2',
      doseUnit: 'drops',
      foodTiming: FOOD_TIMING.NOT_APPLICABLE,
      schedule: { morning: true, noon: false, evening: true, night: false },
      useCount: 5,
    }),
  ];
}
