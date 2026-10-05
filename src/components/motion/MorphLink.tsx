'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';
import { canAnimate, expand, morphSurface } from '@/lib/morph';

/**
 * A link whose card zooms open into the page it leads to. A modifier click,
 * a middle click and reduced motion all get an ordinary link. `data-morph-key`
 * lets the page find this card again to shrink back into it.
 */
export default function MorphLink({ href, onClick, children, ...rest }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  const handle = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!canAnimate()) return;
    event.preventDefault();
    expand({ source: morphSurface(event.currentTarget), href, go: () => router.push(href) });
  };
  return (
    <Link href={href} onClick={handle} data-morph-key={href} {...rest}>
      {children}
    </Link>
  );
}
