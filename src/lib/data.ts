/**
 * The site's entire data layer.
 *
 * ── EVERY FIGURE COMES FROM A JSON FILE, AND NOTHING FETCHES ────────────────
 * There is no API client here and no environment variable pointing at one. The
 * JSON is imported at build time, so the whole site renders as static HTML and
 * cannot show a loading state, a stale value, or an error — there is nothing to
 * be slow or to fail.
 *
 * ── THE JSON CARRIES ITS OWN PROVENANCE ─────────────────────────────────────
 * Each file opens with a `_source` line naming the table or migration its
 * values came from. That is not decoration: this site makes public claims about
 * fees, delivery times and payouts, and the person updating a number six months
 * from now needs to know which column to check it against. Keys beginning with
 * an underscore are notes and are never rendered.
 *
 * ── TYPES ARE DECLARED, NOT INFERRED ────────────────────────────────────────
 * `resolveJsonModule` would infer a type from whatever the file happens to
 * contain today, so an accidentally deleted field would surface as a confusing
 * error inside a component rather than here. Declaring the shape means the JSON
 * is checked against what the components actually need.
 */
import aboutJson from '@/data/about.json';
import categoriesJson from '@/data/categories.json';
import contactJson from '@/data/contact.json';
import featuresJson from '@/data/features.json';
import infoJson from '@/data/info.json';
import navJson from '@/data/nav.json';
import plansJson from '@/data/plans.json';
import statsJson from '@/data/stats.json';
import stepsJson from '@/data/steps.json';
import testimonialsJson from '@/data/testimonials.json';
import trustJson from '@/data/trust.json';

// ── shapes ──────────────────────────────────────────────────────────────────

export type Info = {
  name: string;
  tagline: string;
  slogan: string;
  version: string;
  headline: { lead: string; accent: string };
  intro: string;
  delivery: { defaultRadiusKm: number; maxRadiusKm: number; maxHours: number; minFeeInr: number };
  fees: { platformFeeInr: number; lowestCategoryFeePercent: number };
  referral: { rewardInr: number };
  riderPayout: { baseInr: number; perKmInr: number; minimumInr: number };
};

export type Social = { label: string; icon: string; handle: string; href: string };

export type Contact = {
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  socials: Social[];
};

export type Category = {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  platformFeePercent: number;
  displayOrder: number;
};

export type Stat = { value: string; label: string; detail: string; icon: string };
export type Trust = { title: string; detail: string; icon: string };
export type Step = { n: number; title: string; body: string; status: string };

export type Plan = {
  name: string;
  label: string;
  priceMonthly: number;
  /** -1 in the schema means unlimited. */
  maxProducts: number;
  boostsPerMonth: number;
  popular?: boolean;
  blurb: string;
  features: Record<string, boolean | string | null>;
};

export type Testimonial = {
  name: string;
  city: string;
  rating: number;
  body: string;
};

export type NavLink = { label: string; href: string };
export type FooterColumn = { heading: string; links: NavLink[] };

// ── the data ────────────────────────────────────────────────────────────────

export const info: Info = infoJson;
export const contact: Contact = contactJson;
export const categories: Category[] = [...categoriesJson.items].sort(
  (a, b) => a.displayOrder - b.displayOrder,
);
export const stats: Stat[] = statsJson.items;
export const trust: Trust[] = trustJson.items;
export const steps: Step[] = [...stepsJson.items].sort((a, b) => a.n - b.n);
export const plans: Plan[] = plansJson.items;
export const featureLabels: Record<string, string> = plansJson.featureLabels;
export const about = aboutJson;
export const features = featuresJson;
export const nav: NavLink[] = navJson.primary;
export const footerColumns: FooterColumn[] = navJson.footer;

/**
 * Empty until a real review exists — see the note in testimonials.json.
 * Callers check `.length` and render nothing rather than an empty carousel.
 */
export const testimonials: Testimonial[] = testimonialsJson.items;

// ── formatting ──────────────────────────────────────────────────────────────

/** Indian grouping: 12,45,320 — not 1,245,320. Matches the console. */
export function inr(value: number): string {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

/** The schema stores unlimited as -1; nobody should read "-1 products". */
export function productLimit(max: number): string {
  return max < 0 ? 'Unlimited products' : `Up to ${max} products`;
}

/** "2%" rather than "2.0%" — trailing zeros read as false precision. */
export function feePercent(value: number): string {
  return `${Number(value.toFixed(2))}%`;
}
