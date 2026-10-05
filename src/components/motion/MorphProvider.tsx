'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';
import { routeCommitted } from '@/lib/morph';

/**
 * Tells the zoom engine when a new route is on screen. It sits after <main>,
 * so by the time this layout effect runs the new page has mounted and been
 * scrolled into place — and the browser has not painted yet.
 */
export default function MorphProvider() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    routeCommitted(pathname);
  }, [pathname]);
  return null;
}
