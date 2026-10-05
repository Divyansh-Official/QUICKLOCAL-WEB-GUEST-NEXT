/**
 * /pricing — every figure is a column value from subscription_plans; nothing
 * rounded, no tier invented. Four plan cards (the popular one lifted and lit),
 * a full comparison, and the per-category platform fee.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import PageHero from '@/components/sections/shared/PageHero';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import { categories, featureLabels, feePercent, fill, fillDeep, info, inr, pages, plans, ui } from '@/lib/data';

const copy = fillDeep(pages.pricing);
const ORDER = ['sales_dashboard', 'export_orders', 'customer_history', 'priority_support', 'advanced_analytics', 'featured_badge', 'bulk_offers', 'custom_banner'];

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

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
        <ul className="shell grid gap-5 pt-4 md:grid-cols-2 xl:grid-cols-4">
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
                <h2 className="text-[13px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">{p.label}</h2>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="tnum text-[46px] font-extrabold leading-none tracking-[-0.05em] text-fg">{p.priceMonthly === 0 ? ui.common.free : inr(p.priceMonthly)}</span>
                  {p.priceMonthly > 0 ? <span className="text-[14px] font-semibold text-fg-3">{ui.common.perMonth}</span> : null}
                </p>
                <p className="t-small mt-3 min-h-[3em]">{p.blurb}</p>
                <ul className="mt-6 flex-1 space-y-2.5 border-t border-hair pt-6">
                  <li className="flex items-start gap-2.5 text-[14.5px] text-fg">
                    <Mark ok />
                    {copy.products}: {products(p.maxProducts)}
                  </li>
                  <li className={`flex items-start gap-2.5 text-[14.5px] ${p.boostsPerMonth > 0 ? 'text-fg' : 'text-fg-3'}`}>
                    <Mark ok={p.boostsPerMonth > 0} />
                    {boosts(p.boostsPerMonth)}
                  </li>
                  {ORDER.map(key => {
                    const ok = Boolean(p.features[key]);
                    return (
                      <li key={key} className={`flex items-start gap-2.5 text-[14.5px] ${ok ? 'text-fg' : 'text-fg-3'}`}>
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
                      <span className="block text-[12.5px] font-semibold text-fg-3">{p.priceMonthly === 0 ? ui.common.free : `${inr(p.priceMonthly)}${ui.common.perMonth}`}</span>
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

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.fee.eyebrow} title={copy.fee.title} accent={copy.fee.accent} intro={copy.fee.intro} />
          <Reveal className="glass glass-raised mx-auto mt-12 max-w-[640px] overflow-hidden rounded-[var(--radius-panel)]">
            <ul>
              {categories.map(c => (
                <li key={c.slug} className="flex items-center justify-between gap-4 border-b border-hair px-6 py-4">
                  <span className="flex items-center gap-3 text-[16px] font-bold text-fg">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary-ink">
                      <Icon name={c.icon} size={17} strokeWidth={1.9} />
                    </span>
                    {c.name}
                  </span>
                  <span className="relative flex flex-1 items-center justify-end gap-4">
                    <span className="hidden h-2 max-w-[160px] flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] xs:block">
                      <span className="block h-full rounded-full bg-gradient-to-r from-[#de7314] to-[#f2a53c]" style={{ width: `${(c.platformFeePercent / 3) * 100}%` }} />
                    </span>
                    <span className="tnum w-12 text-right text-[18px] font-extrabold text-primary-ink">{feePercent(c.platformFeePercent)}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between gap-4 bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] px-6 py-4">
              <span className="text-[14px] font-semibold text-fg-2">{copy.fee.flat}</span>
              <span className="tnum text-[16px] font-extrabold text-fg">{inr(info.fees.platformFeeInr)}</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
