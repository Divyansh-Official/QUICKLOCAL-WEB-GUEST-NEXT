'use client';

import { Children, useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Icon from './Icon';

/**
 * Apple's horizontal shelf: native scrolling with snap, so touch, trackpad
 * and keyboard all work. The first card lines up with the page shell and the
 * row bleeds to the viewport edge. Paddles appear on devices with a pointer
 * and disable themselves at either end.
 */
export default function Shelf({
  children,
  label,
  itemWidth,
  labels,
  className = '',
}: {
  children: ReactNode;
  label: string;
  itemWidth?: string;
  labels: { previous: string; next: string };
  className?: string;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [state, setState] = useState({ prev: false, next: true, overflow: true });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({ prev: el.scrollLeft > 4, next: el.scrollLeft < max - 4, overflow: max > 4 });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [update]);

  const page = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div className={className} data-reveal="">
      <ul ref={ref} className="shelf" style={itemWidth ? ({ '--shelf-item': itemWidth } as CSSProperties) : undefined} aria-label={label}>
        {Children.toArray(children).map((child, i) => (
          <li key={i}>{child}</li>
        ))}
      </ul>
      {state.overflow ? (
        <div className="shell -mt-4 hidden justify-end gap-3 [@media(hover:hover)]:flex" data-print="hide">
          <button type="button" className="icon-btn btn-glass" onClick={() => page(-1)} disabled={!state.prev} aria-label={labels.previous}>
            <Icon name="chevron-left" size={18} strokeWidth={2} />
          </button>
          <button type="button" className="icon-btn btn-glass" onClick={() => page(1)} disabled={!state.next} aria-label={labels.next}>
            <Icon name="chevron-right" size={18} strokeWidth={2} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
