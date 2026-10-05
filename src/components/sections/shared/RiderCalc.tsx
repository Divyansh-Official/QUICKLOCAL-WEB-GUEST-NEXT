'use client';

/**
 * What a drop pays, by distance — the order's whole delivery fee, which is
 * what the rider is paid (SplitPayoutService.driverAmount): the base for the
 * first few kilometres, then the fuel-derived per-km beyond them, rounded up
 * to the rupee. The bar shows how much of the figure is base and how much is
 * distance, with a tick where the base stops covering the trip.
 */
import { useState, type CSSProperties } from 'react';
import { deliveryFee, type FeeRules } from '@/lib/fees';
import { fillLive, rupees } from '@/lib/format';

const MAX_KM = 20;

export default function RiderCalc({
  fees,
  labels,
  initialKm = 6,
}: {
  fees: FeeRules;
  labels: { title: string; distance: string; result: string; legend: { base: string; distance: string } };
  initialKm?: number;
}) {
  const [km, setKm] = useState(initialKm);
  const q = deliveryFee(fees, km);
  /* A fixed scale — the longest trip — so the bar grows with distance rather than always filling. */
  const scale = deliveryFee(fees, MAX_KM).total;
  const pct = (n: number) => `${(n / scale) * 100}%`;

  return (
    <div className="glass glass-raised mx-auto max-w-[760px] rounded-[var(--radius-panel)] p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">{labels.title}</p>
          <label htmlFor="rider-km" className="mt-2 block text-[15px] font-bold text-fg-2">
            {labels.distance}: <span className="tnum text-fg">{km} km</span>
          </label>
        </div>
        <p className="text-right">
          <span className="block text-[12px] font-extrabold uppercase tracking-[0.14em] text-fg-3">{labels.result}</span>
          <output htmlFor="rider-km" aria-live="polite" className="tnum text-gradient block text-[44px] font-extrabold leading-none tracking-[-0.05em]">
            {rupees(q.total)}
          </output>
        </p>
      </div>
      <input
        id="rider-km"
        type="range"
        min={1}
        max={MAX_KM}
        step={1}
        value={km}
        onChange={e => setKm(Number(e.target.value))}
        className="ql-range mt-6 w-full"
        style={{ '--fill': `${((km - 1) / (MAX_KM - 1)) * 100}%` } as CSSProperties}
      />
      <div className="relative mt-5">
        <div className="flex h-3 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]" aria-hidden="true">
          <span className="h-full bg-[#1a1713] transition-[width] duration-500 ease-[var(--ease-out)] dark:bg-[#f8f4ef]" style={{ width: pct(q.base) }} />
          <span className="h-full bg-primary transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: pct(q.extra) }} />
        </div>
      </div>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] font-semibold text-fg-3">
        <span>{fillLive(labels.legend.base, { amount: rupees(q.base) })}</span>
        {q.extra > 0 ? <span className="text-primary-ink">{fillLive(labels.legend.distance, { amount: rupees(q.extra), km: q.extraKm })}</span> : null}
      </p>
    </div>
  );
}
