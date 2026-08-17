/**
 * The QuickLocal mark — the real one.
 *
 * The same PNG the admin console and the mobile apps ship, copied from the
 * console's own public folder rather than redrawn. This is the image people
 * will match against the app icon on their phone, so a lookalike is not good
 * enough.
 *
 * ── A PLAIN <img>, NOT next/image ───────────────────────────────────────────
 * The optimizer earns its keep on large photographs whose dimensions are not
 * known in advance. This is a 9 KB square rendered at 34 CSS pixels, at a size
 * fixed in code. Routing it through /_next/image would add a runtime hop and a
 * native `sharp` dependency to produce a file no smaller than the one already
 * sitting in `public/` — and logo-128 covers a 34px slot to well past 2x, so
 * there is no retina variant to pick either.
 */

/* eslint-disable @next/next/no-img-element */
export function LogoMark({ size = 34, priority = false }: { size?: number; priority?: boolean }) {
  return (
    <img
      src="/logo-128.png"
      alt=""
      width={size}
      height={size}
      // The header's mark is above the fold on every page; everything else can
      // wait its turn.
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      // Decorative — `Logo` supplies the readable name beside it, and a second
      // announcement of "QuickLocal" helps nobody.
      aria-hidden
      className="shrink-0 select-none"
      style={{ width: size, height: size }}
    />
  );
}

export function Logo({
  size = 34,
  tone = 'dark',
  withTagline = false,
  priority = false,
}: {
  size?: number;
  /** 'dark' for cream surfaces, 'light' for the footer. */
  tone?: 'dark' | 'light';
  withTagline?: boolean;
  /** True for the header's copy, which is above the fold on every page. */
  priority?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={size} priority={priority} />
      <span className="leading-none">
        <span
          className={`block text-[17px] font-extrabold tracking-tight ${
            tone === 'light' ? 'text-[var(--color-cream-50)]' : 'text-[var(--color-ink-950)]'
          }`}>
          QUICKLOCAL
        </span>
        {withTagline ? (
          <span
            className={`mt-1 block text-[9px] font-semibold uppercase tracking-[0.13em] ${
              tone === 'light' ? 'text-[var(--color-cream-300)]' : 'text-[var(--text-muted)]'
            }`}>
            Everything Local, Delivered
          </span>
        ) : null}
      </span>
    </span>
  );
}
