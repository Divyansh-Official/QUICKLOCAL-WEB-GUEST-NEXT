'use client';

/**
 * Widen your radius: the five steps a customer can save per address (4 to
 * 20 km), drawn as rings around home. Choosing one grows the lit area on a
 * spring and updates three facts — the area you can order from (πr²), what
 * delivery costs from a shop right at that edge (the backend's own fee
 * formula), and the time ceiling, which does not change.
 *
 * The dots are decoration, not shops: the site has no shop list and does not
 * pretend to.
 */
import { useState, type CSSProperties } from 'react';
import Icon from '@/components/ui/Icon';
import SegmentedControl from '@/components/ui/SegmentedControl';
import { deliveryFee, type FeeRules } from '@/lib/fees';
import { fillLive, rupees } from '@/lib/format';

type Copy = {
  label: string;
  area: string;
  areaUnit: string;
  edge: string;
  edgeNote: string;
  edgeNoteBase: string;
  time: string;
  times: string;
  steps: string;
  note: string;
};

/* Decorative dots, placed by golden-angle spiral so they spread evenly. */
const DOTS = Array.from({ length: 46 }, (_, i) => {
  const r = Math.sqrt((i + 0.6) / 46) * 0.96;
  const a = i * 2.39996;
  return { x: 50 + Math.cos(a) * r * 50, y: 50 + Math.sin(a) * r * 50, r };
});

export default function RadiusExplorer({ copy, stepsKm, rules, hours }: { copy: Copy; stepsKm: number[]; rules: FeeRules; hours: number }) {
  const max = stepsKm[stepsKm.length - 1];
  const [km, setKm] = useState(stepsKm[0]);
  const fee = deliveryFee(rules, km);
  const area = Math.round(Math.PI * km * km);
  const scale = km / max;

  return (
    <div className="glass glass-raised grid items-center gap-8 overflow-hidden rounded-[var(--radius-panel)] p-5 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:p-14">
      <div className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[400px]" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="radius-map absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <radialGradient id="radius-fill">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          {stepsKm.map(s => (
            <circle key={s} cx={50} cy={50} r={(s / max) * 49} fill="none" className={`radius-ring ${s <= km ? 'is-in' : ''}`} />
          ))}
          <circle cx={50} cy={50} r={49} fill="url(#radius-fill)" className="radius-area" style={{ '--s': scale } as CSSProperties} />
          <circle cx={50} cy={50} r={49} fill="none" className="radius-edge" style={{ '--s': scale } as CSSProperties} />
          {DOTS.map((dot, i) => (
            <circle key={i} cx={dot.x} cy={dot.y} r={1.1} className={`radius-dot ${dot.r <= scale ? 'is-in' : ''}`} style={{ '--k': i } as CSSProperties} />
          ))}
        </svg>
        <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-bg sm:h-11 sm:w-11 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.5)]">
          <Icon name="home" size={19} strokeWidth={1.9} />
        </span>
        <span
          className="radius-tag absolute left-1/2 top-1/2 rounded-full bg-primary px-2.5 py-1 text-[12px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgb(240_134_38/0.9)]"
          style={{ '--s': scale } as CSSProperties}>
          {km} km
        </span>
      </div>

      <div className="min-w-0">
        <SegmentedControl
          label={copy.label}
          value={String(km)}
          onChange={v => setKm(Number(v))}
          items={stepsKm.map(s => ({ value: String(s), label: `${s} km` }))}
          className="w-full [&>*]:flex-1"
        />
        <p className="mt-2.5 text-[12.5px] font-semibold text-fg-3">{fillLive(copy.steps, { step: stepsKm[1] - stepsKm[0] })}</p>

        <dl className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3">
          <div className="rounded-[20px] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] p-4">
            <dt className="text-[12px] font-bold text-fg-3">{copy.area}</dt>
            <dd className="tnum mt-1.5 text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] font-extrabold leading-none tracking-[-0.04em] text-fg" aria-live="polite">
              {area.toLocaleString('en-IN')} <span className="text-[0.5em] font-bold text-fg-3">{copy.areaUnit}</span>
            </dd>
          </div>
          <div className="rounded-[20px] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] p-4">
            <dt className="text-[12px] font-bold text-fg-3">{copy.edge}</dt>
            <dd className="tnum mt-1.5 text-[clamp(1.5rem,1.1rem+1.4vw,2.2rem)] font-extrabold leading-none tracking-[-0.04em] text-primary-ink" aria-live="polite">
              {rupees(fee.total)}
            </dd>
            <dd className="mt-1.5 text-[11.5px] leading-snug text-fg-3">
              {fee.extra ? fillLive(copy.edgeNote, { extra: rupees(fee.extra), extraKm: fee.extraKm }) : copy.edgeNoteBase}
            </dd>
          </div>
          <div className="col-span-2 flex items-center gap-3 rounded-[20px] bg-[color-mix(in_oklab,var(--ok)_10%,transparent)] p-4">
            <Icon name="clock" size={20} strokeWidth={2} className="flex-none text-ok" />
            <dt className="text-[13px] font-bold text-fg-2">{copy.time}</dt>
            <dd className="ml-auto text-[14px] font-extrabold text-fg">{fillLive(copy.times, { hours })}</dd>
          </div>
        </dl>
        <p className="t-small mt-5">{copy.note}</p>
      </div>
    </div>
  );
}
