'use client';

/**
 * One order, told as a scroll story.
 *
 * On a wide screen the handset holds still beside the steps (sticky) and its
 * screen changes scene as each step crosses the middle of the viewport; the
 * handset itself turns a little across the whole story, on a view timeline.
 * A rail down the steps fills as you go. On a phone there is no room for a
 * sticky handset, so each step carries its own screen, inline.
 *
 * The active step is one IntersectionObserver with a zero-height band at the
 * centre of the viewport — no scroll listener. Scenes animate by CSS when
 * `data-active` lands on them; with reduced motion or ?nomotion they simply
 * show their final frame.
 */
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import PhoneShell from '@/components/art/PhoneShell';
import Icon from '@/components/ui/Icon';
import { fillLive } from '@/lib/format';

export type JourneyStep = {
  key: string;
  icon: string;
  who: string;
  title: string;
  text: string;
  screen: { title: string; chip: string; rows: string[]; code?: string; badge?: string; totalLabel?: string; button?: string };
};

const ROUTE = 'M22 118 C 60 118 62 70 104 70 S 150 40 196 34';

const split = (row: string) => {
  const at = row.lastIndexOf(' · ');
  return at < 0 ? [row, ''] : [row.slice(0, at), row.slice(at + 3)];
};
const k = (n: number) => ({ '--k': n }) as CSSProperties;

function Rows({ rows, icon, start = 0 }: { rows: string[]; icon?: string; start?: number }) {
  return (
    <ul className="space-y-[2.4cqw]">
      {rows.map((row, i) => {
        const [label, value] = split(row);
        return (
          <li key={row} className="sc-pop flex items-center gap-[3cqw] rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] px-[3.6cqw] py-[2.8cqw]" style={k(start + i)}>
            {icon ? (
              <span className="grid h-[7cqw] w-[7cqw] flex-none place-items-center rounded-full bg-primary-soft text-primary-ink">
                <Icon name={icon} size={12} strokeWidth={2.2} />
              </span>
            ) : null}
            <span className="min-w-0 flex-1 truncate text-[3.7cqw] font-bold tracking-[-0.015em] text-fg">{label}</span>
            {value ? <span className="tnum flex-none text-[3.5cqw] font-extrabold text-fg-2">{value}</span> : null}
          </li>
        );
      })}
    </ul>
  );
}

function Code({ code, badge }: { code: string; badge?: string }) {
  const digits = code.split(' ');
  return (
    <div className="flex flex-col items-center">
      <span className="grid h-[16cqw] w-[16cqw] place-items-center rounded-full bg-primary-soft text-primary-ink">
        <Icon name="key" size={26} strokeWidth={1.9} />
      </span>
      <div className="mt-[6cqw] flex gap-[2.6cqw]">
        {digits.map((d, i) => (
          <span key={i} className="sc-digit grid h-[17cqw] w-[13.5cqw] place-items-center rounded-[3.6cqw] bg-card text-[8cqw] font-extrabold tracking-[-0.04em] text-fg shadow-[inset_0_0_0_1.5px_var(--hair),0_6px_14px_-8px_rgb(0_0_0/0.3)]" style={k(i)}>
            {d}
          </span>
        ))}
      </div>
      {badge ? (
        <span className="sc-pop mt-[5cqw] inline-flex items-center gap-[1.6cqw] rounded-full bg-[color-mix(in_oklab,var(--ok)_16%,transparent)] px-[3.4cqw] py-[1.4cqw] text-[3.4cqw] font-extrabold text-ok-ink" style={k(6)}>
          <Icon name="check" size={12} strokeWidth={2.6} />
          {badge}
        </span>
      ) : null}
    </div>
  );
}

