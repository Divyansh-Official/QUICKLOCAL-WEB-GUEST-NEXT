'use client';

import { useSyncExternalStore } from 'react';

/**
 * A media query read the way React wants an external value read: the server
 * snapshot is fixed, so hydration always matches, and the real value lands in
 * the same commit rather than a render later.
 */
export function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    onChange => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/** Reduced motion, or ?nomotion for screenshots. */
export function prefersCalm() {
  if (typeof window === 'undefined') return true;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('no-motion')
  );
}

const NO_SUBSCRIBE = () => () => {};
/** False on the server and in the hydrating render, true after. */
export function useHydrated() {
  return useSyncExternalStore(NO_SUBSCRIBE, () => true, () => false);
}
