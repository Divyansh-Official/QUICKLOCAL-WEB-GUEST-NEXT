'use client';

import { useEffect, type ReactNode } from 'react';
import { isMorphing } from '@/lib/morph';

/**
 * A soft rise on client-side navigation (app/template.tsx remounts on each
 * route). The first load is never animated, and a page a card is zooming into
 * holds still: the zoom is its transition.
 */
let hasNavigated = false;

export default function PageTransition({ children, enabled = true }: { children: ReactNode; enabled?: boolean }) {
  const animate = enabled && hasNavigated && !isMorphing();
  useEffect(() => {
    hasNavigated = true;
  }, []);
  return <div className={animate ? 'page-enter' : undefined}>{children}</div>;
}
