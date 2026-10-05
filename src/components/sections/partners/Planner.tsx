'use client';

/**
 * The free-delivery planner a shop sees before it saves a threshold —
 * ProfitSimulatorService, run in the browser on the same rules (lib/fees.ts).
 *
 * Three inputs: the aisle (its platform fee), the threshold, and an order to
 * test against it; a cost-of-goods share is optional and switches the verdict
 * from "how much is given away" to "is there a profit". The order is drawn as
 * one bar split three ways — what the shop receives, the platform fee, and
 * the delivery base it covers on a free order — and the smallest safe
 * threshold sits on the threshold slider as a tick you can snap to.
 */
import { useId, useMemo, useState, type CSSProperties } from 'react';
import Icon from '@/components/ui/Icon';
import { simulateProfit, type FeeRules } from '@/lib/fees';
import { fillLive, rupees, rupeesExact } from '@/lib/format';

type Category = { slug: string; name: string; platformFeePercent: number };
type WarningKey = 'thresholdLow' | 'loss' | 'thin' | 'nonPositive' | 'giveaway' | 'cliff';

export type PlannerCopy = {
  category: string;
  threshold: string;
  order: string;
  cost: string;
  costHint: string;
  costOff: string;
  platformFee: string;
  absorbed: string;
  net: string;
  profit: string;
  given: string;
  recommended: string;
  useRecommended: string;
  none: string;
  healthy: string;
  check: string;
  free: string;
  paid: string;
  warnings: Record<WarningKey, string>;
  footnote: string;
};

const MIN = 50;
const MAX = 2000;
const STEP = 10;
/* A range thumb is 26px: its centre travels from 13px to (width − 13px). */
const along = (f: number) => `calc(13px + (100% - 26px) * ${Math.max(0, Math.min(1, f))})`;
const frac = (v: number) => (v - MIN) / (MAX - MIN);

