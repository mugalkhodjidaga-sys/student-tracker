export function EmptyState({ message, icon = '📋' }) {
  return (
    <div className="py-8 text-center text-slate-500">
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <p className="mt-2 text-base">{message}</p>
    </div>
  );
}
