const styles = {
  Normal: 'bg-healthy-light text-healthy',
  Medium: 'bg-medium-light text-medium',
  Urgent: 'bg-urgent-light text-urgent',
};

export function SeverityBadge({ severity }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[severity] || 'bg-slate-100 text-slate-600'}`}
    >
      {severity}
    </span>
  );
}
