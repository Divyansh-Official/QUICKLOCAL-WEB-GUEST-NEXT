import Link from 'next/link';

/**
 * The QuickLocal mark — the same PNG the console and the apps ship, so it is
 * the image people match against the icon on their phone — beside the
 * wordmark: QUICK in the surface's ink, LOCAL in tangerine, the word the
 * product is about carrying the colour. A plain <img>: a 9 KB square at a
 * fixed size gains nothing from the image optimiser.
 */
export default function Logo({ size = 34, tagline, label, href = '/' }: { size?: number; tagline?: string; label: string; href?: string }) {
  return (
    <Link href={href} aria-label={label} className="group inline-flex min-w-0 items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-128.png"
        alt=""
        width={size}
        height={size}
        decoding="async"
        aria-hidden
        className="shrink-0 select-none rounded-[28%] shadow-[0_6px_14px_-6px_rgb(240_134_38/0.6)] transition-transform duration-500 ease-[var(--ease-ios)] group-hover:scale-105"
        style={{ width: size, height: size }}
      />
      <span className="leading-none">
        <span className="block text-[17px] font-extrabold tracking-[-0.03em] text-fg">
          QUICK<span className="text-primary">LOCAL</span>
        </span>
        {tagline ? <span className="mt-1 block text-[9.5px] font-bold uppercase tracking-[0.14em] text-fg-3">{tagline}</span> : null}
      </span>
    </Link>
  );
}
