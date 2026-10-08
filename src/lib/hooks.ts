'use client';

let locks = 0;
/**
 * Holds the page still behind a sheet (the phone menu, search). Counted, so a
 * sheet opened from another keeps the page locked until both have closed.
 */
export function lockPage(on: boolean) {
  locks = Math.max(0, locks + (on ? 1 : -1));
  document.documentElement.classList.toggle('page-locked', locks > 0);
}

/** Reduced motion, or ?nomotion for screenshots. */
export function prefersCalm() {
  if (typeof window === 'undefined') return true;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('no-motion')
  );
}
