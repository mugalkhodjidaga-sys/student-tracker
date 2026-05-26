export function Select({ label, error, options = [], className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <select
        className={`w-full min-h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-base focus:border-primary focus:outline-none ${error ? 'border-urgent' : ''} ${className}`}
        {...props}
      >
        {options.map((opt) =>
          typeof opt === 'string' ? (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ) : (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          )
        )}
      </select>
      {error && <p className="mt-1 text-sm text-urgent">{error}</p>}
    </div>
  );
}
