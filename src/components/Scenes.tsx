/**
 * The animated illustrations.
 *
 * ── ANIMATED SVG, NOT LOTTIE ────────────────────────────────────────────────
 * Lottie means a runtime (~250 KB of lottie-web), plus a JSON file per scene
 * exported from After Effects — and there are no QuickLocal Lottie files to
 * export from, so they would have to be someone else's artwork. These are the
 * same idea done natively: SMIL/CSS-animated inline SVG that takes the theme's
 * own colours, weighs a few hundred bytes, needs no runtime, and stays sharp.
 *
 * Everything animates transform and opacity so it composites, every scene is
 * aria-hidden because none of them carry information the text does not, and
 * all of it stops under prefers-reduced-motion via the rules in globals.css.
 */
import type { CSSProperties } from 'react';

const TANGERINE = 'var(--color-tangerine-500)';
const TANGERINE_SOFT = 'var(--color-tangerine-300)';
const INK = 'var(--color-ink-950)';
const OK = 'var(--color-ok)';

/** Shorthand for the staggered floats below. */
const float = (delay: number, dur = 5): CSSProperties => ({
  animation: `ql-float ${dur}s ease-in-out ${delay}s infinite`,
});

// ── delivery ────────────────────────────────────────────────────────────────

/**
 * A rider crossing a street, wheels turning, with the route drawing itself
 * behind them. The scene loops without a cut because the rider leaves one edge
 * as the route resets.
 */
export function RiderScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={className} aria-hidden>
      {/* route */}
      <path
        d="M8 118 C 60 118, 62 60, 116 60 S 178 104, 232 104"
        fill="none"
        stroke="var(--color-cream-300)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="7 8"
      />
      <path
        d="M8 118 C 60 118, 62 60, 116 60 S 178 104, 232 104"
        fill="none"
        stroke={TANGERINE}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="300"
        style={{ animation: 'ql-draw 4.5s ease-in-out infinite' }}
      />

      {/* start pin */}
      <g style={float(0)}>
        <circle cx="8" cy="118" r="7" fill={TANGERINE} />
        <circle cx="8" cy="118" r="2.6" fill="#fff" />
      </g>

      {/* destination pin */}
      <g style={float(1.2)}>
        <path d="M232 88 a9 9 0 0 1 9 9c0 6-9 15-9 15s-9-9-9-15a9 9 0 0 1 9-9Z" fill={OK} />
        <circle cx="232" cy="97" r="3.2" fill="#fff" />
      </g>

      {/* rider, riding the path */}
      <g style={{ animation: 'ql-ride 4.5s ease-in-out infinite' }}>
        <g transform="translate(-13 -13)">
          <circle cx="7" cy="19" r="5.4" fill="none" stroke={INK} strokeWidth="2.2" />
          <circle cx="21" cy="19" r="5.4" fill="none" stroke={INK} strokeWidth="2.2" />
          <path d="M7 19h7l-2.6-9H8" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          <path d="m14 10 3.4.9L21 19" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
          {/* the parcel */}
          <rect x="9.5" y="1.5" width="9" height="7.5" rx="1.6" fill={TANGERINE} />
          <path d="M14 1.5v7.5" stroke="#fff" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  );
}

// ── shop ────────────────────────────────────────────────────────────────────

/** A shopfront with its awning and a "verified" tick settling onto it. */
export function ShopScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={className} aria-hidden>
      <rect x="34" y="62" width="132" height="70" rx="6" fill="var(--color-cream-100)" />
      <rect x="34" y="62" width="132" height="70" rx="6" fill="none" stroke="var(--color-cream-300)" strokeWidth="2" />

      {/* awning */}
      <path d="M28 62 34 40h132l6 22Z" fill={TANGERINE} />
      {[0, 1, 2, 3, 4].map(i => (
        <path
          key={i}
          d={`M${40 + i * 28} 62 ${44 + i * 28} 40h14l-4 22Z`}
          fill={TANGERINE_SOFT}
          opacity="0.55"
        />
      ))}

      {/* door and window */}
      <rect x="86" y="86" width="28" height="46" rx="3" fill="#fff" stroke="var(--color-cream-300)" strokeWidth="2" />
      <circle cx="107" cy="110" r="1.8" fill={INK} />
      <rect x="48" y="86" width="26" height="22" rx="3" fill="#fff" stroke="var(--color-cream-300)" strokeWidth="2" />
      <rect x="126" y="86" width="26" height="22" rx="3" fill="#fff" stroke="var(--color-cream-300)" strokeWidth="2" />

      {/* verified badge, dropping in and settling */}
      <g style={{ animation: 'ql-stamp 4s cubic-bezier(.22,1,.36,1) infinite' }}>
        <circle cx="156" cy="52" r="16" fill={OK} />
        <path d="m148.5 52.5 5 5 10-11" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// ── phone ───────────────────────────────────────────────────────────────────

