/**
 * /pricing — every figure is a column value from subscription_plans; nothing
 * rounded, no tier invented. Four plan cards (the popular one lifted and lit),
 * and a full comparison.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import PageHero from '@/components/sections/shared/PageHero';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import { featureLabels, fill, fillDeep, inr, pages, plans, ui } from '@/lib/data';
import RailDots from '@/components/ui/RailDots';
import { pageMetadata } from '@/lib/seo';

const copy = fillDeep(pages.pricing);
const ORDER = ['sales_dashboard', 'export_orders', 'customer_history', 'priority_support', 'advanced_analytics', 'featured_badge', 'bulk_offers', 'custom_banner'];

export const metadata: Metadata = pageMetadata(copy.meta, '/pricing');

const products = (max: number) => (max < 0 ? copy.unlimited : String(max));
const boosts = (n: number) => (n <= 0 ? copy.noBoosts : fill(n === 1 ? copy.boosts : copy.boostsPlural, { count: n }));
const supportType = (v: unknown) => (typeof v === 'string' ? ` (${v.replace(/_/g, ' ')})` : '');

function Mark({ ok }: { ok: boolean }) {
  return (
    <span className={`grid h-6 w-6 flex-none place-items-center rounded-full ${ok ? 'bg-ok text-white' : 'bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] text-fg-3'}`}>
      <Icon name={ok ? 'check' : 'close'} size={12} strokeWidth={2.8} />
    </span>
  );
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="tag" hue="tangerine" size={300} />}
      />

      <section className="tone-base pb-[var(--section-y)]">
        <ul className="shell m-rail grid gap-5 pt-4 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((p, i) => (
            <Reveal as="li" key={p.name} index={i % 4} className="flex">
              <Tilt
                max={5}
                className={`glass hover-lift relative flex w-full flex-col rounded-[var(--radius-card)] p-7 ${
                  p.popular ? 'glass-raised shadow-[var(--rim),0_0_0_2px_var(--primary),0_30px_60px_-24px_color-mix(in_oklab,var(--primary)_55%,transparent)]' : ''
                }`}>
                {p.popular ? (
                  <span className="shimmer absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white shadow-[0_8px_18px_-8px_rgb(240_134_38/0.9)]">
                    {copy.popular}
                  </span>
                ) : null}
                <h2 className={`text-[22px] font-extrabold tracking-[-0.03em] ${p.popular ? 'text-primary-ink' : 'text-fg'}`}>{p.label}</h2>
                <p className="t-small mt-1.5 sm:min-h-[3.1em]">{p.blurb}</p>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="tnum text-[36px] font-extrabold sm:text-[48px] leading-none tracking-[-0.05em] text-fg">{inr(p.priceMonthly)}</span>
                  <span className="text-[14px] font-semibold text-fg-3">{ui.common.perMonth}</span>
                </p>
                <p className="mt-2 text-[12.5px] font-semibold text-fg-3">{p.priceMonthly === 0 ? copy.freeNote : copy.billedNote}</p>
                <ul className="mt-6 flex-1 space-y-2 border-t border-hair pt-4 sm:space-y-2.5 sm:pt-6">
                  <li className="flex items-start gap-2.5 text-[14.5px] text-fg">
                    <Mark ok />
                    {copy.products}: {products(p.maxProducts)}
                  </li>
                  <li className={`flex items-start gap-2.5 text-[14.5px] ${p.boostsPerMonth > 0 ? 'text-fg' : 'text-fg-3 max-sm:hidden'}`}>
                    <Mark ok={p.boostsPerMonth > 0} />
                    {boosts(p.boostsPerMonth)}
                  </li>
                  {ORDER.map(key => {
                    const ok = Boolean(p.features[key]);
                    return (
                      <li key={key} className={`flex items-start gap-2.5 text-[14.5px] ${ok ? 'text-fg' : 'text-fg-3 max-sm:hidden'}`}>
                        <Mark ok={ok} />
                        <span>
                          {featureLabels[key]}
                          {key === 'priority_support' && ok ? supportType(p.features.priority_type) : ''}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-7">
                  <Button href="/get-the-app#vendor" variant={p.popular ? 'primary' : 'glass'} block>
                    {p.priceMonthly === 0 ? copy.startFree : fill(copy.choose, { plan: p.label })}
                  </Button>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </ul>
        <RailDots count={plans.length} />
      </section>

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader title={copy.compareTitle} size="title" />
          <Reveal className="glass glass-raised mt-10 overflow-x-auto rounded-[var(--radius-panel)]">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hair">
                  <th scope="col" className="px-6 py-5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-fg-3">
                    {copy.compareFeature}
                  </th>
                  {plans.map(p => (
                    <th key={p.name} scope="col" className={`px-4 py-5 text-center text-[15px] font-extrabold ${p.popular ? 'text-primary-ink' : 'text-fg'}`}>
                      {p.label}
                      <span className="block text-[12.5px] font-semibold text-fg-3">{`${inr(p.priceMonthly)}${ui.common.perMonth}`}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-hair">
                  <th scope="row" className="px-6 py-4 text-[14.5px] font-semibold text-fg">{copy.products}</th>
                  {plans.map(p => (
                    <td key={p.name} className="tnum px-4 py-4 text-center text-[14.5px] font-bold text-fg">{products(p.maxProducts)}</td>
                  ))}
                </tr>
                <tr className="border-b border-hair">
                  <th scope="row" className="px-6 py-4 text-[14.5px] font-semibold text-fg">{copy.boostsRow}</th>
                  {plans.map(p => (
                    <td key={p.name} className="tnum px-4 py-4 text-center text-[14.5px] font-bold text-fg">{p.boostsPerMonth}</td>
                  ))}
                </tr>
                {ORDER.map(key => (
                  <tr key={key} className="border-b border-hair last:border-0">
                      <th scope="row" className="px-6 py-4 text-[14.5px] font-semibold text-fg">{featureLabels[key]}</th>
                      {plans.map(p => (
                        <td key={p.name} className="px-4 py-4">
                          <span className="flex justify-center">
                            <Mark ok={Boolean(p.features[key])} />
                          </span>
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </section>

    </>
  );
}
