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
import RailDots from '@/components/ui/RailDots';
import { fillLive } from '@/lib/format';

export type JourneyStep = {
  key: string;
  icon: string;
  who: string;
  title: string;
  text: string;
  screen: {
    title: string;
    chip: string;
    rows: string[];
    code?: string;
    badge?: string;
    totalLabel?: string;
    button?: string;
    accept?: string;
    decline?: string;
    tabs?: string[];
    kicker?: string;
    headline?: string;
    blurb?: string;
    query?: string;
    trendingLabel?: string;
    trending?: string[];
    sponsored?: string;
    unavailable?: string;
    locked?: string[];
  };
};

/* Which of the app's four tabs a screen lives under. */
const TAB: Record<string, number> = { feed: 0, foryou: 0, aisles: 0, after: 0, browse: 1, search: 1, stores: 1, pay: 2, accept: 2, assign: 2, pickup: 2, route: 2, handoff: 2, saved: 3, inbox: 3, control: 3 };

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
          <div className="relative mx-auto grid h-[32cqw] w-[32cqw] place-items-center">
            <span className="sc-pulse absolute inset-0 rounded-full bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]" />
            <span className="sc-pulse absolute inset-[16%] rounded-full bg-[color-mix(in_oklab,var(--primary)_16%,transparent)]" style={{ animationDelay: '-0.8s' }} />
            <span className="sc-pop relative grid h-[17cqw] w-[17cqw] place-items-center rounded-full bg-[#1a1713] text-white shadow-[0_10px_24px_-10px_rgb(0_0_0/0.6)] dark:bg-[#f8f4ef] dark:text-[#1a1713]" style={k(0)}>
              <Icon name="bike" size={24} strokeWidth={1.9} />
            </span>
          </div>
          <div className="mt-[5cqw]">
            <Rows rows={s.rows} icon="route" start={1} />
          </div>
          {s.accept ? (
            <div className="sc-pop mt-[5cqw] grid grid-cols-2 gap-[2.6cqw]" style={k(4)}>
              <span className="grid place-items-center rounded-full bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] py-[3.2cqw] text-[3.9cqw] font-extrabold text-fg-2">{s.decline}</span>
              <span className="sc-press btn-primary flex items-center justify-center gap-[1.6cqw] rounded-full py-[3.2cqw] text-[3.9cqw] font-extrabold">
                <Icon name="check" size={13} strokeWidth={2.6} />
                {s.accept}
              </span>
            </div>
          ) : null}
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
    case 'feed':
    case 'foryou':
      return (
        <div className="space-y-[4.4cqw]">
          {s.rows.map((row, i) => {
            const [label, reason] = split(row);
            return (
              <div key={row} className="sc-pop" style={k(i)}>
                <p className="flex items-center gap-[2cqw] text-[3.9cqw] font-extrabold tracking-[-0.02em] text-fg">
                  {label}
                  {reason ? <span className="rounded-full bg-primary-soft px-[2.2cqw] py-[0.6cqw] text-[3cqw] font-extrabold text-primary-ink">{reason}</span> : null}
                </p>
                <div className="mt-[2cqw] grid grid-cols-3 gap-[2cqw]">
                  {[0, 1, 2].map(t => (
                    <span key={t} className="aspect-[5/4] rounded-[3.6cqw] bg-[color-mix(in_oklab,var(--fg)_6%,var(--card))] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--fg)_5%,transparent)]" style={{ background: t === 0 && i === 0 ? 'color-mix(in oklab, var(--primary) 16%, var(--card))' : undefined }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    case 'aisles':
      return (
        <>
          <div className="-mx-[6cqw] flex gap-[2cqw] overflow-hidden px-[6cqw]">
            {(s.tabs ?? []).map((t, i) => (
              <span key={t} className={`sc-pop flex-none rounded-full px-[3.4cqw] py-[1.8cqw] text-[3.4cqw] font-extrabold ${t === s.title ? 'bg-[#B4543F] text-white' : 'bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] text-fg-2'}`} style={k(i)}>
                {t}
              </span>
            ))}
          </div>
          <div className="sc-pop mt-[4.4cqw] rounded-[5cqw] bg-[#FBE0DA] px-[5cqw] py-[5cqw] text-[#3a1d16] dark:bg-[#3a2420] dark:text-[#fbe0da]" style={k(5)}>
            <p className="text-[3cqw] font-extrabold tracking-[0.12em] text-[#B4543F] dark:text-[#f2a08c]">{s.kicker}</p>
            <p className="mt-[1.4cqw] text-[5.6cqw] font-extrabold leading-tight tracking-[-0.03em]">{s.headline}</p>
            <p className="mt-[1.4cqw] text-[3.3cqw] opacity-75">{s.blurb}</p>
          </div>
          <div className="mt-[4cqw] grid grid-cols-2 gap-[2.4cqw]">
            {s.rows.map((r, i) => (
              <span key={r} className="sc-pop rounded-[3.6cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] px-[3cqw] py-[3.4cqw] text-[3.3cqw] font-bold text-fg" style={k(6 + i)}>
                {r}
              </span>
            ))}
          </div>
        </>
      );
    case 'search':
      return (
        <>
          <div className="flex items-center gap-[2.4cqw] rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,var(--card))] px-[4cqw] py-[3cqw]">
            <Icon name="search" size={14} strokeWidth={2.2} className="text-fg-3" />
            <span className="sc-type overflow-hidden whitespace-nowrap text-[3.8cqw] font-bold text-fg" style={{ ['--ch' as string]: (s.query ?? '').length }}>
              {s.query}
            </span>
            <span className="sc-caret h-[4.4cqw] w-[0.5cqw] bg-primary" />
            <span className="ml-auto grid h-[7.4cqw] w-[7.4cqw] place-items-center rounded-full bg-primary text-white">
              <Icon name="scan" size={13} strokeWidth={2.2} />
            </span>
          </div>
          <div className="mt-[3cqw]">
            <Rows rows={s.rows} icon="search" start={2} />
          </div>
          <p className="sc-pop mt-[5cqw] text-[3.1cqw] font-extrabold uppercase tracking-[0.1em] text-fg-3" style={k(5)}>
            {s.trendingLabel}
          </p>
          <div className="mt-[2cqw] flex flex-wrap gap-[2cqw]">
            {(s.trending ?? []).map((t, i) => (
              <span key={t} className="sc-pop rounded-full bg-primary-soft px-[3cqw] py-[1.4cqw] text-[3.3cqw] font-bold text-primary-ink" style={k(6 + i)}>
                {t}
              </span>
            ))}
          </div>
        </>
      );
    case 'stores':
      return (
        <ul className="space-y-[2.4cqw]">
          {s.rows.map((row, i) => {
            const [label, value] = split(row);
            return (
              <li key={row} className="sc-pop flex items-center gap-[3cqw] rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] px-[3.4cqw] py-[3cqw]" style={k(i)}>
                <span className="grid h-[9cqw] w-[9cqw] flex-none place-items-center rounded-[2.6cqw] bg-primary-soft text-primary-ink">
                  <Icon name="store" size={14} strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[3.7cqw] font-bold text-fg">{label}</span>
                  {i === 0 && s.sponsored ? <span className="mt-[0.6cqw] inline-block rounded-full bg-[color-mix(in_oklab,var(--fg)_8%,transparent)] px-[1.8cqw] py-[0.3cqw] text-[2.7cqw] font-extrabold text-fg-3">{s.sponsored}</span> : null}
                </span>
                <span className="tnum flex-none text-[3.4cqw] font-extrabold text-fg-2">{value}</span>
              </li>
            );
          })}
        </ul>
      );
    case 'saved':
      return (
        <div className="grid grid-cols-2 gap-[2.6cqw]">
          {s.rows.map((r, i) => {
            const gone = i === s.rows.length - 1;
            return (
              <div key={r} className={`sc-pop relative rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] p-[2.4cqw] ${gone ? 'opacity-50' : ''}`} style={k(i)}>
                <span className="block aspect-square rounded-[3cqw] bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]" />
                <span className="sc-heart absolute right-[4cqw] top-[4cqw] grid h-[7cqw] w-[7cqw] place-items-center rounded-full bg-card text-[#e2553a] shadow-[0_2px_6px_rgb(0_0_0/0.15)]" style={k(i)}>
                  <Icon name="heart" size={12} strokeWidth={2.4} />
                </span>
                <span className="mt-[1.8cqw] block truncate text-[3.3cqw] font-bold text-fg">{r}</span>
                {gone ? <span className="block truncate text-[2.7cqw] font-semibold text-fg-3">{s.unavailable}</span> : null}
              </div>
            );
          })}
        </div>
      );
    case 'inbox':
      return (
        <div className="space-y-[2.6cqw]">
          <div className="sc-pop overflow-hidden rounded-[4.4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))]" style={k(0)}>
            <span className="block h-[26cqw] bg-[linear-gradient(135deg,#f8a24b,#e06f12_55%,#c1621b)]" />
            <div className="p-[3.6cqw]">
              <p className="text-[3.9cqw] font-extrabold text-fg">{s.rows[0]}</p>
              <span className="btn-primary mt-[2.6cqw] flex items-center justify-center rounded-full py-[2.6cqw] text-[3.4cqw] font-extrabold">{s.button}</span>
            </div>
          </div>
          {s.rows.slice(1).map((r, i) => (
            <div key={r} className="sc-pop flex items-center gap-[3cqw] rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] px-[3.4cqw] py-[3cqw]" style={k(i + 1)}>
              <span className="h-[2cqw] w-[2cqw] rounded-full bg-primary" />
              <span className="text-[3.6cqw] font-bold text-fg">{r}</span>
            </div>
          ))}
        </div>
      );
    case 'control':
      return (
        <ul className="space-y-[2.2cqw]">
          {s.rows.map((r, i) => (
            <li key={r} className="sc-pop flex items-center justify-between rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_5%,var(--card))] px-[3.6cqw] py-[3cqw]" style={k(i)}>
              <span className="text-[3.7cqw] font-bold text-fg">{r}</span>
              <span className={`sc-toggle relative h-[6.6cqw] w-[11cqw] rounded-full ${i === 1 ? 'bg-[color-mix(in_oklab,var(--fg)_16%,transparent)]' : 'bg-ok'}`}>
                <span className={`absolute top-[0.6cqw] h-[5.4cqw] w-[5.4cqw] rounded-full bg-white shadow ${i === 1 ? 'left-[0.6cqw]' : 'right-[0.6cqw]'}`} />
              </span>
            </li>
          ))}
          {(s.locked ?? []).map((r, i) => (
            <li key={r} className="sc-pop flex items-center justify-between rounded-[4cqw] bg-[color-mix(in_oklab,var(--fg)_3%,var(--card))] px-[3.6cqw] py-[3cqw]" style={k(s.rows.length + i)}>
              <span className="text-[3.7cqw] font-bold text-fg-2">{r}</span>
              <Icon name="lock" size={13} strokeWidth={2.2} className="text-fg-3" />
            </li>
          ))}
        </ul>
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
    <div ref={root} className="journey relative grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
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
                <span key={icon} className={`grid h-[10cqw] w-[10cqw] place-items-center rounded-full ${i === (TAB[steps[active]?.key] ?? 0) ? 'bg-primary text-white' : ''}`}>
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
      <div className="relative min-w-0">
        <p className="sr-only" aria-live="polite">
          {fillLive(progress, { n: active + 1, total: steps.length })}
        </p>
        <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-[2px] max-sm:hidden overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]">
          <span
            className="journey-fill block h-full w-full origin-top bg-gradient-to-b from-[var(--grad-a)] to-accent transition-transform duration-500 ease-[var(--ease-out)]"
            style={{ transform: `scaleY(${(active + 1) / steps.length})` }}
          />
        </span>
        <ol className="m-rail m-rail-wide">
          {steps.map((step, i) => (
            <li
              key={step.key}
              ref={el => {
                items.current[i] = el;
              }}
              data-index={i}
              data-active={i === active ? '' : undefined}
              className="journey-step relative sm:py-10 sm:pl-16 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:py-0 lg:pl-20">
              <span className="journey-dot absolute left-0 top-10 grid h-10 w-10 max-sm:hidden place-items-center rounded-full text-[14px] font-extrabold lg:top-1/2 lg:-translate-y-1/2">
                {i + 1}
              </span>
              <div className="mb-5 lg:hidden">
                <div className="glass glass-raised relative mx-auto w-full max-w-[210px] overflow-hidden rounded-[24px] @container sm:max-w-[330px] sm:rounded-[30px]" aria-hidden="true">
                  <Scene step={step} active={false} inPhone={false} />
                </div>
              </div>
              <div className="journey-copy">
                <p className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
                  <Icon name={step.icon} size={16} strokeWidth={2} />
                  {step.who}
                </p>
                <h3 className="t-title mt-3 max-w-[18ch]">{step.title}</h3>
                <p className="t-body mt-4 max-w-[34rem] max-sm:line-clamp-3">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <RailDots count={steps.length} />
      </div>
    </div>
  );
}
