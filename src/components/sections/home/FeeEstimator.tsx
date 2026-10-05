'use client';

/**
 * What an order actually costs, worked out the way the platform works it out.
 *
 * It runs the backend's own arithmetic (DeliveryFeeCalculatorService), not a
 * marketing approximation — every constant comes from fees.json, which names
 * the constant it mirrors:
 *
 *   fuelCostPerKm = petrolPrice / mileage
 *   extraFee      = ceil(extraKm × fuelCostPerKm × multiplier)
 *   deliveryFee   = baseFee + extraFee
 *
 * Crossing the shop's free-delivery threshold moves the BASE from the
 * customer to the shop; the per-km part stays with the customer and the rider
 * is paid the whole fee either way. Watching the split jump as the basket
 * crosses the marked line explains that better than a sentence.
 *
 * The panel takes its glass from paint: a large backdrop pass would cost
 * every scrolled frame on a low-end phone.
 */
import { useMemo, useState, type CSSProperties } from 'react';
import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import { deliverySplit, type FeeRules } from '@/lib/fees';
import { fillLive, rupees } from '@/lib/format';

type Copy = Record<
  | 'eyebrow' | 'title' | 'accent' | 'intro' | 'basket' | 'distance' | 'thresholdNote' | 'freeKmNote'
  | 'extraNote' | 'noExtraNote' | 'customer' | 'shop' | 'rider' | 'customerNote' | 'customerNoteFree' | 'shopNote'
  | 'shopNoteFree' | 'riderNote' | 'freeBanner' | 'moreBanner' | 'footnote' | 'thresholdMark',
  string
>;

const BASKET_MAX = 2000;
const DISTANCE_MAX = 20;

export default function FeeEstimator({ fees, copy }: { fees: FeeRules; copy: Copy }) {
  const [subtotal, setSubtotal] = useState(650);
  const [distance, setDistance] = useState(6);
  const q = useMemo(() => deliverySplit(fees, subtotal, distance), [fees, subtotal, distance]);

  const thresholdAt = ((fees.defaultFreeDeliveryThresholdInr - 100) / (BASKET_MAX - 100)) * 100;
  const basketFill = ((subtotal - 100) / (BASKET_MAX - 100)) * 100;
  const distanceFill = ((distance - 1) / (DISTANCE_MAX - 1)) * 100;
  const v = {
    basket: rupees(subtotal),
    delivery: rupees(q.customer),
    absorbed: rupees(q.shop),
    extraKm: q.extraKm,
    extraFee: rupees(q.extra),
    remaining: rupees(Math.max(0, fees.defaultFreeDeliveryThresholdInr - subtotal)),
  };

  return (
    <section id="what-it-costs" className="tone-base section scroll-mt-24">
      <div className="shell">
        <SectionHeader eyebrow={copy.eyebrow} title={copy.title} accent={copy.accent} intro={copy.intro} />

        <Reveal className="mx-auto mt-14 max-w-[980px]">
          <div className="glass glass-raised overflow-hidden rounded-[36px]">
            <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
              {/* controls */}
              <div className="border-b border-hair p-6 sm:p-8 md:border-b-0 md:border-r">
                <div>
                  <label htmlFor="fee-basket" className="flex items-baseline justify-between text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
                    {copy.basket}
                    <span className="tnum text-[22px] font-extrabold normal-case tracking-[-0.03em] text-fg">{rupees(subtotal)}</span>
                  </label>
                  <div className="relative mt-6">
                    <input
                      id="fee-basket"
                      type="range"
                      min={100}
                      max={BASKET_MAX}
                      step={50}
                      value={subtotal}
                      onChange={e => setSubtotal(Number(e.target.value))}
                      aria-describedby="fee-basket-note"
                      className="ql-range w-full"
                      style={{ '--fill': `${basketFill}%` } as CSSProperties}
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute -top-5 flex -translate-x-1/2 flex-col items-center" style={{ left: `${thresholdAt}%` }}>
                      <span className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.08em] text-ok-ink">{copy.thresholdMark}</span>
                      <span className="mt-0.5 h-2.5 w-[2px] rounded-full bg-ok" />
                    </span>
                  </div>
                  <p id="fee-basket-note" className="mt-2 text-[13px] text-fg-3">
                    {copy.thresholdNote}
                  </p>
                </div>

                <div className="mt-7">
                  <label htmlFor="fee-distance" className="flex items-baseline justify-between text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">
                    {copy.distance}
                    <span className="tnum text-[22px] font-extrabold normal-case tracking-[-0.03em] text-fg">{distance} km</span>
                  </label>
                  <input
                    id="fee-distance"
                    type="range"
                    min={1}
                    max={DISTANCE_MAX}
                    step={1}
                    value={distance}
                    onChange={e => setDistance(Number(e.target.value))}
                    aria-describedby="fee-distance-note"
                    className="ql-range mt-3 w-full"
                    style={{ '--fill': `${distanceFill}%` } as CSSProperties}
                  />
                  <p id="fee-distance-note" className="mt-2 text-[13px] text-fg-3">
                    {copy.freeKmNote} {q.extraKm > 0 ? fillLive(copy.extraNote, v) : copy.noExtraNote}
                  </p>
                </div>
              </div>

              {/* the split */}
              <div className="p-6 sm:p-8">
                {/* One short sentence for screen readers, not the whole panel on every tick. */}
                <p className="sr-only" aria-live="polite">
                  {`${copy.customer} ${rupees(subtotal + q.customer)}. ${copy.shop} ${rupees(q.shop)}. ${copy.rider} ${rupees(q.rider)}.`}
                </p>
                <Line icon="basket" label={copy.customer} value={rupees(subtotal + q.customer)} note={fillLive(q.free ? copy.customerNoteFree : copy.customerNote, v)} strong />
                <Line icon="store" label={copy.shop} value={rupees(q.shop)} note={fillLive(q.shop > 0 ? copy.shopNoteFree : copy.shopNote, v)} />
                <Line icon="bike" label={copy.rider} value={rupees(q.rider)} note={copy.riderNote} />

                <p
                  key={q.free ? 'free' : 'more'}
                  className={`enter-scale mt-5 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[13.5px] font-semibold leading-relaxed ${
                    q.free ? 'bg-[color-mix(in_oklab,var(--ok)_14%,transparent)] text-ok-ink' : 'bg-[color-mix(in_oklab,var(--fg)_5%,transparent)] text-fg-2'
                  }`}>
                  <Icon name={q.free ? 'check-circle' : 'sparkle'} size={17} strokeWidth={2} className="mt-0.5" />
                  {q.free ? copy.freeBanner : fillLive(copy.moreBanner, v)}
                </p>
                <p className="mt-4 text-[12px] leading-relaxed text-fg-3">{copy.footnote}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Line({ icon, label, value, note, strong = false }: { icon: string; label: string; value: string; note: string; strong?: boolean }) {
  return (
    <div className="flex items-start gap-3.5 border-b border-hair py-4 first:pt-0 last:border-0">
      <span className="icon-tile icon-tile-soft mt-0.5" style={{ '--s': '40px' } as CSSProperties}>
        <Icon name={icon} size={18} strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-fg-2">{label}</span>
        <span className="mt-0.5 block text-[13px] leading-snug text-fg-3">{note}</span>
      </span>
      <span className={`tnum shrink-0 font-extrabold tracking-[-0.03em] text-fg ${strong ? 'text-[28px]' : 'text-[22px]'}`}>{value}</span>
    </div>
  );
}