function Body({ step }: { step: JourneyStep }) {
  const s = step.screen;
  switch (step.key) {
    case 'browse':
      return (
        <>
          <div className="relative mx-auto aspect-square w-[70cqw]">
            {[1, 0.68, 0.36].map((r, i) => (
              <span key={r} className="sc-ring absolute rounded-full border border-[color-mix(in_oklab,var(--primary)_30%,transparent)] bg-[color-mix(in_oklab,var(--primary)_5%,transparent)]" style={{ inset: `${((1 - r) / 2) * 100}%`, ...k(i) }} />
            ))}
            <span className="absolute left-1/2 top-1/2 grid h-[11cqw] w-[11cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-white shadow-[0_6px_16px_-6px_rgb(240_134_38/0.9)]">
              <Icon name="home" size={16} strokeWidth={2.2} />
            </span>
            {[
              { left: '24%', top: '30%' },
              { left: '72%', top: '40%' },
              { left: '58%', top: '78%' },
            ].map((pos, i) => (
              <span key={i} className="sc-pop absolute grid h-[8cqw] w-[8cqw] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#1a1713] text-white dark:bg-[#f8f4ef] dark:text-[#1a1713]" style={{ ...pos, ...k(i + 2) }}>
                <Icon name="store" size={11} strokeWidth={2.2} />
              </span>
            ))}
          </div>
          <div className="mt-[5cqw]">
            <Rows rows={s.rows} icon="store" start={4} />
          </div>
        </>
      );
    case 'pay': {
      const total = s.rows.reduce((sum, row) => sum + Number((/₹([\d,]+)/.exec(row)?.[1] ?? '0').replace(/,/g, '')), 0);
      return (
        <div className="flex flex-1 flex-col">
          <div className="rounded-[5cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] px-[4.4cqw] py-[3.6cqw]">
            {s.rows.map((row, i) => {
              const [label, value] = split(row);
              return (
                <div key={row} className="sc-pop flex items-center justify-between py-[1.4cqw] text-[3.8cqw]" style={k(i)}>
                  <span className="text-fg-2">{label}</span>
                  <span className="tnum font-extrabold text-fg">{value}</span>
                </div>
              );
            })}
            <div className="sc-pop mt-[2cqw] flex items-center justify-between border-t border-hair pt-[3cqw] text-[4.4cqw]" style={k(3)}>
              <span className="font-extrabold text-fg">{s.totalLabel}</span>
              <span className="tnum font-extrabold text-fg">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="mt-auto pt-[6cqw]">
            <span className="sc-pop btn-primary flex items-center justify-center gap-[2cqw] rounded-full py-[3.6cqw] text-[4cqw] font-extrabold" style={k(5)}>
              <Icon name="lock" size={14} strokeWidth={2.2} />
              {s.button}
            </span>
          </div>
        </div>
      );
    }
    case 'accept':
      return (
        <>
          <svg viewBox="0 0 80 80" className="mx-auto w-[34cqw]" aria-hidden="true">
            <circle cx="40" cy="40" r="34" fill="color-mix(in oklab, var(--ok) 14%, transparent)" />
            <circle className="sc-draw" cx="40" cy="40" r="34" fill="none" stroke="var(--ok)" strokeWidth="4" pathLength={1} transform="rotate(-90 40 40)" />
            <path className="sc-draw sc-late" d="m27 41 9 9 18-19" fill="none" stroke="var(--ok)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
          </svg>
          <div className="mt-[7cqw]">
            <Rows rows={s.rows} icon="check" start={2} />
          </div>
        </>
      );
    case 'assign':
      return (
        <>
          <div className="relative mx-auto grid h-[40cqw] w-[40cqw] place-items-center">
            <span className="sc-pulse absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]" />
            <span className="sc-pulse absolute inset-[16%] rounded-full bg-[color-mix(in_oklab,var(--primary)_16%,transparent)]" style={{ animationDelay: '-0.8s' }} />
            <span className="sc-pop relative grid h-[20cqw] w-[20cqw] place-items-center rounded-full bg-[#1a1713] text-white shadow-[0_10px_24px_-10px_rgb(0_0_0/0.6)] dark:bg-[#f8f4ef] dark:text-[#1a1713]" style={k(0)}>
              <Icon name="bike" size={28} strokeWidth={1.9} />
            </span>
          </div>
          <div className="mt-[6cqw]">
            <Rows rows={s.rows} icon="route" start={1} />
          </div>
        </>
      );
    case 'pickup':
    case 'handoff':
      return (
        <div className="flex flex-1 flex-col items-center justify-center">
          <Code code={s.code ?? ''} badge={s.badge} />
          <p className="sc-pop mt-[6cqw] text-center text-[3.6cqw] font-semibold text-fg-3" style={k(5)}>
            {s.rows[0]}
          </p>
        </div>
      );
    case 'route':
      return (
        <>
          <div className="relative overflow-hidden rounded-[6cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--fg)_6%,transparent)]">
            <svg viewBox="0 0 220 140" className="block h-auto w-full" aria-hidden="true">
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
              <path className="sc-draw" d={ROUTE} pathLength={1} fill="none" stroke="var(--primary)" strokeWidth="5" strokeLinecap="round" />
              <circle cx="22" cy="118" r="9" fill="#1a1713" />
              <circle cx="196" cy="34" r="9" fill="#3e9f5c" />
              <path d="m192 34 4-3.4 4 3.4v4h-8Z" fill="#fff" />
              <g className="sc-ride" style={{ offsetPath: `path('${ROUTE}')`, offsetDistance: '82%', offsetRotate: '0deg' } as CSSProperties}>
                <circle r="8" fill="#fff" stroke="#f08626" strokeWidth="3" />
                <circle r="3" fill="#f08626" />
              </g>
            </svg>
          </div>
          <div className="mt-[5cqw]">
            <Rows rows={s.rows} icon="pin" start={1} />
          </div>
        </>
      );
    case 'after':
      return (
        <>
          <div className="flex justify-center gap-[2cqw]">
            {[0, 1, 2, 3, 4].map(i => (
              <span key={i} className="sc-star text-[#f5b700]" style={k(i)}>
                <Icon name="star" size={30} />
              </span>
            ))}
          </div>
          <div className="mt-[7cqw]">
            <Rows rows={s.rows.slice(0, 2)} icon="wallet" start={5} />
          </div>
        </>
      );
    default:
      return <Rows rows={s.rows} />;
  }
}

