import { SHEETS_API_URL } from '../config/sheetsApi';
import { parseSheetRows } from '../utils/sheetMappers';

export class SheetsApiError extends Error {
  constructor(message, { status, action, cause } = {}) {
    super(message);
    this.name = 'SheetsApiError';
    this.status = status;
    this.action = action;
    this.cause = cause;
  }
}

function formatSheetsError(status, action, raw = '') {
  const detail = (raw || '').toLowerCase();

  if (!navigator.onLine) {
    return 'You appear to be offline. Connect to the internet and try again.';
  }

  if (status === 0 || detail.includes('failed to fetch') || detail.includes('networkerror')) {
    return (
      'Cannot reach Google Sheets from the browser. ' +
      'Redeploy the web app as "Anyone" (not "Only myself"), then hard-refresh this page (Ctrl+Shift+R). ' +
      'If using the installed app, open in Chrome/Safari browser once to update.'
    );
  }
  if (status === 403) {
    return 'Google Sheets access denied (403). Redeploy the web app with access set to "Anyone".';
  }
  if (detail.includes('invalid json')) {
    return (
      'Google Sheets returned an unexpected response. ' +
      'Confirm the web app URL in Settings matches your latest deployment, then redeploy Apps Script.'
    );
  }
  if (raw.includes('Invalid action')) {
    return `${action} is not deployed yet. Paste scripts/sheets-apps-script.gs and redeploy.`;
  }
  return raw || `Sheets API failed for ${action} (HTTP ${status})`;
}

function buildUrl(baseUrl, action, params = {}) {
  const url = new URL(baseUrl);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

/** JSONP bypasses CORS — reliable for Apps Script GET from GitHub Pages / PWA. */
function jsonpGet(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `sjmJsonp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const jsonpUrl = new URL(url);
    jsonpUrl.searchParams.set('callback', callbackName);

    const script = document.createElement('script');
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error('JSONP timeout'));
    }, 45000);

    function cleanup() {
      window.clearTimeout(timer);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (data) => {
      cleanup();
      resolve(data);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error('JSONP script load failed'));
    };

    script.src = jsonpUrl.toString();
    script.async = true;
    document.head.appendChild(script);
  });
}

async function fetchGet(url, action) {
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-store',
    credentials: 'omit',
    mode: 'cors',
  });

  const text = await res.text();

  if (!res.ok) {
    throw new SheetsApiError(formatSheetsError(res.status, action, text.slice(0, 200)), {
      status: res.status,
      action,
    });
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new SheetsApiError(formatSheetsError(res.status, action, `Invalid JSON: ${text.slice(0, 120)}`), {
      status: res.status,
      action,
    });
  }
}

async function requestGet(action, params = {}, baseUrl = SHEETS_API_URL) {
  const url = buildUrl(baseUrl, action, params);

  try {
    const data = await fetchGet(url, action);
    return validateResponse(data, action);
  } catch (fetchErr) {
    if (fetchErr instanceof SheetsApiError && fetchErr.status !== 0) {
      throw fetchErr;
    }

    // CORS / PWA fallback — requires JSONP support in Apps Script (callback param)
    try {
      const data = await jsonpGet(url);
      return validateResponse(data, action);
    } catch (jsonpErr) {
      const raw =
        fetchErr instanceof SheetsApiError ? fetchErr.cause?.message || fetchErr.message : fetchErr.message;
      throw new SheetsApiError(formatSheetsError(0, action, raw || jsonpErr.message), {
        status: 0,
        action,
        cause: jsonpErr,
      });
    }
  }
}

function validateResponse(data, action) {
  if (data?.success === false) {
    throw new SheetsApiError(data.message || formatSheetsError(0, action), {
      status: 0,
      action,
    });
  }
  return data;
}

async function readJsonResponse(res, action) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new SheetsApiError(
      formatSheetsError(res.status, action, `Invalid JSON from Sheets API: ${text.slice(0, 120)}`),
      { status: res.status, action }
    );
  }
}

export function createSheetsApiClient(baseUrl = SHEETS_API_URL) {
  async function requestPost(action, body) {
    const url = `${baseUrl}?action=${encodeURIComponent(action)}`;

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        cache: 'no-store',
        credentials: 'omit',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new SheetsApiError(formatSheetsError(0, action, err.message), {
        status: 0,
        action,
        cause: err,
      });
    }

    const data = await readJsonResponse(res, action);

    if (!res.ok) {
      throw new SheetsApiError(formatSheetsError(res.status, action, data?.message), {
        status: res.status,
        action,
      });
    }

    return validateResponse(data, action);
  }

  return {
    getApiUrl: () => baseUrl,

    getStudents: () => requestGet('getStudents', {}, baseUrl).then(parseSheetRows),
    addStudent: (payload) => requestPost('addStudent', payload),
    updateStudent: (studentId, payload) =>
      requestPost('updateStudent', { studentId, ...payload }),

    getHealthRecords: (params = {}) =>
      requestGet('getHealthRecords', params, baseUrl).then(parseSheetRows),
    addHealthRecord: (payload) => requestPost('addHealthRecord', payload),

    getMedicines: (params = {}) =>
      requestGet('getMedicines', params, baseUrl).then(parseSheetRows),
    addMedicine: (payload) => requestPost('addMedicine', payload),

    getAttachments: (params = {}) =>
      requestGet('getAttachments', params, baseUrl).then(parseSheetRows),
    addAttachment: (payload) => requestPost('addAttachment', payload),
    updateAttachment: (attachmentId, patch) =>
      requestPost('updateAttachment', { attachmentId, ...patch }),

    getDashboardStats: () => requestGet('getDashboardStats', {}, baseUrl),
  };
}

export const sheetsApiClient = createSheetsApiClient();
