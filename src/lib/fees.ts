/**
 * The platform's delivery arithmetic, as pure functions — imported by server
 * pages for the figures they print and by the client widgets that move them.
 * Each one mirrors a backend service line for line; fees.json names the
 * constants. Commission is deliberately not modelled here: the public site
 * does not publish it.
 */

export type FeeRules = {
  baseFeeInr: number;
  freeRangeKm: number;
  petrolPriceInrPerL: number;
  bikeMileageKmpl: number;
  driverMultiplier: number;
  defaultFreeDeliveryThresholdInr: number;
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
 * OrderFeeService's delivery split: at or over the shop's threshold the shop
 * funds the base and the customer the extra-km; under it the customer pays
 * the lot. The rider is paid the whole fee either way.
 */
export function deliverySplit(f: FeeRules, subtotal: number, km: number, threshold = f.defaultFreeDeliveryThresholdInr) {
  const fee = deliveryFee(f, km);
  const free = subtotal >= threshold;
  return {
    ...fee,
    free,
    customer: free ? fee.extra : fee.total,
    shop: free ? fee.base : 0,
    rider: fee.total,
  };
}
