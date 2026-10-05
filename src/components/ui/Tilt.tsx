'use client';

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { Spring } from '@/lib/liquidMotion';
import { prefersCalm } from '@/lib/hooks';

/**
 * A surface that leans toward the pointer in 3D and catches the light where
 * it points — on springs, so it settles like an object rather than snapping.
 * Pointer devices only; touch and reduced motion leave it flat. Writes CSS
 * variables directly, so it never re-renders.
 */
export default function Tilt({
  as: Tag = 'div',
  max = 7,
  className = '',
  style,
  children,
  glare = true,
}: {
  as?: ElementType;
  max?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  glare?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rx = new Spring(0.42, 0.78, 0);
    const ry = new Spring(0.42, 0.78, 0);
    const g = new Spring(0.5, 1, 0);
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0.016;
      last = now;
      rx.step(dt);
      ry.step(dt);
      g.step(dt);
      el.style.setProperty('--rx', `${rx.x.toFixed(3)}deg`);
      el.style.setProperty('--ry', `${ry.x.toFixed(3)}deg`);
      el.style.setProperty('--glare', g.x.toFixed(3));
      if (rx.settled(0.01) && ry.settled(0.01) && g.settled(0.005)) {
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (prefersCalm()) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry.target = (px - 0.5) * 2 * max;
      rx.target = -(py - 0.5) * 2 * max;
      g.target = 1;
      el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
      kick();
    };
    const leave = () => {
      rx.target = 0;
      ry.target = 0;
      g.target = 0;
      kick();
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, [max]);

  return (
    <Tag ref={ref} className={`tilt ${className}`} style={style}>
      {children}
      {glare ? <span className="tilt-glare" aria-hidden="true" /> : null}
    </Tag>
  );
}
