import { useState } from 'react';
import { useStorage } from '../providers/StorageContext';
import { useGoogleAuth } from '../providers/GoogleAuthContext';
import { validateVisitPayload } from '../utils/validators';

export function useVisitEntry() {
  const { visitEntryService } = useStorage();
  const { ensureAccessToken } = useGoogleAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  function clearError(key) {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function clearErrors(keys) {
    setErrors((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const key of keys) {
        if (next[key]) {
          delete next[key];
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }

  async function submit(payload) {
    const { valid, errors: validationErrors } = validateVisitPayload(payload);
    if (!valid) {
      setErrors(validationErrors);
      setSuccess(false);
      return { ok: false };
    }

    setLoading(true);
    setErrors({});
    try {
      const accessToken = await ensureAccessToken({ interactive: false });
      const result = await visitEntryService.saveVisit({
        ...payload,
        accessToken,
      });
      setSuccess(true);
      return { ok: true, data: result };
    } catch (err) {
      setErrors({
        form: err.message || 'Failed to save visit',
      });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  function resetSuccess() {
    setSuccess(false);
    setErrors({});
  }

  return { submit, loading, errors, success, resetSuccess, clearError, clearErrors };
}
