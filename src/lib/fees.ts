/**
 * The platform's money arithmetic, as pure functions — imported by server
 * pages for the figures they print and by the client widgets that move them.
 *
 * Each one mirrors a backend service line for line; fees.json names the
 * constants, and the comment on each function names the code it copies.
 */

export type FeeRules = {
  baseFeeInr: number;
  freeRangeKm: number;
  petrolPriceInrPerL: number;
  bikeMileageKmpl: number;
  driverMultiplier: number;
  defaultFreeDeliveryThresholdInr: number;
  absorbCeilingPercent: number;
  marginFloorPercent: number;
};

/** DeliveryFeeCalculatorService: fuel cost per km × the rider multiplier. */
export function perKmRate(f: FeeRules): number {
  return (f.petrolPriceInrPerL / f.bikeMileageKmpl) * f.driverMultiplier;
}

/**
 * DeliveryFeeCalculatorService: the base covers the free range; every km past
 * it is charged at the per-km rate, rounded UP to the rupee. The rider is paid
 * this whole figure (SplitPayoutService.driverAmount).
 */
export function deliveryFee(f: FeeRules, km: number) {
  const extraKm = Math.max(0, km - f.freeRangeKm);
  const extra = Math.ceil(extraKm * perKmRate(f));
  return { base: f.baseFeeInr, extraKm, extra, total: f.baseFeeInr + extra };
}

/**
 * ProfitSimulatorService.recommendedMinThreshold: the smallest threshold T at
 * which a free order of exactly T gives away no more than the ceiling —
 * T ≥ base / (ceiling − fee%). Null when the fee alone is over the ceiling.
 */
export function recommendedThreshold(f: FeeRules, feePercent: number): number | null {
  const denom = f.absorbCeilingPercent / 100 - feePercent / 100;
  if (denom <= 0) return null;
  return Math.ceil(f.baseFeeInr / denom);
}

const pct = (part: number, whole: number) => (whole > 0 ? Math.round(((part * 100) / whole) * 100) / 100 : 0);

/** ProfitSimulatorService.simulate, without the request plumbing. */
export function simulateProfit(f: FeeRules, input: { feePercent: number; threshold: number; subtotal: number; costPercent: number | null }) {
  const { feePercent, threshold, subtotal, costPercent } = input;
  const free = subtotal >= threshold;
  const platformFee = Math.round(subtotal * feePercent) / 100;
  const absorbed = free ? f.baseFeeInr : 0;
  const net = subtotal - platformFee - absorbed;
  const givenPercent = pct(platformFee + absorbed, subtotal);

  let cost: number | null = null;
  let profit: number | null = null;
  let margin: number | null = null;
  if (costPercent != null) {
    cost = Math.round(subtotal * costPercent) / 100;
    profit = net - cost;
    margin = pct(profit, subtotal);
  }

  const recommended = recommendedThreshold(f, feePercent);
  const thresholdSafe = recommended == null || threshold >= recommended;
  const scenarioOk =
    profit != null && margin != null
      ? profit > 0 && margin >= f.marginFloorPercent
      : net > 0 && givenPercent <= f.absorbCeilingPercent;
  const healthy = scenarioOk && thresholdSafe;

  /* The same warnings, in the same order, as the service. */
  const warnings: { key: 'thresholdLow' | 'loss' | 'thin' | 'nonPositive' | 'giveaway' | 'cliff' }[] = [];
  if (!thresholdSafe) warnings.push({ key: 'thresholdLow' });
  if (profit != null && margin != null) {
    if (profit < 0) warnings.push({ key: 'loss' });
    else if (margin < f.marginFloorPercent) warnings.push({ key: 'thin' });
  } else if (net <= 0) warnings.push({ key: 'nonPositive' });
  else if (givenPercent > f.absorbCeilingPercent) warnings.push({ key: 'giveaway' });
  if (!healthy && free && absorbed > 0) warnings.push({ key: 'cliff' });

  return { free, platformFee, absorbed, net, givenPercent, cost, profit, margin, recommended, healthy, warnings };
}
