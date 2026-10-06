import type { CSSProperties, ReactNode } from 'react';
import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';
import RailDots from '@/components/ui/RailDots';

export type Pillar = { key: string; icon: string; eyebrow: string; title: string; text: string; art: string[] };

const k = (n: number) => ({ '--k': n }) as CSSProperties;

/** Documents fanning apart in 3D as the panel scrolls in; each one ticks. */
function Documents({ labels }: { labels: string[] }) {
  return (
    <div className="doc-stage" aria-hidden="true">
      <div className="doc-stack">
        {labels.map((label, i) => (
          <div key={label} className="doc-sheet" style={k(i)}>
            <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-primary-soft text-primary-ink">
              <Icon name={i === 2 ? 'wallet' : i === 3 ? 'receipt' : 'id'} size={19} strokeWidth={1.9} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-extrabold tracking-[-0.02em] text-fg">{label}</span>
              <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]" />
            </span>
            <span className="doc-tick grid h-7 w-7 flex-none place-items-center rounded-full bg-ok text-white">
              <Icon name="check" size={14} strokeWidth={2.8} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** A one-time code typing itself in, then the lock opening to a tick. */
function Code({ digits }: { digits: string[] }) {
  return (
    <div className="flex flex-col items-center" aria-hidden="true">
      <span className="otp-lock grid h-16 w-16 place-items-center rounded-[22px] bg-[#1a1713] text-white shadow-[0_14px_30px_-14px_rgb(0_0_0/0.7)] dark:bg-[#f8f4ef] dark:text-[#1a1713]">
        <Icon name="key" size={28} strokeWidth={1.8} />
      </span>
      <div className="mt-8 flex gap-[clamp(8px,2.4vw,12px)]">
        {digits.map((d, i) => (
          <span key={i} className="otp-box relative grid h-[clamp(58px,17vw,76px)] w-[clamp(44px,13vw,60px)] place-items-center rounded-[clamp(14px,4vw,18px)] bg-card text-[clamp(26px,8vw,34px)] font-extrabold tracking-[-0.04em] text-fg shadow-[inset_0_0_0_1.5px_var(--hair),var(--lift-1)]" style={k(i)}>
            <span className="otp-digit">{d}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Money moving in order: delivered first, then the shop, then the rider. */
function Ledger({ rows }: { rows: string[] }) {
  return (
    <ol className="ledger relative mx-auto w-full max-w-[320px]" aria-hidden="true">
      <span className="ledger-line absolute bottom-7 left-[27px] top-7 w-[2px] rounded-full bg-[color-mix(in_oklab,var(--fg)_10%,transparent)]">
        <span className="ledger-fill block h-full w-full origin-top rounded-full bg-gradient-to-b from-ok to-primary" />
      </span>
      {rows.map((row, i) => (
        <li key={row} className="ledger-row relative flex items-center gap-4 py-3" style={k(i)}>
          <span className={`relative grid h-14 w-14 flex-none place-items-center rounded-full text-white shadow-[0_10px_22px_-12px_rgb(0_0_0/0.6)] ${i === 0 ? 'bg-ok' : 'bg-primary'}`}>
            <Icon name={i === 0 ? 'check' : i === 1 ? 'store' : 'bike'} size={22} strokeWidth={2.2} />
          </span>
          <span className="glass flex-1 rounded-[18px] px-4 py-3 text-[15px] font-extrabold tracking-[-0.02em] text-fg">{row}</span>
        </li>
      ))}
    </ol>
  );
}

const ART: Record<string, (p: Pillar) => ReactNode> = {
  verified: p => <Documents labels={p.art} />,
  codes: p => <Code digits={p.art} />,
  money: p => <Ledger rows={p.art} />,
};

/**
 * The three guarantees, as alternating panels: words on one side, a small
 * moving picture of the rule on the other. All of the motion is scroll-driven
 * CSS (see `.doc-*`, `.otp-*`, `.ledger-*`); without it the art simply shows
 * its final frame.
 */
export default function Pillars({ items }: { items: Pillar[] }) {
  return (
    <>
    <div className="m-rail m-rail-wide space-y-5">
      {items.map((p, i) => (
        <Reveal key={p.key} className={`pillar glass glass-raised grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[var(--radius-panel)] p-5 xs:p-7 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14`}>
          <div className={`min-w-0 ${i % 2 ? 'lg:order-2' : ''}`}>
            <p className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
              <Icon name={p.icon} size={16} strokeWidth={2} />
              {p.eyebrow}
            </p>
            <h2 className="t-title mt-4 max-w-[16ch]">{p.title}</h2>
            <p className="t-body mt-4 max-w-[34rem]">{p.text}</p>
          </div>
          <div className={`pillar-art relative grid min-h-[300px] min-w-0 place-items-center rounded-[28px] bg-[color-mix(in_oklab,var(--fg)_3.5%,transparent)] px-4 py-10 sm:px-6 ${i % 2 ? 'lg:order-1' : ''}`}>
            {ART[p.key]?.(p)}
          </div>
        </Reveal>
      ))}
    </div>
      <RailDots count={items.length} />
    </>
  );
}
