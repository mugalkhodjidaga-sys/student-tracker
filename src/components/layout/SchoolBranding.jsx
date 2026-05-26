import { SCHOOL_NAME, SCHOOL_TAGLINE } from '../../utils/constants';
import { SJM_IMAGES, SJM_WEBSITE_URL } from '../../utils/branding';

export function SchoolBranding({
  size = 'md',
  showTagline = false,
  showLink = false,
  className = '',
}) {
  const logoClass =
    size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';
  const titleClass =
    size === 'lg' ? 'text-xl font-bold' : 'text-sm font-semibold';

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={`${import.meta.env.BASE_URL}sjm-logo.jpg`}
        alt="Mugalkhod Jidaga Math logo"
        className={`${logoClass} shrink-0 rounded-full border-2 border-emerald-700 object-cover`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = SJM_IMAGES.logo;
        }}
      />
      <div className="min-w-0 text-left">
        <p className={`${titleClass} leading-tight text-slate-800`}>
          {SCHOOL_NAME}
        </p>
        {showTagline && (
          <p className="text-xs text-slate-500">{SCHOOL_TAGLINE}</p>
        )}
        {size !== 'sm' && (
          <p className="text-xs font-medium text-primary">Health Tracker</p>
        )}
      </div>
    </div>
  );

  if (showLink) {
    return (
      <a
        href={SJM_WEBSITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-xl transition-opacity hover:opacity-90"
      >
        {content}
      </a>
    );
  }

  return content;
}

export function SchoolHeroBanner({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 ${className}`}
    >
      <img
        src={SJM_IMAGES.hero}
        alt="Students at Shivayogi Jnana Mandira"
        className="h-36 w-full object-cover md:h-44"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-sm font-medium opacity-90">Divine Charitable Trust</p>
        <p className="text-lg font-semibold">{SCHOOL_NAME}</p>
      </div>
    </div>
  );
}
