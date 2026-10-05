'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties, MouseEvent } from 'react';
import Icon from '@/components/ui/Icon';
import { collapse } from '@/lib/morph';

/**
 * The Back control on a page a card opened into. It shrinks the page
 * back into the card — stepping back in history when the visitor came from
 * it — and is a real link to `href`, so it works without JavaScript too.
 */
export default function MorphBack({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const onClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    collapse({ router, fallbackHref: href });
  };
  /* Frosted rather than refracting: it sits over a plain night field, where a
     bend has nothing to show and would only drag stray edges into a small
     pill. */
  return (
    <Link
      href={href}
      onClick={onClick}
      className="lg lg-raised inline-flex h-11 items-center gap-1 rounded-full pl-2.5 pr-4 text-[15px] font-semibold tracking-[-0.012em] transition-transform duration-500 ease-[var(--ease-ios)] active:scale-95"
      style={{ '--lg-radius': '999px', '--lg-tint': 'rgb(255 255 255 / 0.12)', color: '#fff' } as CSSProperties}>
      <Icon name="chevron-left" size={18} strokeWidth={2.1} />
      <span>{label}</span>
    </Link>
  );
}
