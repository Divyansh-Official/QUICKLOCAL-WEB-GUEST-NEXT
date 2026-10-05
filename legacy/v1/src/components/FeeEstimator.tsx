/**
 * What an order actually costs, worked out the way the platform works it out.
 *
 * ── IT RUNS THE REAL ARITHMETIC, NOT A MARKETING APPROXIMATION ──────────────
 * Every line below mirrors DeliveryFeeCalculatorService: a flat base that
 * covers the first few kilometres, then a fuel-derived per-km surcharge with a
 * whole-rupee ceiling, and a platform fee charged to the vendor at the rate
 * that category carries. The constants live in fees.json and each one names the
 * backend constant it copies, so a number that drifts is a number somebody can
 * find.
 *
 * ── WHY PUT IT ON A PUBLIC PAGE AT ALL ──────────────────────────────────────
 * Two of the three people this site is addressed to are deciding whether the
 * economics work for them. A shop owner wants to know what a ₹400 order leaves
 * them; a rider wants to know what a 7 km drop pays. A page of adjectives
 * cannot answer either, and a fee table answers them only for whoever is
 * willing to do the arithmetic. This does the arithmetic.
 *
 * ── THE FREE-DELIVERY CLIFF IS THE POINT ────────────────────────────────────
 * The single most surprising rule in the model is that crossing the vendor's
 * threshold moves the base fee from the customer to the vendor — the rider is
 * paid the same either way. Watching the split jump as the basket crosses the
 * line explains that in a way a sentence does not, so the control is a slider
 * and the threshold is marked on it.
 */
'use client';

