import { useCallback, useEffect, useState } from 'react';
import { useStorage } from '../providers/StorageContext';

export function useStudentHistory(studentId) {
  const { healthRecordService } = useStorage();
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState({ count: 0, lastVisit: null });
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!studentId) {
      setHistory([]);
      setSummary({ count: 0, lastVisit: null });
      return;
    }

    setLoading(true);
    try {
      const [visits, sum] = await Promise.all([
        healthRecordService.getByStudent(studentId),
        healthRecordService.getStudentVisitSummary(studentId),
      ]);
      setHistory(visits);
      setSummary(sum);
    } finally {
      setLoading(false);
    }
  }, [studentId, healthRecordService]);

  useEffect(() => {
    load();
  }, [load]);

  return { history, summary, loading, refresh: load };
}
