'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * A phone-only local nav, the way Apple's product pages carry one: a frosted
 * row of chips that sticks under the header once the hero has passed, lights
 * the section in view, and glides to any other. Plain anchors underneath, so
 * it works before hydration and without JavaScript.
 */
export default function QuickJump({ items, label }: { items: { id: string; label: string }[]; label: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const rail = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const targets = items.map(i => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting ? e.intersectionRect.height : 0);
        let best: string | undefined;
        let most = 0;
        for (const [id, h] of seen) {
          if (h > most) {
            most = h;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: '-120px 0px -35% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  // Keep the lit chip in view inside the rail.
  useEffect(() => {
    const el = rail.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const r = rail.current;
    if (!el || !r) return;
    r.scrollTo({ left: el.offsetLeft - (r.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <nav aria-label={label} className="quick-jump sm:hidden" data-print="hide">
      <ul ref={rail} className="chip-rail glass-blur flex gap-1 overflow-x-auto rounded-full p-1">
        {items.map(i => (
          <li key={i.id} data-id={i.id} className="flex-none">
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? 'true' : undefined}
              className="quick-jump-chip inline-flex h-8 items-center rounded-full px-3.5 text-[13px] font-bold">
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
