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
import { deliveryFee, perKmRate } from '@/lib/fees';

// ── shapes ──────────────────────────────────────────────────────────────────

export type Category = {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  tagline: string;
  examples: string[];
  hue: string;
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
/** Only the delivery constants — what a client widget is handed, and nothing else. */
export const deliveryRules = {
  baseFeeInr: feesJson.baseFeeInr,
  freeRangeKm: feesJson.freeRangeKm,
  petrolPriceInrPerL: feesJson.petrolPriceInrPerL,
  bikeMileageKmpl: feesJson.bikeMileageKmpl,
  driverMultiplier: feesJson.driverMultiplier,
  defaultFreeDeliveryThresholdInr: feesJson.defaultFreeDeliveryThresholdInr,
};
export const riders = ridersJson;
export const lifecycle: { happy: OrderStep[]; unhappy: OrderStep[] } = lifecycleJson;
export const site = siteJson;
export const ui = uiJson;
export const home = homeJson;
export const pages = pagesJson;
export const steps = [...stepsJson.items].sort((a, b) => a.n - b.n);
export const plans: Plan[] = plansJson.items;
export const featureLabels: Record<string, string> = plansJson.featureLabels;
export const testimonials: { name: string; city: string; rating: number; body: string }[] =
  testimonialsJson.items;
export const appStores: { android: StoreListing; ios: StoreListing } = {
  android: appJson.android,
  ios: appJson.ios,
};

export const categories: Category[] = [...categoriesJson.items].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);
export const getCategory = (slug: string) => categories.find(c => c.slug === slug) ?? null;

/**
 * Header links: everything but Home (the logo already is it) and the page the
 * header's own button opens — the same destination twice in one bar is noise.
 * The phone menu keeps the full list.
 */
export const nav: Link[] = navJson.primary.filter(item => item.href !== '/' && item.href !== uiJson.header.cta.href);
export const allNav: Link[] = navJson.primary;
/** The phone menu: every primary page, less the one its own button opens. */
export const menuNav: Link[] = navJson.primary.filter(item => item.href !== uiJson.header.cta.href);
export const secondaryNav: Link[] = navJson.secondary;
export const footerColumns: FooterColumn[] = navJson.footer;

export const isEnabled = (flag: keyof typeof siteJson.features) => siteJson.features[flag] !== false;

// ── formatting ──────────────────────────────────────────────────────────────

/** Indian grouping: 12,45,320 — the console and the apps write money the same way. */
export function inr(value: number): string {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;
export const mailHref = (email: string) => `mailto:${email}`;

// ── copy tokens ─────────────────────────────────────────────────────────────

const plan = (name: string) => plans.find(p => p.name === name);
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const aisleWord = NUMBER_WORDS[categories.length] ?? String(categories.length);
const names = categories.map(c => c.name);
const sample = deliveryFee(fees, 6);

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
  aisles: aisleWord,
  Aisles: aisleWord.charAt(0).toUpperCase() + aisleWord.slice(1),
  aisleList: `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`,
  referral: String(info.referral.rewardInr),
  freeKm: String(fees.freeRangeKm),
  base: inr(fees.baseFeeInr),
  baseRaw: String(fees.baseFeeInr),
  perKm: perKmRate(fees).toFixed(2),
  sampleKm: '6',
  sampleFee: inr(sample.total),
  sampleExtra: inr(sample.extra),
  sampleExtraKm: String(sample.extraKm),
  threshold: inr(fees.defaultFreeDeliveryThresholdInr),
  petrol: inr(fees.petrolPriceInrPerL),
  mileage: String(fees.bikeMileageKmpl),
  multiplier: String(fees.driverMultiplier),
  freeProducts: String(plan('FREE')?.maxProducts ?? ''),
  starterPrice: String(plan('STARTER')?.priceMonthly ?? ''),
  starterProducts: String(plan('STARTER')?.maxProducts ?? ''),
  growthPrice: String(plan('GROWTH')?.priceMonthly ?? ''),
  growthProducts: String(plan('GROWTH')?.maxProducts ?? ''),
  proPrice: String(plan('PRO')?.priceMonthly ?? ''),
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

// ── filled copy (needs the tokens above) ────────────────────────────────────

export type FaqItem = { audience: string; q: string; a: string; home?: boolean };
export const faqAll: FaqItem[] = fillDeep(faqJson.items);
export const faqAudiences = faqJson.audiences;
/** The questions the home page asks; the Help Centre has every one. */
export const faq = faqAll.filter(item => item.home);

export const features = fillDeep(featuresJson);
export const about = fillDeep(aboutJson);
export const appRoles = fillDeep(appJson.roles);
export const trust = fillDeep(trustJson.items);
export const stats = fillDeep(statsJson.items);

// ── urls ────────────────────────────────────────────────────────────────────

const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
export const siteUrl = String(
  siteJson.url || process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : '') || 'http://localhost:3000',
).replace(/\/+$/, '');
