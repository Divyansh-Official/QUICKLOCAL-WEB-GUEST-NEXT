/**
 * One icon set, drawn inline.
 *
 * Inline SVG rather than an icon package: this site ships about thirty glyphs
 * and a dependency would send the other two thousand along with them. Every
 * icon here is on a 24-unit grid with a 1.7 stroke, matching the admin console
 * so the two products look drawn by the same hand.
 *
 * `currentColor` throughout, so an icon takes the colour of whatever contains
 * it and never needs a variant per surface.
 */
export type IconName =
  // categories
  | 'basket' | 'tools' | 'sofa' | 'shirt' | 'box'
  // trust
  | 'shield-check' | 'lock' | 'truck' | 'headset'
  // stats
  | 'radius' | 'clock' | 'wallet' | 'tag'
  // ui
  | 'search' | 'pin' | 'chevron-right' | 'chevron-left' | 'chevron-down'
  | 'check' | 'arrow-right' | 'menu' | 'close' | 'star' | 'sparkle'
  | 'phone' | 'mail' | 'store' | 'bike' | 'users' | 'chart' | 'refresh'
  // brands
  | 'facebook' | 'instagram' | 'x' | 'linkedin' | 'apple' | 'play';

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.7,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const s = {
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const solid = { fill: 'currentColor', stroke: 'none' };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
      {name === 'basket' && (
        <>
          <path d="M4.2 8.8h15.6l-1.5 9.4a2 2 0 0 1-2 1.7H7.7a2 2 0 0 1-2-1.7Z" {...s} />
          <path d="M8.6 8.8 10.9 4M15.4 8.8 13.1 4" {...s} />
          <path d="M10 12.4v3.4M14 12.4v3.4" {...s} />
        </>
      )}
      {name === 'tools' && (
        <>
          <path d="M14.2 6.6a3.4 3.4 0 0 0 4.5 4.4l2.1 2.1a1.6 1.6 0 0 1-2.3 2.3l-2.1-2.1a3.4 3.4 0 0 1-4.4-4.5Z" {...s} />
          <path d="M10.4 13.6 4.6 19.4a1.7 1.7 0 0 0 2.4 2.4l5.8-5.8" {...s} />
          <path d="M3.2 6.2 6 3.4l3.4 3.4-1.2 2.6-2.6 1.2Z" {...s} />
        </>
      )}
      {name === 'sofa' && (
        <>
          <path d="M4.4 11.2V8.6a2.2 2.2 0 0 1 2.2-2.2h10.8a2.2 2.2 0 0 1 2.2 2.2v2.6" {...s} />
          <path d="M3 13.2a2 2 0 0 1 4 0v2.4h10v-2.4a2 2 0 0 1 4 0v4.4a1.4 1.4 0 0 1-1.4 1.4H4.4A1.4 1.4 0 0 1 3 17.6Z" {...s} />
          <path d="M6 19v1.6M18 19v1.6" {...s} />
        </>
      )}
      {name === 'shirt' && (
        <>
          <path d="M9 3.6 12 6l3-2.4 5 2.6-1.8 4-2.2-.8v11H8v-11l-2.2.8-1.8-4Z" {...s} />
        </>
      )}
      {name === 'box' && (
        <>
          <path d="M12 3.2 20.4 7.6v8.8L12 20.8 3.6 16.4V7.6Z" {...s} />
          <path d="M3.6 7.6 12 12l8.4-4.4M12 12v8.8" {...s} />
        </>
      )}
      {name === 'shield-check' && (
        <>
          <path d="M12 3.2 19 5.8v5.4c0 4.2-2.8 7.4-7 9.6-4.2-2.2-7-5.4-7-9.6V5.8Z" {...s} />
          <path d="m8.9 11.9 2.2 2.2 4-4.3" {...s} />
        </>
      )}
      {name === 'lock' && (
        <>
          <rect x="4.4" y="10.2" width="15.2" height="10.2" rx="2.2" {...s} />
          <path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6" {...s} />
          <circle cx="12" cy="15.3" r="1.3" {...solid} />
        </>
      )}
      {name === 'truck' && (
        <>
          <path d="M2.8 6.4h10.4v9.8H2.8Z" {...s} />
          <path d="M13.2 9.6h3.6l3.4 3.2v3.4h-7Z" {...s} />
          <circle cx="7" cy="18" r="1.9" {...s} />
          <circle cx="17" cy="18" r="1.9" {...s} />
        </>
      )}
      {name === 'headset' && (
        <>
          <path d="M4.6 14.4v-2.6a7.4 7.4 0 0 1 14.8 0v2.6" {...s} />
          <rect x="2.8" y="13.4" width="4" height="5.6" rx="1.6" {...s} />
          <rect x="17.2" y="13.4" width="4" height="5.6" rx="1.6" {...s} />
          <path d="M19.4 19v.6a2.4 2.4 0 0 1-2.4 2.4h-2.6" {...s} />
        </>
      )}
      {name === 'radius' && (
        <>
          <circle cx="12" cy="12" r="8.4" strokeDasharray="3 3" {...s} />
          <circle cx="12" cy="12" r="1.6" {...solid} />
          <path d="M12 12h8.4" {...s} />
        </>
      )}
      {name === 'clock' && (
        <>
          <circle cx="12" cy="12" r="8.4" {...s} />
          <path d="M12 7.2V12l3.4 2" {...s} />
        </>
      )}
      {name === 'wallet' && (
        <>
          <path d="M3.6 8.2a2.2 2.2 0 0 1 2.2-2.2h10.4a2 2 0 0 1 2 2v1.4" {...s} />
          <rect x="3.6" y="8.2" width="16.8" height="10.4" rx="2.2" {...s} />
          <circle cx="16.2" cy="13.4" r="1.2" {...solid} />
        </>
      )}
      {name === 'tag' && (
        <>
          <path d="M11.4 3.4H20v8.6l-8.4 8.4a1.6 1.6 0 0 1-2.3 0l-6.3-6.3a1.6 1.6 0 0 1 0-2.3Z" {...s} />
          <circle cx="16.2" cy="7.8" r="1.5" {...s} />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="10.8" cy="10.8" r="6.4" {...s} />
          <path d="m15.6 15.6 4.2 4.2" {...s} />
        </>
      )}
      {name === 'pin' && (
        <>
          <path d="M12 21.2s6.6-5.6 6.6-10.4a6.6 6.6 0 1 0-13.2 0C5.4 15.6 12 21.2 12 21.2Z" {...s} />
          <circle cx="12" cy="10.6" r="2.4" {...s} />
        </>
      )}
      {name === 'chevron-right' && <path d="m9.5 5.5 6.5 6.5-6.5 6.5" {...s} />}
      {name === 'chevron-left' && <path d="M14.5 5.5 8 12l6.5 6.5" {...s} />}
      {name === 'chevron-down' && <path d="m5.5 9.5 6.5 6.5 6.5-6.5" {...s} />}
      {name === 'check' && <path d="m5.5 12.5 4.2 4.2 8.8-9.4" {...s} />}
      {name === 'arrow-right' && (
        <>
          <path d="M4.4 12h15.2" {...s} />
          <path d="m13.8 6.2 5.8 5.8-5.8 5.8" {...s} />
        </>
      )}
      {name === 'menu' && <path d="M4 7h16M4 12h16M4 17h16" {...s} />}
      {name === 'close' && <path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6" {...s} />}
      {name === 'star' && (
        <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L3.5 9.8l5.9-.8Z" {...solid} />
      )}
      {name === 'sparkle' && (
        <path d="M12 3.2 13.6 9 19.4 10.6 13.6 12.2 12 18 10.4 12.2 4.6 10.6 10.4 9Z" {...solid} />
      )}
      {name === 'phone' && (
        <path d="M6.2 3.8h3l1.5 3.7-1.9 1.3a11 11 0 0 0 5.4 5.4l1.3-1.9 3.7 1.5v3a1.7 1.7 0 0 1-1.9 1.7C9.5 17.7 6.3 14.5 4.5 5.7A1.7 1.7 0 0 1 6.2 3.8Z" {...s} />
      )}
      {name === 'mail' && (
        <>
          <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2.2" {...s} />
          <path d="m3.8 7.2 8.2 5.6 8.2-5.6" {...s} />
        </>
      )}
      {name === 'store' && (
        <>
          <path d="M4 9.6h16v9.2a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.8Z" {...s} />
          <path d="M3.4 9.6 5 4.4h14l1.6 5.2" {...s} />
          <path d="M9.6 20.4v-5.2h4.8v5.2" {...s} />
        </>
      )}
      {name === 'bike' && (
        <>
          <circle cx="5.6" cy="16.8" r="3.2" {...s} />
          <circle cx="18.4" cy="16.8" r="3.2" {...s} />
          <path d="M8.8 16.8h5.2l-2-8.2h-2.6" {...s} />
          <path d="m14 8.6 3 .8 1.4 7.4" {...s} />
        </>
      )}
      {name === 'users' && (
        <>
          <circle cx="9.4" cy="8.6" r="3.4" {...s} />
          <path d="M3.6 19.4a5.8 5.8 0 0 1 11.6 0" {...s} />
          <path d="M16 5.6a3.4 3.4 0 0 1 0 6.6M17.4 14.6a5.8 5.8 0 0 1 3 4.8" {...s} />
        </>
      )}
      {name === 'chart' && (
        <>
          <path d="M4 20h16" {...s} />
          <path d="M6.6 20v-6M11 20V7.4M15.4 20v-8.4M19.8 20v-4" {...s} />
        </>
      )}
      {name === 'refresh' && (
        <>
          <path d="M20.2 12a8.2 8.2 0 1 1-2.4-5.8" {...s} />
          <path d="M20.4 4.2v4.6h-4.6" {...s} />
        </>
      )}
      {name === 'facebook' && (
        <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.15v2.25H7.6V13h2.7v8Z" {...solid} />
      )}
      {name === 'instagram' && (
        <>
          <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="4.8" {...s} />
          <circle cx="12" cy="12" r="3.9" {...s} />
          <circle cx="16.8" cy="7.2" r="1.1" {...solid} />
        </>
      )}
      {name === 'x' && (
        <path d="M17.3 3.8h2.9l-6.3 7.2 7.4 9.2h-5.8l-4.5-5.6-5.2 5.6H2.9l6.7-7.7L2.5 3.8h5.9l4.1 5.1Zm-1 14.6h1.6L7.8 5.4H6.1Z" {...solid} />
      )}
      {name === 'linkedin' && (
        <path d="M4.9 3.5a2.1 2.1 0 1 1 0 4.2 2.1 2.1 0 0 1 0-4.2ZM3.2 9.2h3.4V21H3.2Zm6 0h3.25v1.6h.05a3.6 3.6 0 0 1 3.2-1.75c3.4 0 4.05 2.25 4.05 5.15V21h-3.4v-5.15c0-1.25 0-2.85-1.75-2.85s-2 1.35-2 2.75V21H9.2Z" {...solid} />
      )}
      {name === 'apple' && (
        <path d="M16.4 12.7c0-2.4 2-3.6 2.05-3.65-1.1-1.65-2.85-1.85-3.5-1.9-1.5-.15-2.9.85-3.65.85s-1.9-.85-3.15-.8a4.65 4.65 0 0 0-3.9 2.4c-1.65 2.9-.45 7.2 1.2 9.55.8 1.15 1.75 2.45 3 2.4 1.2-.05 1.65-.8 3.1-.8s1.85.8 3.1.75c1.3 0 2.1-1.15 2.9-2.3a10 10 0 0 0 1.3-2.7 4.2 4.2 0 0 1-2.45-3.8ZM14 5.6A4.1 4.1 0 0 0 15 2.6a4.25 4.25 0 0 0-2.75 1.45A3.9 3.9 0 0 0 11.2 7 3.5 3.5 0 0 0 14 5.6Z" {...solid} />
      )}
      {name === 'play' && (
        <path d="M3.9 2.6a1.5 1.5 0 0 0-.7 1.3v16.2a1.5 1.5 0 0 0 .7 1.3l9-9.4Zm10.4 8.1 2.6-2.7-9.5-5.4Zm0 2.6-6.9 8.1 9.5-5.4Zm1.4-1.3 3.4-1.9c1-.6 1-1.8 0-2.4l-3.4-1.9-2.75 3.1Z" {...solid} />
      )}
    </svg>
  );
}
