'use client';

import { useEffect, useRef } from 'react';
import { prefersCalm } from '@/lib/hooks';

/**
 * A figure that counts up the first time it scrolls into view.
 *
 * The server renders the real value — what crawlers, screen readers and a
 * visitor without JavaScript see. Only a figure still BELOW the fold at mount
 * is wound back to zero, and that happens before it can be seen, so nobody
 * ever watches a number drop to 0 and climb again. A figure already on screen
 * is left alone. "₹30", "3 hrs", "2%": the first number in the string moves.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = /(\d[\d,]*\.?\d*)/.exec(value);
    if (!el || !match || prefersCalm() || !('IntersectionObserver' in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const target = Number(match[1].replace(/,/g, ''));
    const decimals = (match[1].split('.')[1] || '').length;
    const before = value.slice(0, match.index);
    const after = value.slice(match.index + match[1].length);
    const format = (n: number) =>
      `${before}${n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${after}`;

    el.textContent = format(0);
    let frame = 0;
    const io = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          el.textContent = format(target * (1 - Math.pow(1 - t, 4)));
          if (t < 1) frame = requestAnimationFrame(tick);
          else el.textContent = value;
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
