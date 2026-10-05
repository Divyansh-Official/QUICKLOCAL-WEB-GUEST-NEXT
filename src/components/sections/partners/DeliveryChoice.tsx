'use client';

/**
 * Free delivery, the shop's call: set a threshold, try an order and a
 * distance, and see who funds the delivery — OrderFeeService's split, run on
 * the same rules (lib/fees.ts). At or over the threshold the shop covers the
 * base and the customer only the kilometres past the free range; under it
 * the customer pays the lot. The rider is paid the whole fee either way.
 */
import { useId, useState, type CSSProperties } from 'react';
import Icon from '@/components/ui/Icon';
import { deliverySplit, type FeeRules } from '@/lib/fees';
import { rupees } from '@/lib/format';

export type DeliveryChoiceCopy = {
  threshold: string;
  order: string;
  distance: string;
  customer: string;
  shop: string;
  rider: string;
  free: string;
  paid: string;
  note: string;
};

const MIN = 50;
const MAX = 2000;
const KM_MAX = 20;
const frac = (v: number) => (v - MIN) / (MAX - MIN);
/* A range thumb is 26px: its centre travels from 13px to (width − 13px). */
const along = (f: number) => `calc(13px + (100% - 26px) * ${Math.max(0, Math.min(1, f))})`;

function Slider({ id, label, value, display, min, max, step, onChange, fill, children }: { id: string; label: string; value: number; display: string; min: number; max: number; step: number; onChange: (n: number) => void; fill: number; children?: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
        {label}
        <span className="tnum text-[22px] font-extrabold normal-case tracking-[-0.03em] text-fg">{display}</span>
      </label>
      <div className="relative mt-3">
        <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} className="ql-range w-full" style={{ '--fill': `${fill * 100}%` } as CSSProperties} />
        {children}
      </div>
    </div>
  );
}

export default function DeliveryChoice({ fees, copy }: { fees: FeeRules; copy: DeliveryChoiceCopy }) {
  const id = useId();
  const [threshold, setThreshold] = useState(fees.defaultFreeDeliveryThresholdInr);
  const [order, setOrder] = useState(1200);
  const [km, setKm] = useState(6);
  const q = deliverySplit(fees, order, km, threshold);
  const share = (n: number) => `${(n / Math.max(1, q.rider)) * 100}%`;

  return (
    <div className="glass glass-raised overflow-hidden rounded-[36px]">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-8 border-b border-hair p-6 sm:p-8 md:border-b-0 md:border-r">
          <Slider id={`${id}-t`} label={copy.threshold} value={threshold} display={rupees(threshold)} min={MIN} max={MAX} step={10} onChange={setThreshold} fill={frac(threshold)} />
          <Slider id={`${id}-o`} label={copy.order} value={order} display={rupees(order)} min={MIN} max={MAX} step={10} onChange={setOrder} fill={frac(order)}>
            <span aria-hidden="true" className="pointer-events-none absolute -top-3 h-2.5 w-[2px] -translate-x-1/2 rounded-full bg-ok transition-[left] duration-300" style={{ left: along(frac(threshold)) }} />
          </Slider>
          <Slider id={`${id}-k`} label={copy.distance} value={km} display={`${km} km`} min={1} max={KM_MAX} step={1} onChange={setKm} fill={(km - 1) / (KM_MAX - 1)} />
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <span
            key={q.free ? 'free' : 'paid'}
            className={`enter-scale inline-flex h-9 items-center gap-2 self-start rounded-full px-3.5 text-[13.5px] font-extrabold ${
              q.free ? 'bg-[color-mix(in_oklab,var(--ok)_15%,transparent)] text-ok-ink' : 'bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] text-fg-2'
            }`}>
            <Icon name={q.free ? 'check-circle' : 'wallet'} size={16} strokeWidth={2.2} />
            {q.free ? copy.free : copy.paid}
          </span>

          {/* the delivery fee, split by who funds it */}
          <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]" aria-hidden="true">
            <span className="h-full bg-primary transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: share(q.customer) }} />
            <span className="h-full bg-accent transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: share(q.shop) }} />
          </div>

          <dl className="mt-5" aria-live="polite">
            <Row swatch="bg-primary" label={copy.customer} value={rupees(q.customer)} />
            <Row swatch="bg-accent" label={copy.shop} value={rupees(q.shop)} />
            <Row label={copy.rider} value={rupees(q.rider)} strong />
          </dl>
          <p className="mt-auto pt-6 text-[13px] leading-relaxed text-fg-3">{copy.note}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, swatch, strong = false }: { label: string; value: string; swatch?: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hair py-3 last:border-0">
      <dt className="flex items-center gap-2.5 text-[14px] font-bold text-fg-2">
        <span className={`h-2.5 w-2.5 rounded-full ${swatch ?? 'bg-[#1a1713] dark:bg-[#f8f4ef]'}`} aria-hidden="true" />
        {label}
      </dt>
      <dd className={`tnum font-extrabold tracking-[-0.03em] text-fg ${strong ? 'text-[26px]' : 'text-[20px]'}`}>{value}</dd>
    </div>
  );
}