export default function Planner({ fees, categories, copy }: { fees: FeeRules; categories: Category[]; copy: PlannerCopy }) {
  const id = useId();
  const [slug, setSlug] = useState(categories[0].slug);
  const [threshold, setThreshold] = useState(fees.defaultFreeDeliveryThresholdInr);
  const [subtotal, setSubtotal] = useState(fees.defaultFreeDeliveryThresholdInr);
  const [costOn, setCostOn] = useState(false);
  const [cost, setCost] = useState(70);
  const category = categories.find(c => c.slug === slug) ?? categories[0];
  const r = useMemo(
    () => simulateProfit(fees, { feePercent: category.platformFeePercent, threshold, subtotal, costPercent: costOn ? cost : null }),
    [fees, category, threshold, subtotal, costOn, cost],
  );

  const v: Record<string, string | number> = {
    category: category.name,
    chosen: rupees(threshold),
    recommended: r.recommended != null ? rupees(r.recommended) : '',
    ceiling: fees.absorbCeilingPercent,
    loss: rupeesExact(Math.abs(r.profit ?? 0)),
    margin: r.margin ?? 0,
    net: rupeesExact(r.net),
    given: r.givenPercent,
    base: rupees(fees.baseFeeInr),
    fee: rupeesExact(r.platformFee),
  };
  const share = (n: number) => `${Math.max(0, (n / subtotal) * 100)}%`;

  return (
    <div className="glass glass-raised overflow-hidden rounded-[36px]">
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* inputs */}
        <div className="border-b border-hair p-6 sm:p-8 md:border-b-0 md:border-r">
          <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">{copy.category}</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={copy.category}>
            {categories.map(c => {
              const on = c.slug === slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSlug(c.slug)}
                  className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-bold transition-[background-color,color,box-shadow,transform] duration-300 active:scale-95 ${
                    on ? 'btn-primary' : 'bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] text-fg-2 hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)] hover:text-fg'
                  }`}>
                  {c.name}
                  <span className={on ? 'text-white/80' : 'text-fg-3'}>{c.platformFeePercent}%</span>
                </button>
              );
            })}
          </div>

          {/* threshold, with the safe minimum marked on the track */}
          <div className="mt-9">
            <label htmlFor={`${id}-t`} className="flex items-baseline justify-between text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
              {copy.threshold}
              <span className="tnum text-[22px] font-extrabold normal-case tracking-[-0.03em] text-fg">{rupees(threshold)}</span>
            </label>
            <div className="relative mt-7">
              <input
                id={`${id}-t`}
                type="range"
                min={MIN}
                max={MAX}
                step={1}
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="ql-range w-full"
                style={{ '--fill': `${frac(threshold) * 100}%` } as CSSProperties}
              />
              {r.recommended != null ? (
                <span aria-hidden="true" className="pointer-events-none absolute -top-5 flex -translate-x-1/2 flex-col items-center transition-[left] duration-500 ease-[var(--ease-out)]" style={{ left: along(frac(r.recommended)) }}>
                  <span className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.08em] text-ok-ink">{rupees(r.recommended)}</span>
                  <span className="mt-0.5 h-2.5 w-[2px] rounded-full bg-ok" />
                </span>
              ) : null}
            </div>
            <p className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[13px] text-fg-3">
              <span>{r.recommended != null ? fillLive(copy.recommended, v) : copy.none}</span>
              {r.recommended != null && r.recommended !== threshold ? (
                <button
                  type="button"
                  onClick={() => setThreshold(Math.min(MAX, r.recommended!))}
                  className="rounded-full bg-[color-mix(in_oklab,var(--ok)_14%,transparent)] px-3 py-1 text-[12.5px] font-extrabold text-ok-ink transition-transform active:scale-95">
                  {copy.useRecommended}
                </button>
              ) : null}
            </p>
          </div>

          <div className="mt-8">
            <label htmlFor={`${id}-o`} className="flex items-baseline justify-between text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
              {copy.order}
              <span className="tnum text-[22px] font-extrabold normal-case tracking-[-0.03em] text-fg">{rupees(subtotal)}</span>
            </label>
            <input
              id={`${id}-o`}
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={subtotal}
              onChange={e => setSubtotal(Number(e.target.value))}
              className="ql-range mt-3 w-full"
              style={{ '--fill': `${frac(subtotal) * 100}%` } as CSSProperties}
            />
          </div>

          <div className="mt-8 rounded-[22px] bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] p-4">
            <div className="flex items-center justify-between gap-3">
              <span>
                <span className="block text-[14px] font-extrabold text-fg">{copy.cost}</span>
                <span className="block text-[12.5px] text-fg-3">{copy.costHint}</span>
              </span>
              <button type="button" role="switch" aria-checked={costOn} aria-label={copy.cost} onClick={() => setCostOn(o => !o)} className="ql-switch" data-on={costOn ? '' : undefined}>
                <span />
              </button>
            </div>
            <div className="ql-collapse" data-open={costOn ? '' : undefined}>
              <div>
                <label htmlFor={`${id}-c`} className="mt-4 flex items-baseline justify-between text-[12.5px] font-bold text-fg-2">
                  {copy.costHint}
                  <span className="tnum text-[17px] font-extrabold text-fg">{costOn ? `${cost}%` : copy.costOff}</span>
                </label>
                <input
                  id={`${id}-c`}
                  type="range"
                  min={0}
                  max={95}
                  step={1}
                  value={cost}
                  disabled={!costOn}
                  tabIndex={costOn ? 0 : -1}
                  onChange={e => setCost(Number(e.target.value))}
                  className="ql-range mt-2 w-full"
                  style={{ '--fill': `${(cost / 95) * 100}%` } as CSSProperties}
                />
              </div>
            </div>
          </div>
        </div>

        {/* the verdict */}
        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              key={r.healthy ? 'ok' : 'check'}
              className={`enter-scale inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-extrabold ${
                r.healthy ? 'bg-[color-mix(in_oklab,var(--ok)_15%,transparent)] text-ok-ink' : 'bg-[color-mix(in_oklab,var(--accent)_24%,transparent)] text-[#8a5a00] dark:text-accent'
              }`}>
              <Icon name={r.healthy ? 'check-circle' : 'info'} size={16} strokeWidth={2.2} />
              {r.healthy ? copy.healthy : copy.check}
            </span>
            <span className="inline-flex h-9 items-center rounded-full bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-3.5 text-[13px] font-bold text-fg-2">{r.free ? copy.free : copy.paid}</span>
          </div>

          {/* the order, split three ways */}
          <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_7%,transparent)]" aria-hidden="true">
            <span className="h-full bg-[#1a1713] transition-[width] duration-500 ease-[var(--ease-out)] dark:bg-[#f8f4ef]" style={{ width: share(Math.max(0, r.net)) }} />
            <span className="h-full bg-primary transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: share(r.platformFee) }} />
            <span className="h-full bg-accent transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: share(r.absorbed) }} />
          </div>

          <dl className="mt-5">
            <Line swatch="bg-[#1a1713] dark:bg-[#f8f4ef]" label={copy.net} value={rupeesExact(r.net)} strong />
            <Line swatch="bg-primary" label={copy.platformFee} value={rupeesExact(r.platformFee)} />
            <Line swatch="bg-accent" label={copy.absorbed} value={rupeesExact(r.absorbed)} />
            {r.profit != null ? <Line label={copy.profit} value={rupeesExact(r.profit)} tone={r.profit < 0 ? 'bad' : undefined} /> : null}
            <Line label={copy.given} value={`${r.givenPercent}%`} tone={r.givenPercent > fees.absorbCeilingPercent ? 'bad' : undefined} />
          </dl>

          <ul className="mt-5 space-y-2.5" aria-live="polite">
            {r.warnings.map(w => (
              <li key={w.key} className="enter-scale flex items-start gap-2.5 rounded-2xl bg-[color-mix(in_oklab,var(--bad)_9%,transparent)] px-4 py-3 text-[13.5px] font-semibold leading-relaxed text-fg">
                <Icon name="info" size={17} strokeWidth={2} className="mt-0.5 flex-none text-bad" />
                {fillLive(copy.warnings[w.key], v)}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-6 text-[12px] leading-relaxed text-fg-3">{copy.footnote}</p>
        </div>
      </div>
    </div>
  );
}

function Line({ label, value, swatch, strong = false, tone }: { label: string; value: string; swatch?: string; strong?: boolean; tone?: 'bad' }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hair py-3 last:border-0">
      <dt className="flex items-center gap-2.5 text-[14px] font-bold text-fg-2">
        {swatch ? <span className={`h-2.5 w-2.5 rounded-full ${swatch}`} aria-hidden="true" /> : <span className="w-2.5" aria-hidden="true" />}
        {label}
      </dt>
      <dd className={`tnum font-extrabold tracking-[-0.03em] ${strong ? 'text-[26px]' : 'text-[18px]'} ${tone === 'bad' ? 'text-bad' : 'text-fg'}`}>{value}</dd>
    </div>
  );
}
