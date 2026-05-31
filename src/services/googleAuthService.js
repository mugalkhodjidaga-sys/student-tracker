import {
  GOOGLE_CLIENT_ID,
  GOOGLE_DRIVE_SCOPE,
  GOOGLE_TOKEN_STORAGE_KEY,
  GOOGLE_TOKEN_EXPIRY_KEY,
  GOOGLE_USER_EMAIL_KEY,
} from '../config/googleDrive';

let scriptPromise = null;
let tokenClient = null;

function loadGoogleIdentityScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google sign-in is only available in the browser'));
  }
  if (window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-sjm-gsi]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google sign-in')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.sjmGsi = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google sign-in'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

function readStoredToken() {
  const token = sessionStorage.getItem(GOOGLE_TOKEN_STORAGE_KEY);
  const expiry = Number(sessionStorage.getItem(GOOGLE_TOKEN_EXPIRY_KEY) || 0);
  const email = sessionStorage.getItem(GOOGLE_USER_EMAIL_KEY) || '';

  if (!token || !expiry || Date.now() >= expiry - 60_000) {
    return null;
  }

  return { accessToken: token, email, expiresAt: expiry };
}

function storeToken(accessToken, expiresInSeconds, email = '') {
  const expiry = Date.now() + expiresInSeconds * 1000;
  sessionStorage.setItem(GOOGLE_TOKEN_STORAGE_KEY, accessToken);
  sessionStorage.setItem(GOOGLE_TOKEN_EXPIRY_KEY, String(expiry));
  if (email) sessionStorage.setItem(GOOGLE_USER_EMAIL_KEY, email);
  return { accessToken, email, expiresAt: expiry };
}

function clearStoredToken() {
  sessionStorage.removeItem(GOOGLE_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(GOOGLE_TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(GOOGLE_USER_EMAIL_KEY);
}

async function fetchGoogleEmail(accessToken) {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.email || '';
  } catch {
    return '';
  }
}

async function ensureTokenClient() {
  await loadGoogleIdentityScript();
  if (tokenClient) return tokenClient;

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: GOOGLE_CLIENT_ID,
    scope: GOOGLE_DRIVE_SCOPE,
    callback: () => {},
  });

  return tokenClient;
}

export function createGoogleAuthService() {
  return {
    getStoredSession() {
      return readStoredToken();
    },

    async signIn() {
      await ensureTokenClient();

      return new Promise((resolve, reject) => {
        tokenClient.callback = async (response) => {
          if (response.error) {
            reject(new Error(response.error_description || response.error));
            return;
          }

          const email = await fetchGoogleEmail(response.access_token);
          const session = storeToken(
            response.access_token,
            Number(response.expires_in || 3600),
            email
          );
          resolve(session);
        };

        tokenClient.requestAccessToken({ prompt: 'consent' });
      });
    },

    async ensureAccessToken({ interactive = false } = {}) {
      const stored = readStoredToken();
      if (stored) return stored.accessToken;

      if (!interactive) return null;

      const session = await this.signIn();
      return session.accessToken;
    },

    async signOut() {
      const stored = readStoredToken();
      if (stored?.accessToken && window.google?.accounts?.oauth2?.revoke) {
        try {
          await window.google.accounts.oauth2.revoke(stored.accessToken);
        } catch {
          /* ignore revoke errors */
        }
      }
      clearStoredToken();
    },

    isOnline() {
      return typeof navigator !== 'undefined' ? navigator.onLine : true;
    },
  };
}

export const googleAuthService = createGoogleAuthService();
