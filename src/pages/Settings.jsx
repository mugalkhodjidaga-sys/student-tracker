import { useEffect, useRef, useState } from 'react';
import { useStorage } from '../providers/StorageContext';
import { useGoogleAuth } from '../providers/GoogleAuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SchoolBranding } from '../components/layout/SchoolBranding';
import { SJM_WEBSITE_URL } from '../utils/branding';
import { GOOGLE_DRIVE_FOLDER_ID } from '../config/googleDrive';
import { SHEETS_API_URL, USE_SHEETS_DB } from '../config/sheetsApi';
import { sheetsApiClient } from '../services/sheetsApiClient';

export function Settings() {
  const { backupService, attachmentService } = useStorage();
  const {
    isSignedIn,
    email,
    expectedEmail,
    signIn,
    signOut,
    ensureAccessToken,
    authError,
    loading: authLoading,
  } = useGoogleAuth();
  const fileRef = useRef(null);
  const [message, setMessage] = useState('');
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    attachmentService.getPendingCount().then(setPendingCount);
  }, [attachmentService, message]);

  async function handleExport() {
    const data = await backupService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ashram-health-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('Backup downloaded successfully.');
  }

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await backupService.importData(data);
      setMessage('Backup imported. Refresh the page to see data.');
    } catch {
      setMessage('Invalid backup file.');
    }
    e.target.value = '';
  }

  async function handleClear() {
    const ok = window.confirm(
      'Delete ALL health data on this device? This cannot be undone.'
    );
    if (!ok) return;
    const ok2 = window.confirm('Are you absolutely sure?');
    if (!ok2) return;

    await backupService.clearAll();
    setMessage('All data cleared. Refresh to re-seed demo data.');
  }

  async function handleTestSheets() {
    setMessage('');
    try {
      const rows = await sheetsApiClient.getStudents();
      setMessage(`Google Sheets connected — ${rows.length} student row(s) found.`);
    } catch (err) {
      setMessage(err.message || 'Could not reach Google Sheets.');
    }
  }

  async function handleSyncPhotos() {
    setSyncing(true);
    setMessage('');
    try {
      const token = await ensureAccessToken({ interactive: true });
      if (!token) {
        setMessage('Sign in required to sync photos.');
        return;
      }
      const result = await attachmentService.syncPending(token);
      setMessage(
        `Photo sync complete: ${result.synced} uploaded, ${result.failed} failed.`
      );
    } catch (err) {
      setMessage(err.message || 'Photo sync failed.');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card title="School">
        <SchoolBranding size="lg" showTagline />
        <a
          href={SJM_WEBSITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Visit official SJM website →
        </a>
        <p className="mt-2 text-sm text-slate-500">Single school mode (v1)</p>
      </Card>

      <Card title="Google Sheets database">
        <p className="mb-3 text-sm text-slate-600">
          Students, visits, medicines, and photo records sync to <strong>SJM Health Database</strong>
          on Google Sheets — shared across all caretakers.
        </p>
        {USE_SHEETS_DB && (
          <>
            <p className="mb-3 break-all text-xs text-slate-500">API: {SHEETS_API_URL}</p>
            <Button variant="outline" onClick={handleTestSheets}>
              Test Sheets connection
            </Button>
          </>
        )}
      </Card>

      <Card title="Google Drive photos">
        <p className="mb-3 text-sm text-slate-600">
          Visit reference photos upload to the school Drive folder. Sign in with{' '}
          <strong>{expectedEmail}</strong> (or an approved tester account while the app is in testing).
        </p>
        <p className="mb-4 text-xs text-slate-500">
          Folder ID: {GOOGLE_DRIVE_FOLDER_ID}
        </p>

        {isSignedIn ? (
          <div className="space-y-3">
            <p className="text-sm text-emerald-700">
              Signed in as <strong>{email || 'Google account'}</strong>
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={signOut} disabled={authLoading}>
                Sign out
              </Button>
              <Button onClick={handleSyncPhotos} disabled={syncing || pendingCount === 0}>
                {syncing ? 'Syncing…' : `Sync pending photos (${pendingCount})`}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Button onClick={signIn} disabled={authLoading}>
              Sign in with Google
            </Button>
            {authError && <p className="text-sm text-urgent">{authError}</p>}
          </div>
        )}
      </Card>

      <Card title="Backup & restore">
        <p className="mb-4 text-sm text-slate-600">
          Export all data as JSON. Import on another device with the same app.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={handleExport}>Export backup (JSON)</Button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            Import backup
          </Button>
        </div>
      </Card>

      <Card title="Danger zone" className="border-urgent/30">
        <p className="mb-4 text-sm text-slate-600">
          Permanently delete all students and health records from this browser.
        </p>
        <Button variant="danger" onClick={handleClear}>
          Clear all local data
        </Button>
      </Card>

      {message && (
        <p className="rounded-xl bg-emerald-50 p-3 text-primary">{message}</p>
      )}
    </div>
  );
}
