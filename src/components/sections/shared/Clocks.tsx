import type { CSSProperties } from 'react';
import Reveal from '@/components/motion/Reveal';

export type Clock = { value: number | string; unit: string; max: number; title: string; text: string };

const TICKS = Array.from({ length: 12 }, (_, i) => i);

/**
 * The timers the platform runs on every order, as watch faces: a ring that
 * fills to the timer's share of its scale as it scrolls into view (a view
 * timeline — no observer), twelve ticks, and the figure in the middle. Each
 * one ends in something happening; the caption says what.
 */
export default function Clocks({ items }: { items: Clock[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
      {items.map((c, i) => {
        const value = Number(c.value);
        const p = Math.max(0.04, Math.min(1, value / c.max));
        return (
          <Reveal as="li" key={c.title} index={i} className="flex">
            <div className="glass hover-lift flex w-full flex-col items-center rounded-[var(--radius-card)] px-6 pb-7 pt-8 text-center">
              <span className="clock relative grid h-[132px] w-[132px] place-items-center" style={{ '--p': p } as CSSProperties}>
                <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="color-mix(in oklab, var(--fg) 8%, transparent)" strokeWidth="8" />
                  <circle className="clock-ring" cx="60" cy="60" r="50" fill="none" stroke={`url(#clock-grad-${i})`} strokeWidth="8" strokeLinecap="round" pathLength={1} />
                  <defs>
                    <linearGradient id={`clock-grad-${i}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor="var(--grad-a)" />
                      <stop offset="1" stopColor="var(--accent)" />
                    </linearGradient>
                  </defs>
                </svg>
                <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  {TICKS.map(t => (
                    <line
                      key={t}
                      x1="60"
                      y1="22"
                      x2="60"
                      y2={t % 3 === 0 ? 28 : 25.5}
                      stroke="color-mix(in oklab, var(--fg) 26%, transparent)"
                      strokeWidth={t % 3 === 0 ? 2 : 1.2}
                      strokeLinecap="round"
                      transform={`rotate(${t * 30} 60 60)`}
                    />
                  ))}
                </svg>
                <span className="relative">
                  <span className="tnum block text-[40px] font-extrabold leading-none tracking-[-0.05em] text-fg">{c.value}</span>
                  <span className="mt-1 block text-[12px] font-extrabold uppercase tracking-[0.14em] text-fg-3">{c.unit}</span>
                </span>
              </span>
              <h3 className="mt-6 text-[17px] font-extrabold tracking-[-0.025em] text-fg">{c.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-fg-2">{c.text}</p>
            </div>
          </Reveal>
        );
      })}
    </ul>
  );
}
