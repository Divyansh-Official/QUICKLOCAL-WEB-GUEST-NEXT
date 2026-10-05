'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { CSSProperties, MouseEvent } from 'react';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Icon from '@/components/ui/Icon';
import { collapse } from '@/lib/morph';

/**
 * The glass Back control on a page a card opened into. It shrinks the page
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
  return (
    <LiquidGlass
      as={Link}
      href={href}
      onClick={onClick}
      radius={999}
      strength="soft"
      elevation="raised"
      interactive
      className="inline-flex h-11 items-center gap-1 rounded-full pl-2.5 pr-4 text-[15px] font-semibold tracking-[-0.012em]"
      style={{ '--lg-tint': 'rgb(255 255 255 / 0.14)', '--lg-tint-live': 'rgb(255 255 255 / 0.08)', color: '#fff' } as CSSProperties}>
      <Icon name="chevron-left" size={18} strokeWidth={2.1} />
      <span>{label}</span>
    </LiquidGlass>
  );
}
