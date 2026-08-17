/**
 * Reveals its children when they scroll into view.
 *
 * ── ONE OBSERVER, NOT ONE PER ELEMENT ───────────────────────────────────────
 * A page like this has sixty-odd revealed elements. Sixty IntersectionObservers
 * is sixty callbacks the browser juggles on every scroll; one shared observer
 * with sixty targets is a single callback that receives only what changed.
 *
 * ── IT UNOBSERVES AFTER FIRING ──────────────────────────────────────────────
 * The animation plays once. Leaving elements observed would keep the callback
 * doing work for the rest of the session, and re-animating a section every time
 * it scrolls past is the thing that makes marketing pages feel restless.
 *
 * ── IT SURVIVES HAVING NO OBSERVER AT ALL ───────────────────────────────────
 * If IntersectionObserver is missing, everything is marked visible immediately.
 * The failure mode of an animation library must never be an invisible page.
 *
 * ── WHAT IS ALREADY ON SCREEN IS NEVER LEFT TO THE OBSERVER ─────────────────
 * On mount, anything at or above the fold is revealed directly and never
 * observed at all. The observer is only for content still below it.
 *
 * This is not an optimisation, it is the correctness fix. Two ways the
 * observer alone leaves content permanently invisible:
 *
 *   · A refresh restores the scroll position and a #hash link lands mid-page.
 *     Everything ABOVE the viewport is not intersecting, and scrolling down
 *     never makes it so — an invisible top half of the page.
 *
 *   · An element inside a horizontally scrolling rail is measured against the
 *     intersection of the viewport AND that rail. The category cards sat fully
 *     on screen and still never fired, because the observer's first callback
 *     resolved against a layout that had not settled.
 *
 * A direct measurement at mount answers both, and answers them before paint
 * rather than a callback later.
 */
'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type Animation = 'rise' | 'fade' | 'scale' | 'left' | 'right';

/** Shared by every Reveal on the page; created on first use. */
let observer: IntersectionObserver | null = null;

function shared(): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  observer ??= new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer?.unobserve(entry.target);
      }
    },
    // A little way into the viewport, so the movement is already under way by
    // the time the element is properly in view rather than starting at the edge.
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );
  return observer;
}

export function Reveal({
  children,
  as: Tag = 'div',
  anim = 'rise',
  delay = 0,
  className = '',
  ...rest
}: {
  children: ReactNode;
  as?: ElementType;
  anim?: Animation;
  /** Milliseconds. Used to stagger siblings — see the grids. */
  delay?: number;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = shared();
    if (!io) {
      // No observer: show it rather than leaving it at opacity 0 forever.
      el.classList.add('is-in');
      return;
    }

    // At or above the fold already: reveal it now. Elements on screen still
    // animate — the class drives the animation — they simply do not wait for a
    // callback that may never come. See the note above.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-in');
      return;
    }

    io.observe(el);
    return () => io.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      data-anim={anim}
      className={`reveal ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      {...rest}>
      {children}
    </Tag>
  );
}
