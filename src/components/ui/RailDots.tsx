'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Dots under a swipe rail (`.m-rail`), placed right after it. It reads the
 * rail's own scroll position — one passive listener, one state change per
 * card — and fills the dot of the card nearest the middle. Phones only (CSS);
 * decorative, since the rail itself is the control.
 */
export default function RailDots({ count }: { count: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);

  useEffect(() => {
    const rail = ref.current?.previousElementSibling as HTMLElement | null;
    if (!rail) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const items = Array.from(rail.children) as HTMLElement[];
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0;
      let dist = Infinity;
      items.forEach((el, i) => {
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      setOn(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      rail.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="rail-dots" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i key={i} data-on={i === on ? '' : undefined} />
      ))}
    </div>
  );
}
