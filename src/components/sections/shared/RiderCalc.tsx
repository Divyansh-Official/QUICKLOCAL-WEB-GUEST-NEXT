'use client';

/**
 * What a drop pays, by distance: ₹base + ₹perKm × km, never below the floor —
 * the payout model from riders.json, on a slider. The bar shows how much of
 * the figure is base, distance and floor top-up.
 */
import { useState, type CSSProperties } from 'react';
import { fillLive, rupees } from '@/lib/format';

export default function RiderCalc({ payout, labels }: { payout: { baseInr: number; perKmInr: number; minimumInr: number }; labels: { title: string; distance: string; result: string; legend: { base: string; distance: string; floor: string } } }) {
  const [km, setKm] = useState(4);
  const raw = payout.baseInr + payout.perKmInr * km;
  const total = Math.max(payout.minimumInr, raw);
  const lift = total - raw;
  const pct = (n: number) => `${(n / total) * 100}%`;

  return (
    <div className="glass glass-raised mx-auto max-w-[760px] rounded-[var(--radius-panel)] p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">{labels.title}</p>
          <label htmlFor="rider-km" className="mt-2 block text-[15px] font-bold text-fg-2">
            {labels.distance}: <span className="tnum text-fg">{km} km</span>
          </label>
        </div>
        <p className="text-right" aria-live="polite">
          <span className="block text-[12px] font-extrabold uppercase tracking-[0.14em] text-fg-3">{labels.result}</span>
          <span className="tnum text-gradient block text-[44px] font-extrabold leading-none tracking-[-0.05em]">{rupees(total)}</span>
        </p>
      </div>
      <input
        id="rider-km"
        type="range"
        min={0}
        max={15}
        step={1}
        value={km}
        onChange={e => setKm(Number(e.target.value))}
        className="ql-range mt-6 w-full"
        style={{ '--fill': `${(km / 15) * 100}%` } as CSSProperties}
      />
      <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]" aria-hidden="true">
        <span className="h-full bg-[#1a1713] transition-[width] duration-500 ease-[var(--ease-out)] dark:bg-[#f8f4ef]" style={{ width: pct(payout.baseInr) }} />
        <span className="h-full bg-primary transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: pct(payout.perKmInr * km) }} />
        <span className="h-full bg-ok transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: pct(lift) }} />
      </div>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-semibold text-fg-3">
        <span>{fillLive(labels.legend.base, { amount: rupees(payout.baseInr) })}</span>
        <span className="text-primary-ink">{fillLive(labels.legend.distance, { amount: rupees(payout.perKmInr * km) })}</span>
        {lift > 0 ? <span className="text-ok">{fillLive(labels.legend.floor, { amount: rupees(lift) })}</span> : null}
      </p>
    </div>
  );
}
