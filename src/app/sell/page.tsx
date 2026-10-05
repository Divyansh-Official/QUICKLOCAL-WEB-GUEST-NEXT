/**
 * /sell — for a shop deciding whether to join: what a sale costs, the
 * free-delivery planner the vendor app runs, the papers to have ready, the
 * plans and boosts, and the four steps to going live.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import Planner from '@/components/sections/partners/Planner';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import { appRoles, fees, fill, fillDeep, inr, pages, plans, ui } from '@/lib/data';

const copy = fillDeep(pages.sell, { ceiling: fees.absorbCeilingPercent, floor: fees.marginFloorPercent });
const vendor = appRoles.find(r => r.key === 'vendor');

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

export default function SellPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="store" hue="butter" size={300} />}
        note={copy.hero.note}>
        <Button href={copy.hero.cta.href} size="lg" icon="arrow-right">
          {copy.hero.cta.label}
        </Button>
        <Button href={copy.hero.secondary.href} size="lg" variant="glass">
          {copy.hero.secondary.label}
        </Button>
      </PageHero>

      <section id="planner" className="tone-alt section scroll-mt-24">
        <div className="shell">
          <SectionHeader eyebrow={copy.planner.eyebrow} title={copy.planner.title} accent={copy.planner.accent} intro={copy.planner.intro} />
          <Reveal className="mx-auto mt-14 max-w-[1040px]">
            <Planner fees={fees} categories={fees.categories} copy={copy.planner} />
          </Reveal>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:self-start">
            <SectionHeader align="left" eyebrow={copy.documents.eyebrow} title={copy.documents.title} accent={copy.documents.accent} intro={copy.documents.intro} />
          </div>
          <div>
            <Reveal as="p" className="flex items-start gap-3 rounded-[22px] bg-[color-mix(in_oklab,var(--primary)_10%,transparent)] px-5 py-4 text-[14.5px] font-semibold leading-relaxed text-fg">
              <Icon name="wallet" size={19} strokeWidth={2} className="mt-0.5 flex-none text-primary-ink" />
              {copy.documents.first}
            </Reveal>
            <ul className="mt-4 grid gap-3 xs:grid-cols-2">
              {copy.documents.items.map((d, i) => (
                <Reveal as="li" key={d.label} index={i % 2} className="glass flex items-center gap-3.5 rounded-[20px] p-4">
                  <span className="icon-tile icon-tile-soft" style={{ ['--s' as string]: '40px' }}>
                    <Icon name={d.icon} size={18} strokeWidth={1.9} />
                  </span>
                  <span className="text-[15.5px] font-bold tracking-[-0.015em] text-fg">{d.label}</span>
                  <Icon name="check-circle" size={18} strokeWidth={2} className="ml-auto flex-none text-ok" />
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader eyebrow={copy.plans.eyebrow} title={copy.plans.title} accent={copy.plans.accent} />
          <ul className="mx-auto mt-14 grid max-w-[1080px] grid-cols-1 gap-4 xs:grid-cols-2 lg:grid-cols-4">
            {plans.map((p, i) => (
              <Reveal as="li" key={p.name} index={i} className="flex">
                <Tilt max={6} className={`glass hover-lift relative flex w-full flex-col rounded-[var(--radius-card)] p-6 ${p.popular ? 'ring-2 ring-primary/60' : ''}`}>
                  <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-primary-ink">{p.label}</p>
                  <p className="mt-4 flex items-baseline gap-1">
                    <span className="tnum text-[40px] font-extrabold leading-none tracking-[-0.05em] text-fg">{inr(p.priceMonthly)}</span>
                    <span className="text-[14px] font-bold text-fg-3">{ui.common.perMonth}</span>
                  </p>
                  <p className="mt-3 text-[14.5px] font-bold text-fg">{p.maxProducts < 0 ? copy.plans.unlimited : fill(copy.plans.products, { count: p.maxProducts })}</p>
                  <p className="mt-1.5 text-[14px] leading-snug text-fg-2">{p.blurb}</p>
                </Tilt>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-10 flex justify-center">
            <Button href={copy.plans.cta.href} variant="glass" icon="arrow-right">
              {copy.plans.cta.label}
            </Button>
          </Reveal>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.boosts.eyebrow} title={copy.boosts.title} accent={copy.boosts.accent} intro={copy.boosts.intro} />
          <div className="mx-auto mt-14 grid max-w-[880px] gap-4 md:grid-cols-2">
            {(['product', 'shop'] as const).map((kind, i) => (
              <Reveal key={kind} index={i} className="glass glass-raised rounded-[var(--radius-panel)] p-7">
                <p className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-[-0.02em] text-fg">
                  <span className="icon-tile" style={{ ['--s' as string]: '36px' }}>
                    <Icon name={kind === 'shop' ? 'store' : 'bolt'} size={17} strokeWidth={2} />
                  </span>
                  {copy.boosts[kind]}
                </p>
                <ul className="mt-5">
                  {copy.boosts.items[kind].map(b => (
                    <li key={b.days} className="flex items-baseline justify-between border-b border-hair py-3.5 last:border-0">
                      <span className="text-[15px] font-bold text-fg-2">{fill(copy.boosts.days, { days: b.days })}</span>
                      <span className="tnum text-[22px] font-extrabold tracking-[-0.03em] text-fg">{inr(b.price)}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {vendor ? (
        <section className="tone-alt section">
          <div className="shell">
            <SectionHeader eyebrow={copy.steps.eyebrow} title={copy.steps.title} accent={copy.steps.accent} />
            <ol className="mx-auto mt-14 grid max-w-[1080px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {vendor.steps.map((s, i) => (
                <Reveal as="li" key={s} index={i} className="glass relative flex flex-col rounded-[var(--radius-card)] p-6">
                  <span className="tnum grid h-11 w-11 place-items-center rounded-full bg-primary text-[16px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgb(240_134_38/0.9)]">{i + 1}</span>
                  <p className="mt-5 text-[16px] font-bold leading-snug tracking-[-0.015em] text-fg">{s}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      <CtaBanner {...copy.banner} />
    </>
  );
}
