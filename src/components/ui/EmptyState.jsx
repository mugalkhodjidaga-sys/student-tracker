import { SJM_IMAGES } from '../../utils/branding';

export function EmptyState({ message, icon = '📋', image }) {
  const imgSrc = image ?? null;

  return (
    <div className="py-8 text-center text-slate-500">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt=""
          className="mx-auto mb-3 h-24 w-24 rounded-full object-cover opacity-80"
          loading="lazy"
        />
      ) : (
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
      )}
      <p className="mt-2 text-base">{message}</p>
    </div>
  );
}