/** A handset with order rows sliding up through it, endlessly. */
export function PhoneScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 220" className={className} aria-hidden>
      <rect x="26" y="8" width="108" height="204" rx="18" fill={INK} />
      <rect x="32" y="14" width="96" height="192" rx="13" fill="#fff" />
      <rect x="66" y="19" width="28" height="4" rx="2" fill={INK} opacity=".35" />

      {/* header */}
      <rect x="40" y="32" width="80" height="26" rx="6" fill={TANGERINE} />
      <rect x="46" y="40" width="30" height="4" rx="2" fill="#fff" opacity=".85" />
      <rect x="46" y="48" width="46" height="4" rx="2" fill="#fff" opacity=".55" />

      {/* the scrolling list, clipped to the screen */}
      <clipPath id="ql-phone-screen">
        <rect x="32" y="64" width="96" height="136" rx="8" />
      </clipPath>
      <g clipPath="url(#ql-phone-screen)">
        <g style={{ animation: 'ql-scroll-up 9s linear infinite' }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <g key={i} transform={`translate(0 ${68 + i * 34})`}>
              <rect x="40" y="0" width="80" height="28" rx="6" fill="var(--color-cream-100)" />
              <circle cx="52" cy="14" r="6" fill={i % 3 === 0 ? OK : TANGERINE_SOFT} />
              <rect x="63" y="8" width="34" height="4" rx="2" fill={INK} opacity=".35" />
              <rect x="63" y="17" width="22" height="3.5" rx="1.75" fill={INK} opacity=".18" />
            </g>
          ))}
        </g>
      </g>

      {/* the pulse on the live order */}
      <circle cx="118" cy="76" r="4" fill={OK}>
        <animate attributeName="opacity" values="1;.25;1" dur="1.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ── envelope ────────────────────────────────────────────────────────────────

/** For the newsletter — a letter lifting out of its envelope, on a loop. */
export function MailScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <g style={{ animation: 'ql-lift 3.6s ease-in-out infinite' }}>
        <rect x="34" y="18" width="52" height="38" rx="4" fill="#fff" stroke="var(--color-cream-300)" strokeWidth="2" />
        <rect x="42" y="28" width="30" height="3.4" rx="1.7" fill={TANGERINE} />
        <rect x="42" y="36" width="36" height="3" rx="1.5" fill={INK} opacity=".22" />
        <rect x="42" y="43" width="22" height="3" rx="1.5" fill={INK} opacity=".22" />
      </g>
      <path d="M24 44h72v38a5 5 0 0 1-5 5H29a5 5 0 0 1-5-5Z" fill={TANGERINE} />
      <path d="M24 44 60 70 96 44" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  );
}

// ── download ────────────────────────────────────────────────────────────────

/** A handset with an arrow dropping into it — the app landing on the phone. */
export function DownloadScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 180" className={className} aria-hidden>
      <circle cx="90" cy="90" r="72" fill="var(--color-tangerine-500)" opacity=".08" />
      <circle cx="90" cy="90" r="52" fill="var(--color-tangerine-500)" opacity=".10">
        <animate attributeName="r" values="52;60;52" dur="3.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values=".10;.02;.10" dur="3.4s" repeatCount="indefinite" />
      </circle>

      <rect x="60" y="52" width="60" height="102" rx="12" fill={INK} />
      <rect x="65" y="57" width="50" height="92" rx="8" fill="#fff" />
      <rect x="80" y="61" width="20" height="3" rx="1.5" fill={INK} opacity=".3" />

      {/* the arrow, dropping in and repeating */}
      <g style={{ animation: 'ql-drop 2.6s cubic-bezier(.22,1,.36,1) infinite' }}>
        <path d="M90 76v34" stroke={TANGERINE} strokeWidth="6" strokeLinecap="round" />
        <path d="m78 100 12 12 12-12" fill="none" stroke={TANGERINE} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <rect x="74" y="126" width="32" height="5" rx="2.5" fill={TANGERINE} opacity=".55" />
    </svg>
  );
}