import { useMemo, useState } from 'react';
import { fees } from '@/lib/data';
import { GlassPane } from './glass/GlassPane';
import { Icon } from './Icon';
import { Container, Eyebrow } from './ui';
import { Reveal } from './Reveal';

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`;

/**
 * The backend's formula, to the rupee.
 *
 *   fuelCostPerKm = petrolPrice / mileage
 *   extraFee      = ceil(extraKm * fuelCostPerKm * multiplier)
 *   deliveryFee   = baseFee + extraFee
 */
function quote(subtotalInr: number, distanceKm: number, platformFeePercent: number) {
  const extraKm = Math.max(0, distanceKm - fees.freeRangeKm);
  const fuelCostPerKm = fees.petrolPriceInrPerL / fees.bikeMileageKmpl;
  const extraFee = Math.ceil(extraKm * fuelCostPerKm * fees.driverMultiplier);
  const deliveryFee = fees.baseFeeInr + extraFee;

  const freeDelivery = subtotalInr >= fees.defaultFreeDeliveryThresholdInr;
  // Crossing the threshold moves the BASE off the customer and onto the
  // vendor. The per-km part is the customer's either way, and the rider is
  // paid the whole fee regardless of who funded it.
  const customerPaysDelivery = freeDelivery ? extraFee : deliveryFee;
  const vendorAbsorbsDelivery = freeDelivery ? fees.baseFeeInr : 0;

  const platformFee = Math.round((subtotalInr * platformFeePercent) / 100);
  const customerTotal = subtotalInr + customerPaysDelivery;
  const vendorKeeps = subtotalInr - platformFee - vendorAbsorbsDelivery;

  return {
    extraKm,
    extraFee,
    deliveryFee,
    freeDelivery,
    customerPaysDelivery,
    vendorAbsorbsDelivery,
    platformFee,
    customerTotal,
    vendorKeeps,
    riderEarns: deliveryFee,
  };
}

export function FeeEstimator() {
  const [subtotal, setSubtotal] = useState(650);
  const [distance, setDistance] = useState(3);
  const [category, setCategory] = useState(fees.categories[0]);

  const q = useMemo(
    () => quote(subtotal, distance, category.platformFeePercent),
    [subtotal, distance, category],
  );

  /** Where the free-delivery line sits on the basket slider, as a percentage. */
  const thresholdAt = (fees.defaultFreeDeliveryThresholdInr / 2000) * 100;

  return (
    <section className="py-16 sm:py-20" id="what-it-costs">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[620px] text-center">
            <Eyebrow>What it costs</Eyebrow>
            <h2 className="mt-2.5 text-balance text-[26px] font-extrabold leading-[1.15] tracking-tight sm:text-[34px]">
              Work out a real order,{' '}
              <span className="text-[var(--color-tangerine-600)]">to the rupee</span>
            </h2>
            <p className="mx-auto mt-3 max-w-[52ch] text-[14px] leading-relaxed text-[var(--color-ink-500)]">
              This runs the same arithmetic the platform runs when an order is placed — the flat base
              fee, the fuel-derived per-km beyond {fees.freeRangeKm} km, and the platform fee your
              category carries. Nothing here is rounded for effect.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <GlassPane
            radius={26}
            tint="rgba(255,255,255,0.58)"
            blur={2.4}
            strength="full"
            elevation="float"
            className="mx-auto mt-9 max-w-[880px] overflow-hidden">
            <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {/* ── controls ───────────────────────────────────────────── */}
              <div className="border-b border-white/50 p-5 sm:p-6 md:border-b-0 md:border-r">
                <fieldset>
                  <legend className="text-[11px] font-bold uppercase tracking-[.09em] text-[var(--color-tangerine-700)]">
                    Category
                  </legend>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {fees.categories.map(c => {
                      const on = c.slug === category.slug;
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => setCategory(c)}
                          aria-pressed={on}
                          className={`rounded-full px-3 py-1.5 text-[12.5px] font-bold transition ${
                            on
                              ? 'bg-[var(--color-tangerine-500)] text-white shadow-[0_6px_16px_-6px_rgba(240,134,38,.75)]'
                              : 'bg-white/60 text-[var(--color-ink-700)] hover:bg-white/90'
                          }`}>
                          {c.name}
                          <span className="ml-1.5 opacity-70">{c.platformFeePercent}%</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="mt-6">
                  <label
                    htmlFor="fee-subtotal"
                    className="flex items-baseline justify-between text-[11px] font-bold uppercase tracking-[.09em] text-[var(--color-tangerine-700)]">
                    Basket
                    <span className="tnum text-[15px] font-extrabold tracking-normal text-[var(--text)]">
                      {rupees(subtotal)}
                    </span>
                  </label>
                  <div className="relative mt-3">
                    <input
                      id="fee-subtotal"
                      type="range"
                      min={100}
                      max={2000}
                      step={50}
                      value={subtotal}
                      onChange={e => setSubtotal(Number(e.target.value))}
                      aria-describedby="fee-subtotal-note"
                      className="ql-range w-full"
                    />
                    {/* The cliff, marked where it actually falls. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-1 h-[22px] w-px bg-[var(--color-ink-300)]"
                      style={{ left: `${thresholdAt}%` }}
                    />
                  </div>
                  <p id="fee-subtotal-note" className="mt-2 text-[11.5px] text-[var(--color-ink-500)]">
                    Free delivery from {rupees(fees.defaultFreeDeliveryThresholdInr)} — the default
                    until a shop sets its own.
                  </p>
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="fee-distance"
                    className="flex items-baseline justify-between text-[11px] font-bold uppercase tracking-[.09em] text-[var(--color-tangerine-700)]">
                    Distance
                    <span className="tnum text-[15px] font-extrabold tracking-normal text-[var(--text)]">
                      {distance} km
                    </span>
                  </label>
                  <input
                    id="fee-distance"
                    type="range"
                    min={1}
                    max={15}
                    step={1}
                    value={distance}
                    onChange={e => setDistance(Number(e.target.value))}
                    aria-describedby="fee-distance-note"
                    className="ql-range mt-3 w-full"
                  />
                  <p id="fee-distance-note" className="mt-2 text-[11.5px] text-[var(--color-ink-500)]">
                    The first {fees.freeRangeKm} km are covered by the base fee.
                    {q.extraKm > 0
                      ? ` ${q.extraKm} km beyond it adds ${rupees(q.extraFee)}.`
                      : ' Nothing extra at this distance.'}
                  </p>
                </div>
              </div>

              {/* ── the split ──────────────────────────────────────────── */}
              <div className="p-5 sm:p-6" aria-live="polite">
                <Line
                  icon="basket"
                  label="Customer pays"
                  value={rupees(q.customerTotal)}
                  note={
                    q.freeDelivery
                      ? `${rupees(subtotal)} basket · ${rupees(q.customerPaysDelivery)} delivery (base covered by the shop)`
                      : `${rupees(subtotal)} basket · ${rupees(q.customerPaysDelivery)} delivery`
                  }
                  strong
                />
                <Line
                  icon="store"
                  label="Shop keeps"
                  value={rupees(q.vendorKeeps)}
                  note={
                    q.vendorAbsorbsDelivery > 0
                      ? `after ${rupees(q.platformFee)} platform fee and ${rupees(q.vendorAbsorbsDelivery)} of delivery`
                      : `after ${rupees(q.platformFee)} platform fee at ${category.platformFeePercent}%`
                  }
                />
                <Line
                  icon="bike"
                  label="Rider earns"
                  value={rupees(q.riderEarns)}
                  note="The whole delivery fee, whoever funded it"
                />

                {q.freeDelivery ? (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--color-ok)]/10 px-3 py-2.5 text-[12px] font-semibold leading-relaxed text-[var(--color-ok)]">
                    <Icon name="check" size={14} />
                    Over the threshold, so the shop absorbs the {rupees(fees.baseFeeInr)} base and the
                    customer sees free delivery.
                  </p>
                ) : (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/60 px-3 py-2.5 text-[12px] leading-relaxed text-[var(--color-ink-500)]">
                    <Icon name="sparkle" size={14} />
                    {rupees(fees.defaultFreeDeliveryThresholdInr - subtotal)} more and the shop takes on
                    the base fee instead.
                  </p>
                )}

                <p className="mt-3 text-[10.5px] leading-relaxed text-[var(--color-ink-300)]">
                  Per-km uses {rupees(fees.petrolPriceInrPerL)}/L at {fees.bikeMileageKmpl} km/L with
                  the platform&rsquo;s {fees.driverMultiplier}× rider multiplier. In production the
                  fuel price is your city&rsquo;s for the day.
                </p>
              </div>
            </div>
          </GlassPane>
        </Reveal>
      </Container>
    </section>
  );
}

function Line({ icon, label, value, note, strong = false }: {
  icon: 'basket' | 'store' | 'bike';
  label: string;
  value: string;
  note: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-white/50 py-3 last:border-0">
      <span
        aria-hidden
        className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--color-tangerine-100)] text-[var(--color-tangerine-700)]">
        <Icon name={icon} size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-[var(--color-ink-500)]">
          {label}
        </span>
        <span className="mt-0.5 block text-[11.5px] leading-snug text-[var(--color-ink-500)]">
          {note}
        </span>
      </span>
      <span
        className={`tnum shrink-0 tabular-nums ${
          strong ? 'text-[22px] font-extrabold' : 'text-[18px] font-bold'
        }`}>
        {value}
      </span>
    </div>
  );
}
