/** Google Drive + OAuth config (client ID is public; never put client_secret here). */
export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '769138972979-b7qgub605kmbv0dtobgl5at0anpec6at.apps.googleusercontent.com';

export const GOOGLE_DRIVE_FOLDER_ID =
  import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID ||
  '13nyxZ96ODhYfOixTzxou415AIALL8meE';

export const GOOGLE_DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

export const SCHOOL_DRIVE_EMAIL = 'shivayogihealthcare@gmail.com';

export const MAX_PHOTOS_PER_VISIT = 5;

export const GOOGLE_TOKEN_STORAGE_KEY = 'sjm_google_access_token';
export const GOOGLE_TOKEN_EXPIRY_KEY = 'sjm_google_token_expiry';
export const GOOGLE_USER_EMAIL_KEY = 'sjm_google_user_email';
