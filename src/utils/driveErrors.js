/** Turn Google Drive API errors into actionable messages for staff. */
export function formatDriveError(status, rawMessage = '') {
  const msg = (rawMessage || '').toLowerCase();

  if (status === 403) {
    if (msg.includes('insufficient') || msg.includes('scope')) {
      return (
        'Google Drive access denied (403). Sign out and sign in again, then accept all permission prompts. ' +
        'Use shivayogihealthcare@gmail.com or an account with Editor access to the photo folder.'
      );
    }
    if (msg.includes('storagequota') || msg.includes('quota')) {
      return 'Google Drive storage is full. Free up space in the school Google account.';
    }
    return (
      'Google Drive permission denied (403). Sign in with the school account ' +
      '(shivayogihealthcare@gmail.com), confirm the photo folder is shared with you as Editor, ' +
      'then try again from Settings → Sync pending photos.'
    );
  }

  if (status === 401) {
    return 'Google sign-in expired. Go to Settings → Sign in with Google again.';
  }

  if (status === 404) {
    return 'Drive folder or file not found. Check the folder ID in Settings or re-upload the photo.';
  }

  if (status === 429) {
    return 'Too many uploads at once. Wait a minute and try syncing again.';
  }

  if (status >= 500) {
    return 'Google Drive is temporarily unavailable. Your photo is saved on this device — sync again later.';
  }

  return rawMessage || `Drive upload failed (HTTP ${status})`;
}

export async function parseDriveErrorResponse(res) {
  let raw = res.statusText || 'Drive request failed';
  try {
    const data = await res.json();
    raw = data.error?.message || raw;
  } catch {
    /* use statusText */
  }
  return formatDriveError(res.status, raw);
}
