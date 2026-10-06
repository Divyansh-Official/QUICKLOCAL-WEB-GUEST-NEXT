import Icon from './Icon';

/**
 * A store badge that never lies about being a link: an anchor when the
 * listing exists, a labelled, disabled control marked Soon when it does not.
 */
export default function StoreBadge({
  listing,
  icon,
  top,
  soon,
  soonTitle,
}: {
  listing: { available: boolean; url: string | null; store: string };
  icon: string;
  top: string;
  soon: string;
  soonTitle: string;
}) {
  const inner = (
    <>
      <Icon name={icon} size={24} className="max-sm:h-5 max-sm:w-5" />
      <span className="text-left leading-tight">
        <span className="block text-[9px] font-semibold uppercase sm:text-[10px] tracking-[0.08em] text-fg-3">{top}</span>
        <span className="block text-[13.5px] font-extrabold sm:text-[15px] tracking-[-0.02em]">{listing.store}</span>
      </span>
      {!listing.available ? <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] max-sm:absolute max-sm:-right-1.5 max-sm:-top-2 max-sm:px-1.5 max-sm:text-[8.5px] sm:ml-1 font-extrabold uppercase tracking-wide text-white">{soon}</span> : null}
    </>
  );
  const cls = 'glass-blur relative inline-flex h-12 items-center gap-2 rounded-2xl px-3 text-fg sm:h-14 sm:gap-3 sm:px-4';
  if (listing.available && listing.url) {
    return (
      <a href={listing.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover-lift`}>
        {inner}
      </a>
    );
  }
  return (
    <span title={soonTitle} aria-disabled="true" className={`${cls} cursor-default`}>
      {inner}
    </span>
  );
}
