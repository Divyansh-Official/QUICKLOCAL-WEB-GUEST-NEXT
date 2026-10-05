'use client';

/**
 * Phone navigation — an iOS 26-style floating tab bar of liquid glass, in the
 * thumb zone. Like iOS's it minimises to its icons while you scroll down and
 * returns the moment you scroll up. One passive listener read once a frame;
 * state changes only when the direction does, so scrolling causes no renders.
 * The body reserves room for it below 768px only.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LiquidGlass from '@/components/glass/LiquidGlass';
import Icon from '@/components/ui/Icon';

export default function TabBar({ items, label }: { items: { label: string; href: string; icon: string; primary?: boolean }[]; label: string }) {
  const pathname = usePathname() || '/';
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 8) return;
      if (Math.abs(delta) < 400) setCompact(delta > 0 && y > 160);
      last = y;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompact(false);
  }, [pathname]);

  const active = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav
      aria-label={label}
      className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom,0px))] z-[75] md:hidden"
      data-print="hide"
      data-chrome="tabbar"
      data-compact={compact ? '' : undefined}
      onFocus={() => setCompact(false)}>
      <LiquidGlass radius={999} strength="soft" elevation="float" interactive className="tabbar-surface mx-auto flex h-[64px] max-w-md items-center gap-1 rounded-full p-1.5">
        {items.map(item => {
          const on = active(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? 'page' : undefined}
              className={`flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-bold tracking-[-0.005em] transition-colors ${
                item.primary
                  ? 'btn-primary'
                  : on
                    ? 'bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-primary-ink'
                    : 'text-fg-2 active:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]'
              }`}>
              <Icon name={item.icon} size={20} strokeWidth={1.9} className="tabbar-icon" />
              <span className="tabbar-label">{item.label}</span>
            </Link>
          );
        })}
      </LiquidGlass>
    </nav>
  );
}
