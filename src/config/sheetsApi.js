/** Google Sheets is the primary database for shared caretaker access. */
export const SHEETS_API_URL =
  import.meta.env.VITE_SHEETS_API_URL ||
  'https://script.google.com/macros/s/AKfycbyhUI_tBkcpYr_eJTq4pzv0f95atiGWhO_D8gtqxk1YcgA1Mmu91QPJZg8eM8IYbn83/exec';

/** When true, students / visits / medicines / attachment metadata use Google Sheets. */
export const USE_SHEETS_DB = true;

/** @deprecated use USE_SHEETS_DB */
export const USE_SHEETS_FOR_STUDENTS = USE_SHEETS_DB;
