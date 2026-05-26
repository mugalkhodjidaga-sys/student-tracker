import { useState } from 'react';
import { useStorage } from '../providers/StorageContext';
import { validateVisitPayload } from '../utils/validators';

export function useVisitEntry() {
  const { visitEntryService } = useStorage();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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
      const result = await visitEntryService.saveVisit(payload);
      setSuccess(true);
      return { ok: true, data: result };
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save visit' });
      return { ok: false };
    } finally {
      setLoading(false);
    }
  }

  function resetSuccess() {
    setSuccess(false);
    setErrors({});
  }

  return { submit, loading, errors, success, resetSuccess };
}
