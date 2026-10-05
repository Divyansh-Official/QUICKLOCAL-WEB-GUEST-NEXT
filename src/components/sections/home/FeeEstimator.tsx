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
import { fillLive, rupees } from '@/lib/format';

type Fees = {
  baseFeeInr: number;
  freeRangeKm: number;
  petrolPriceInrPerL: number;
  bikeMileageKmpl: number;
  driverMultiplier: number;
  defaultFreeDeliveryThresholdInr: number;
  categories: { slug: string; name: string; platformFeePercent: number }[];
};

type Copy = Record<
  | 'eyebrow' | 'title' | 'accent' | 'intro' | 'category' | 'basket' | 'distance' | 'thresholdNote' | 'freeKmNote'
  | 'extraNote' | 'noExtraNote' | 'customer' | 'shop' | 'rider' | 'customerNote' | 'customerNoteFree' | 'shopNote'
  | 'shopNoteFree' | 'riderNote' | 'freeBanner' | 'moreBanner' | 'footnote' | 'thresholdMark',
  string
>;

const BASKET_MAX = 2000;
const DISTANCE_MAX = 15;

function quote(fees: Fees, subtotal: number, distance: number, percent: number) {
  const extraKm = Math.max(0, distance - fees.freeRangeKm);
  const fuelCostPerKm = fees.petrolPriceInrPerL / fees.bikeMileageKmpl;
  const extraFee = Math.ceil(extraKm * fuelCostPerKm * fees.driverMultiplier);
  const deliveryFee = fees.baseFeeInr + extraFee;
  const free = subtotal >= fees.defaultFreeDeliveryThresholdInr;
  const customerDelivery = free ? extraFee : deliveryFee;
  const absorbed = free ? fees.baseFeeInr : 0;
  const platformFee = Math.round((subtotal * percent) / 100);
  return {
    extraKm,
    extraFee,
    free,
    customerDelivery,
    absorbed,
    platformFee,
    customerTotal: subtotal + customerDelivery,
    shopKeeps: subtotal - platformFee - absorbed,
    riderEarns: deliveryFee,
  };
}

export default function FeeEstimator({ fees, copy }: { fees: Fees; copy: Copy }) {
  const [subtotal, setSubtotal] = useState(650);
  const [distance, setDistance] = useState(6);
  const [slug, setSlug] = useState(fees.categories[0].slug);
  const category = fees.categories.find(c => c.slug === slug) ?? fees.categories[0];
  const q = useMemo(() => quote(fees, subtotal, distance, category.platformFeePercent), [fees, subtotal, distance, category]);

  const thresholdAt = ((fees.defaultFreeDeliveryThresholdInr - 100) / (BASKET_MAX - 100)) * 100;
  const basketFill = ((subtotal - 100) / (BASKET_MAX - 100)) * 100;
  const distanceFill = ((distance - 1) / (DISTANCE_MAX - 1)) * 100;
  const v = {
    basket: rupees(subtotal),
    delivery: rupees(q.customerDelivery),
    fee: rupees(q.platformFee),
    percent: category.platformFeePercent,
    absorbed: rupees(q.absorbed),
    extraKm: q.extraKm,
    extraFee: rupees(q.extraFee),
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
                <p className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">{copy.category}</p>
                <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label={copy.category}>
                  {fees.categories.map(c => {
                    const on = c.slug === slug;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSlug(c.slug)}
                        className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-bold transition-[background-color,color,box-shadow,transform] duration-300 active:scale-95 ${
                          on
                            ? 'btn-primary'
                            : 'bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] text-fg-2 hover:bg-[color-mix(in_oklab,var(--fg)_10%,transparent)] hover:text-fg'
                        }`}>
                        {c.name}
                        <span className={on ? 'text-white/80' : 'text-fg-3'}>{c.platformFeePercent}%</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8">
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
                      <span className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.08em] text-ok">{copy.thresholdMark}</span>
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
              <div className="p-6 sm:p-8" aria-live="polite">
                <Line icon="basket" label={copy.customer} value={rupees(q.customerTotal)} note={fillLive(q.free ? copy.customerNoteFree : copy.customerNote, v)} strong />
                <Line icon="store" label={copy.shop} value={rupees(q.shopKeeps)} note={fillLive(q.absorbed > 0 ? copy.shopNoteFree : copy.shopNote, v)} />
                <Line icon="bike" label={copy.rider} value={rupees(q.riderEarns)} note={copy.riderNote} />

                <p
                  key={q.free ? 'free' : 'more'}
                  className={`enter-scale mt-5 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[13.5px] font-semibold leading-relaxed ${
                    q.free ? 'bg-[color-mix(in_oklab,var(--ok)_14%,transparent)] text-ok' : 'bg-[color-mix(in_oklab,var(--fg)_5%,transparent)] text-fg-2'
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