function Scene({ step, active, inPhone }: { step: JourneyStep; active: boolean; inPhone: boolean }) {
  return (
    <div
      className={`scene flex flex-col px-[6cqw] ${inPhone ? 'absolute inset-0 pb-[24cqw] pt-[15cqw]' : 'scene-inline relative pb-[7cqw] pt-[7cqw]'}`}
      data-active={inPhone && active ? '' : undefined}>
      <div className="flex items-center justify-between gap-[3cqw]">
        <p className="truncate text-[6.2cqw] font-extrabold tracking-[-0.035em] text-fg">{step.screen.title}</p>
        <span className="flex-none rounded-full bg-primary-soft px-[2.8cqw] py-[1.1cqw] text-[3.1cqw] font-extrabold text-primary-ink">{step.screen.chip}</span>
      </div>
      <div className="mt-[6cqw] flex flex-1 flex-col">
        <Body step={step} />
      </div>
    </div>
  );
}

export default function Journey({ steps, progress }: { steps: JourneyStep[]; progress: string }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    /* Dimming the steps that are not current waits for this: without
       JavaScript every step stays fully legible. */
    root.current?.setAttribute('data-ready', '');
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    items.current.forEach(el => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} className="journey relative grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
      {/* the handset, held still beside the story */}
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+16px)] flex h-[calc(100svh-var(--header-h)-32px)] items-center justify-center gap-8">
          <PhoneShell width="min(300px, calc((100svh - var(--header-h) - 140px) * 0.46))" className="journey-phone">
            {steps.map((step, i) => (
              <Scene key={step.key} step={step} active={i === active} inPhone />
            ))}
            {/* the app's own tab bar, so the screen reads as the app */}
            <div className="absolute inset-x-[5cqw] bottom-[5cqw] flex h-[14cqw] items-center justify-around rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,var(--card))] text-fg-3 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--fg)_5%,transparent)]">
              {['home', 'search', 'basket', 'users'].map((icon, i) => (
                <span key={icon} className={`grid h-[10cqw] w-[10cqw] place-items-center rounded-full ${i === (active < 1 ? 1 : active < 7 ? 2 : 0) ? 'bg-primary text-white' : ''}`}>
                  <Icon name={icon} size={15} strokeWidth={2} />
                </span>
              ))}
            </div>
          </PhoneShell>
          <div className="flex flex-col items-center gap-2" aria-hidden="true">
            {steps.map((step, i) => (
              <span
                key={step.key}
                className={`w-1.5 rounded-full transition-[height,background-color] duration-500 ease-[var(--ease-out)] ${i === active ? 'h-7 bg-primary' : 'h-1.5 bg-[color-mix(in_oklab,var(--fg)_18%,transparent)]'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* the story */}
      <div className="relative">
        <p className="sr-only" aria-live="polite">
          {fillLive(progress, { n: active + 1, total: steps.length })}
        </p>
        <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-[2px] overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]">
          <span
            className="journey-fill block h-full w-full origin-top bg-gradient-to-b from-[var(--grad-a)] to-accent transition-transform duration-500 ease-[var(--ease-out)]"
            style={{ transform: `scaleY(${(active + 1) / steps.length})` }}
          />
        </span>
        <ol>
          {steps.map((step, i) => (
            <li
              key={step.key}
              ref={el => {
                items.current[i] = el;
              }}
              data-index={i}
              data-active={i === active ? '' : undefined}
              className="journey-step relative py-10 pl-16 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:py-0 lg:pl-20">
              <span className="journey-dot absolute left-0 top-10 grid h-10 w-10 place-items-center rounded-full text-[14px] font-extrabold lg:top-1/2 lg:-translate-y-1/2">
                {i + 1}
              </span>
              <div className="mb-7 lg:hidden">
                <div className="glass glass-raised relative mx-auto w-full max-w-[330px] overflow-hidden rounded-[30px] @container" aria-hidden="true">
                  <Scene step={step} active={false} inPhone={false} />
                </div>
              </div>
              <div className="journey-copy">
                <p className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
                  <Icon name={step.icon} size={16} strokeWidth={2} />
                  {step.who}
                </p>
                <h3 className="t-title mt-3 max-w-[18ch]">{step.title}</h3>
                <p className="t-body mt-4 max-w-[34rem]">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
