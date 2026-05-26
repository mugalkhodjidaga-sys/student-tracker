export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        className={`w-full min-h-12 rounded-xl border-2 border-slate-200 bg-white px-4 py-2 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-emerald-200 ${error ? 'border-urgent' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-urgent">{error}</p>}
    </div>
  );
}
