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
      <Icon name={icon} size={24} />
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-3">{top}</span>
        <span className="block text-[15px] font-extrabold tracking-[-0.02em]">{listing.store}</span>
      </span>
      {!listing.available ? <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">{soon}</span> : null}
    </>
  );
  const cls = 'glass-blur inline-flex h-14 items-center gap-3 rounded-2xl px-4 text-fg';
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
