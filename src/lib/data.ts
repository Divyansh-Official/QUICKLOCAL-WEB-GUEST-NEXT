/**
 * The site's entire data layer.
 *
 * Every word and every figure on the site is read from a JSON file in
 * `src/data/`, imported at build time — nothing fetches, so every route
 * prerenders to static HTML and cannot show a spinner or a stale number.
 *
 *   info, fees, riders, plans, categories, lifecycle   platform facts (each
 *                                                       file names the table
 *                                                       or migration it mirrors)
 *   site.json                                           switchboard: theme, flags
 *   ui.json, home.json, pages.json, faq.json            every line of copy
 *
 * Copy may reference figures as {tokens}. `fill()` resolves them from the
 * platform files, so "₹{riderMin}" in a sentence follows riders.json: change a
 * fee once and every sentence that quotes it changes with it.
 *
 * Server components import from here. Client components receive the exact
 * strings they print as props, so the JSON never ships to the browser whole.
 */
import aboutJson from '@/data/about.json';
import appJson from '@/data/app.json';
import categoriesJson from '@/data/categories.json';
import contactJson from '@/data/contact.json';
import faqJson from '@/data/faq.json';
import featuresJson from '@/data/features.json';
import feesJson from '@/data/fees.json';
import homeJson from '@/data/home.json';
import infoJson from '@/data/info.json';
import lifecycleJson from '@/data/lifecycle.json';
import navJson from '@/data/nav.json';
import pagesJson from '@/data/pages.json';
import plansJson from '@/data/plans.json';
import ridersJson from '@/data/riders.json';
import siteJson from '@/data/site.json';
import statsJson from '@/data/stats.json';
import stepsJson from '@/data/steps.json';
import testimonialsJson from '@/data/testimonials.json';
import trustJson from '@/data/trust.json';
import uiJson from '@/data/ui.json';

// ── shapes ──────────────────────────────────────────────────────────────────

export type Category = {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  tagline: string;
  examples: string[];
  hue: string;
  platformFeePercent: number;
  displayOrder: number;
};

export type Plan = {
  name: string;
  label: string;
  priceMonthly: number;
  maxProducts: number;
  boostsPerMonth: number;
  popular?: boolean;
  blurb: string;
  features: Record<string, boolean | string | null>;
};

export type OrderStep = { status: string; label: string; detail: string; icon: string };
export type Link = { label: string; href: string; icon?: string };
export type FooterColumn = { heading: string; links: Link[] };
export type StoreListing = { available: boolean; url: string | null; store: string };

// ── raw files ───────────────────────────────────────────────────────────────

export const info = infoJson;
export const contact = contactJson;
export const fees = feesJson;
export const riders = ridersJson;
export const lifecycle: { happy: OrderStep[]; unhappy: OrderStep[] } = lifecycleJson;
export const features = featuresJson;
export const about = aboutJson;
export const site = siteJson;
export const ui = uiJson;
export const home = homeJson;
export const pages = pagesJson;
export const trust = trustJson.items;
export const stats = statsJson.items;
export const steps = [...stepsJson.items].sort((a, b) => a.n - b.n);
export const plans: Plan[] = plansJson.items;
export const featureLabels: Record<string, string> = plansJson.featureLabels;
export const testimonials: { name: string; city: string; rating: number; body: string }[] =
  testimonialsJson.items;
export const appStores: { android: StoreListing; ios: StoreListing } = {
  android: appJson.android,
  ios: appJson.ios,
};
export const appRoles = appJson.roles;

export const categories: Category[] = [...categoriesJson.items].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);
export const getCategory = (slug: string) => categories.find(c => c.slug === slug) ?? null;

/** Header links: everything but Home, which the logo already is. */
export const nav: Link[] = navJson.primary.filter(item => item.href !== '/');
export const allNav: Link[] = navJson.primary;
export const footerColumns: FooterColumn[] = navJson.footer;

export const isEnabled = (flag: keyof typeof siteJson.features) => siteJson.features[flag] !== false;

// ── formatting ──────────────────────────────────────────────────────────────

/** Indian grouping: 12,45,320 — the console and the apps write money the same way. */
export function inr(value: number): string {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** "2%" rather than "2.0%" — trailing zeros read as false precision. */
export function feePercent(value: number): string {
  return `${Number(value.toFixed(2))}%`;
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
export const mailHref = (email: string) => `mailto:${email}`;

// ── copy tokens ─────────────────────────────────────────────────────────────

const freePlan = plans.find(p => p.priceMonthly === 0);

/** Every {token} a sentence in the JSON may use. */
export const tokens: Record<string, string> = {
  name: info.name,
  tagline: info.tagline.toLowerCase(),
  slogan: info.slogan,
  version: info.version,
  city: contact.city,
  state: contact.state,
  phone: contact.phone,
  email: contact.email,
  address: contact.address,
  radius: String(info.delivery.defaultRadiusKm),
  maxRadius: String(info.delivery.maxRadiusKm),
  hours: String(info.delivery.maxHours),
  minFee: String(info.delivery.minFeeInr),
  platformFee: String(info.fees.platformFeeInr),
  lowestFee: String(info.fees.lowestCategoryFeePercent),
  referral: String(info.referral.rewardInr),
  riderBase: String(riders.payout.baseInr),
  riderPerKm: String(riders.payout.perKmInr),
  riderMin: String(riders.payout.minimumInr),
  twoKm: String(Math.max(riders.payout.minimumInr, riders.payout.baseInr + 2 * riders.payout.perKmInr)),
  freeKm: String(fees.freeRangeKm),
  base: inr(fees.baseFeeInr),
  threshold: inr(fees.defaultFreeDeliveryThresholdInr),
  petrol: inr(fees.petrolPriceInrPerL),
  mileage: String(fees.bikeMileageKmpl),
  multiplier: String(fees.driverMultiplier),
  freeProducts: String(freePlan?.maxProducts ?? 25),
  year: String(new Date().getFullYear()),
};

/**
 * Resolve {tokens}. An unknown token is left in place: some are filled later
 * on the client from live values (the estimator's {basket}), and a typo that
 * stays visible gets noticed rather than silently vanishing.
 */
export function fill(template: string | undefined | null, extra: Record<string, string | number> = {}): string {
  if (!template) return '';
  const values: Record<string, string | number> = { ...tokens, ...extra };
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

/** fill() over every string in a tree — for passing a whole block of copy as props. */
export function fillDeep<T>(node: T, extra: Record<string, string | number> = {}): T {
  if (typeof node === 'string') return fill(node, extra) as T;
  if (Array.isArray(node)) return node.map(item => fillDeep(item, extra)) as T;
  if (node && typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>)
        .filter(([key]) => !key.startsWith('_'))
        .map(([key, value]) => [key, fillDeep(value, extra)]),
    ) as T;
  }
  return node;
}

export const faq = fillDeep(faqJson.items);

// ── urls ────────────────────────────────────────────────────────────────────

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const siteUrl = String(
  siteJson.url || process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : '') || 'http://localhost:3000',
).replace(/\/+$/, '');
