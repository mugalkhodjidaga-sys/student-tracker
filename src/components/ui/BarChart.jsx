/**
 * Simple horizontal bar chart — no external chart library.
 */
export function BarChart({ data, labelKey = 'label', valueKey = 'value', maxBars = 8 }) {
  const items = data.slice(0, maxBars);
  const max = Math.max(...items.map((d) => d[valueKey]), 1);

  if (items.length === 0) {
    return <p className="text-sm text-slate-500">No data to chart</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const value = item[valueKey];
        const pct = Math.round((value / max) * 100);
        return (
          <div key={item[labelKey]}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="truncate pr-2 font-medium text-slate-700">
                {item[labelKey]}
              </span>
              <span className="shrink-0 font-semibold text-slate-900">{value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DonutStat({ segments, size = 120 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  const colors = {
    Normal: '#16a34a',
    Medium: '#d97706',
    Urgent: '#dc2626',
  };

  const gradientParts = segments.map((seg) => {
    const pct = (seg.value / total) * 100;
    const start = offset;
    offset += pct;
    const color = colors[seg.label] || '#94a3b8';
    return `${color} ${start}% ${offset}%`;
  });

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div
        className="shrink-0 rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${gradientParts.join(', ')})`,
          mask: 'radial-gradient(circle, transparent 55%, black 56%)',
          WebkitMask: 'radial-gradient(circle, transparent 55%, black 56%)',
        }}
      />
      <ul className="space-y-2 text-sm">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: colors[seg.label] || '#94a3b8' }}
            />
            <span className="text-slate-700">
              {seg.label}: <strong>{seg.value}</strong>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
