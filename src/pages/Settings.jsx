import { useRef, useState } from 'react';
import { useStorage } from '../providers/StorageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SchoolBranding } from '../components/layout/SchoolBranding';
import { SJM_WEBSITE_URL } from '../utils/branding';

export function Settings() {
  const { backupService } = useStorage();
  const fileRef = useRef(null);
  const [message, setMessage] = useState('');

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
