/**
 * Pricing.
 *
 * Every figure here is a column value from subscription_plans — price_monthly,
 * max_products, boosts_per_month and the features jsonb. Nothing is rounded for
 * effect and no plan is invented; if a tier is missing from the table it is
 * missing from this page.
 */
import type { Metadata } from 'next';
import { Icon } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { Button, Card, Container, PageHeader, SectionHeading } from '@/components/ui';
import { categories, feePercent, featureLabels, info, inr, plans, productLimit } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Pricing',
  description: `Vendor plans on ${info.name} — from free to ₹799 a month, plus a platform fee that starts at ${info.fees.lowestCategoryFeePercent}%.`,
};

/** The order the comparison rows appear in. */
const FEATURE_ORDER = [
  'sales_dashboard',
  'export_orders',
  'customer_history',
  'priority_support',
  'advanced_analytics',
  'featured_badge',
  'bulk_offers',
  'custom_banner',
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Plans for the shop, fees for the sale"
        intro={`A monthly plan decides how much you can list and what tools you get. On top of that the platform takes ${info.fees.lowestCategoryFeePercent}–3% of each sale, depending on the category.`}
      />

      <Container className="pb-16">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <Card
                className={`relative flex h-full flex-col p-5 ${
                  p.popular ? 'border-[var(--color-tangerine-500)] ring-1 ring-[var(--color-tangerine-500)]' : ''
                }`}>
                {p.popular ? (
                  <span className="absolute -top-2.5 left-5 rounded-full bg-[var(--color-tangerine-500)] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                    Most chosen
                  </span>
                ) : null}

                <h2 className="text-[15px] font-extrabold uppercase tracking-wide text-[var(--color-tangerine-600)]">
                  {p.label}
                </h2>
                <p className="mt-3 flex items-baseline gap-1">
                  <span className="tnum text-[32px] font-extrabold leading-none">
                    {p.priceMonthly === 0 ? 'Free' : inr(p.priceMonthly)}
                  </span>
                  {p.priceMonthly > 0 ? (
                    <span className="text-[12px] text-[var(--text-muted)]">/month</span>
                  ) : null}
                </p>
                <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                  {p.blurb}
                </p>

                <ul className="mt-5 flex-1 space-y-2">
                  <Line ok>{productLimit(p.maxProducts)}</Line>
                  <Line ok={p.boostsPerMonth > 0}>
                    {p.boostsPerMonth > 0
                      ? `${p.boostsPerMonth} shop boost${p.boostsPerMonth > 1 ? 's' : ''} a month`
                      : 'No shop boosts'}
                  </Line>
                  {FEATURE_ORDER.map(key => (
                    <Line key={key} ok={Boolean(p.features[key])}>
                      {featureLabels[key]}
                      {key === 'priority_support' && p.features.priority_type
                        ? ` (${String(p.features.priority_type).replace(/_/g, ' ')})`
                        : ''}
                    </Line>
                  ))}
                </ul>

                <Button
                  href="/for-business"
                  variant={p.popular ? 'primary' : 'ghost'}
                  size="md"
                  className="mt-5 w-full">
                  {p.priceMonthly === 0 ? 'Start free' : `Choose ${p.label}`}
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* per-category fee */}
      <section className="bg-[var(--color-cream-100)] py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Platform fee"
            title="What each sale costs"
            subtitle="Charged per order on top of the monthly plan. Set per category, the same for every shop in it."
          />
          <div className="mx-auto mt-10 max-w-[560px] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
            {categories.map((c, i) => (
              <div
                key={c.slug}
                className={`flex items-center justify-between px-5 py-3.5 ${
                  i > 0 ? 'border-t border-[var(--line)]' : ''
                }`}>
                <span className="text-[13.5px] font-semibold">{c.name}</span>
                <span className="tnum text-[14px] font-extrabold text-[var(--color-tangerine-600)]">
                  {feePercent(c.platformFeePercent)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--color-cream-50)] px-5 py-3.5">
              <span className="text-[12.5px] text-[var(--text-muted)]">
                Flat platform fee per order
              </span>
              <span className="tnum text-[13px] font-bold">{inr(info.fees.platformFeeInr)}</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Line({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      <span
        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${
          ok ? 'bg-[var(--color-ok)] text-white' : 'bg-[var(--color-cream-200)] text-[var(--text-muted)]'
        }`}>
        <Icon name={ok ? 'check' : 'close'} size={9} strokeWidth={3} />
      </span>
      <span
        className={`text-[12.5px] leading-snug ${
          ok ? 'text-[var(--color-ink-700)]' : 'text-[var(--text-muted)] line-through decoration-[var(--color-cream-300)]'
        }`}>
        {children}
      </span>
    </li>
  );
}
