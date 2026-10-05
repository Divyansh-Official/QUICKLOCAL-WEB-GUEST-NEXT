'use client';

/**
 * The hero's handset, in real 3D: a body with thickness (layers along Z), a
 * lit bezel, a glare, and glass chips floating at different depths so they
 * part from the phone as it turns. It leans toward the pointer on a spring,
 * and straightens as the page scrolls (`.phone-scroll`, a scroll timeline).
 *
 * The screen is the ORDER TRACKING a customer actually gets — the real
 * OrderStatus sequence from lifecycle.json walking itself, a route drawing
 * from the shop to the door with the rider riding it. Everything on the screen
 * is sized in container units, so it is one drawing at every phone size.
 *
 * Touch and reduced motion get the resting pose; nothing here is needed to
 * read the page.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Icon from '@/components/ui/Icon';
import { Spring } from '@/lib/liquidMotion';
import { prefersCalm } from '@/lib/hooks';

type Step = { status: string; label: string; icon: string };
type Chip = { icon: string; title: string; text: string; position: string };

const ROUTE = 'M22 118 C 60 118 62 70 104 70 S 150 40 196 34';
const POS: Record<string, CSSProperties> = {
  tl: { top: '12%', left: '-34%', ['--z' as string]: '90px', ['--delay' as string]: '0s' },
  r: { top: '44%', right: '-38%', ['--z' as string]: '130px', ['--delay' as string]: '-2s' },
  bl: { bottom: '10%', left: '-30%', ['--z' as string]: '60px', ['--delay' as string]: '-4s' },
};

export default function Phone3D({
  steps,
  chips,
  labels,
  fees,
}: {
  steps: Step[];
  chips: Chip[];
  labels: { eyebrow: string; eta: string; shop: string; order: string; basket: string };
  fees: { label: string; value: string; strong?: boolean }[];
}) {
  const stage = useRef<HTMLDivElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(2);

  /* Lean toward the pointer, on springs. */
  useEffect(() => {
    const el = phone.current;
    const host = stage.current;
    if (!el || !host || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rx = new Spring(0.9, 0.7, 8);
    const ry = new Spring(0.9, 0.7, -18);
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? (now - last) / 1000 : 0.016;
      last = now;
      rx.step(dt);
      ry.step(dt);
      el.style.setProperty('--rx', `${rx.x.toFixed(2)}deg`);
      el.style.setProperty('--ry', `${ry.x.toFixed(2)}deg`);
      if (rx.settled(0.02) && ry.settled(0.02)) {
        frame = 0;
        last = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (prefersCalm()) return;
      const r = host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const px = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2)));
      const py = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2)));
      ry.target = -18 + px * 16;
      rx.target = 8 - py * 10;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  /* The order walks itself while the phone is on screen. */
  useEffect(() => {
    const host = stage.current;
    if (!host || prefersCalm()) return;
    let timer = 0;
    const io = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setActive(i => (i + 1) % steps.length), 2200);
    });
    io.observe(host);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [steps.length]);

  return (
    <div ref={stage} className="phone-stage select-none" aria-hidden="true">
      <div className="phone-scroll">
        <div ref={phone} className="phone" style={{ ['--pw' as string]: 'clamp(230px, 62vw, 300px)' }}>
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="phone-layer" style={{ ['--i' as string]: i + 1 } as CSSProperties} />
          ))}
          <div className="phone-front">
            <div className="phone-screen @container">
              <span className="phone-island" />
              <div className="flex h-full flex-col gap-[3.4cqw] px-[5cqw] pb-[5cqw] pt-[13cqw]">
                {/* ETA */}
                <div className="flex items-center justify-between rounded-[6cqw] bg-[#1a1713] px-[5cqw] py-[4.2cqw] text-white shadow-[0_8px_20px_-10px_rgb(0_0_0/0.6)]">
                  <div>
                    <p className="text-[3.6cqw] font-semibold uppercase tracking-[0.1em] text-white/60">{labels.eyebrow}</p>
                    <p className="mt-[1cqw] text-[8.4cqw] font-extrabold leading-none tracking-[-0.04em]">{labels.eta}</p>
                  </div>
                  <span className="live-ring relative grid h-[13cqw] w-[13cqw] place-items-center rounded-full bg-[#f08626]">
                    <Icon name="bike" size={22} strokeWidth={2} />
                  </span>
                </div>

                {/* Map */}
                <div className="relative overflow-hidden rounded-[6cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--fg)_6%,transparent)]">
                  <svg viewBox="0 0 220 140" className="block h-auto w-full">
                    <g stroke="color-mix(in oklab, var(--fg) 9%, transparent)" strokeWidth="7" strokeLinecap="round" fill="none">
                      <path d="M-10 96h240M-10 46h240M60 -10v160M150 -10v160" />
                    </g>
                    <g fill="color-mix(in oklab, var(--fg) 6%, transparent)">
                      <rect x="72" y="58" width="66" height="26" rx="5" />
                      <rect x="162" y="56" width="50" height="30" rx="5" />
                      <rect x="8" y="10" width="42" height="26" rx="5" />
                      <rect x="72" y="104" width="66" height="30" rx="5" />
                    </g>
                    <path d={ROUTE} fill="none" stroke="color-mix(in oklab, var(--primary) 26%, transparent)" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 7" />
                    <path className="route-draw" d={ROUTE} pathLength={1} fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
                    <g>
                      <circle cx="22" cy="118" r="9" fill="#1a1713" />
                      <path d="M17.5 116h9l-1-4h-7Zm1 2h7v4.5h-7Z" fill="#fff" />
                    </g>
                    <g>
                      <circle cx="196" cy="34" r="9" fill="#3e9f5c" />
                      <path d="m192 34 4-3.4 4 3.4v4h-8Z" fill="#fff" />
                    </g>
                    <g className="rider" style={{ offsetPath: `path('${ROUTE}')`, offsetDistance: '58%', offsetRotate: '0deg' } as CSSProperties}>
                      <circle r="8" fill="#fff" stroke="#f08626" strokeWidth="3" />
                      <circle r="3" fill="#f08626" />
                    </g>
                  </svg>
                  <span className="absolute left-[3.5cqw] top-[3.5cqw] rounded-full bg-[var(--card)] px-[2.8cqw] py-[1.2cqw] text-[3.2cqw] font-bold text-fg shadow-[0_2px_6px_rgb(0_0_0/0.12)]">
                    {labels.shop}
                  </span>
                </div>

                {/* Steps */}
                <ol className="flex flex-1 flex-col justify-center gap-[3.6cqw]">
                  {steps.map((step, i) => {
                    const done = i < active;
                    const now = i === active;
                    return (
                      <li key={step.status} className="flex items-center gap-[3cqw]">
                        <span
                          className={`relative grid h-[7.4cqw] w-[7.4cqw] shrink-0 place-items-center rounded-full transition-colors duration-500 ${
                            now ? 'live-ring bg-[#f08626] text-white' : done ? 'bg-[#3e9f5c] text-white' : 'bg-[color-mix(in_oklab,var(--fg)_9%,transparent)] text-fg-3'
                          }`}>
                          <Icon name={done ? 'check' : step.icon} size={12} strokeWidth={2.4} />
                        </span>
                        <span className={`text-[3.9cqw] font-bold tracking-[-0.02em] transition-colors duration-500 ${now ? 'text-primary-ink' : done ? 'text-fg' : 'text-fg-3'}`}>
                          {step.label}
                        </span>
                        <span className="ml-auto font-mono text-[2.6cqw] text-fg-3">{done ? '✓' : now ? '•••' : ''}</span>
                      </li>
                    );
                  })}
                </ol>

                {/* Fees */}
                <div className="rounded-[5cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] px-[4.4cqw] py-[3.4cqw]">
                  <div className="mb-[1.6cqw] flex items-center justify-between text-[3.1cqw] text-fg-3">
                    <span>{labels.order}</span>
                    <span>{labels.basket}</span>
                  </div>
                  {fees.map(f => (
                    <div key={f.label} className="flex items-center justify-between py-[0.6cqw] text-[3.5cqw]">
                      <span className={f.strong ? 'font-bold text-fg' : 'text-fg-2'}>{f.label}</span>
                      <span className={`tnum font-extrabold ${f.strong ? 'text-[#3e9f5c]' : 'text-fg'}`}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <span className="phone-glare" />

          {chips.map(chip => (
            <div key={chip.title} className="float-chip hidden sm:block" style={POS[chip.position] ?? POS.tl}>
              <div className="chip-solid flex items-center gap-2.5 whitespace-nowrap rounded-2xl py-2.5 pl-2.5 pr-4">
                <span className="icon-tile" style={{ ['--s' as string]: '34px' } as CSSProperties}>
                  <Icon name={chip.icon} size={17} strokeWidth={1.9} />
                </span>
                <span>
                  <span className="block text-[13px] font-extrabold tracking-[-0.02em] text-fg">{chip.title}</span>
                  <span className="block text-[11.5px] text-fg-3">{chip.text}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <span className="phone-shadow" />
    </div>
  );
}
