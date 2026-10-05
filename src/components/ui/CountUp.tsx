'use client';

import { useEffect, useRef } from 'react';
import { prefersCalm } from '@/lib/hooks';

/**
 * A figure that counts up the first time it scrolls into view. The server
 * renders the real value — what crawlers, screen readers and a visitor
 * without JavaScript see — and the count only rewrites the text node once,
 * from 0 back to that same value. "₹30", "3 hrs", "2%" all work: the first
 * number in the string is the one that moves.
 */
export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const match = /(\d[\d,]*\.?\d*)/.exec(value);
    if (!el || !match || prefersCalm() || !('IntersectionObserver' in window)) return;
    const target = Number(match[1].replace(/,/g, ''));
    const decimals = (match[1].split('.')[1] || '').length;
    const [before, after] = [value.slice(0, match.index), value.slice(match.index + match[1].length)];
    let frame = 0;
    const io = new IntersectionObserver(
      entries => {
        if (!entries.some(e => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          const n = target * eased;
          el.textContent = `${before}${n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${after}`;
          if (t < 1) frame = requestAnimationFrame(tick);
          else el.textContent = value;
        };
        frame = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
