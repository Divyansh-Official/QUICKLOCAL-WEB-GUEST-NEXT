/**
 * /services/[slug] — the page a category card zooms open into.
 *
 * Opening: night, warm light, the category's 3D slab, its name, promise and
 * fee, with the glass Back control that shrinks the page back into its card.
 * Then what shops in the aisle list, the numbers that apply to it, what a shop
 * keeps on a ₹1,000 sale, and the other aisles.
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Enter from '@/components/motion/Enter';
import MorphBack from '@/components/motion/MorphBack';
import Reveal from '@/components/motion/Reveal';
import { CategoryCard } from '@/components/sections/home/CategoryShelf';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import FactGrid from '@/components/sections/shared/FactGrid';
import { Breadcrumbs } from '@/components/sections/shared/PageHero';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Shelf from '@/components/ui/Shelf';
import Slab3D from '@/components/ui/Slab3D';
import { categories, feePercent, fillDeep, getCategory, info, inr, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.services);

export function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return { title: `${c.name} — ${copy.meta.title}`, description: `${c.tagline} ${c.blurb}. ${feePercent(c.platformFeePercent)} ${ui.common.platformFee}.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const d = copy.detail;
  const fee = feePercent(c.platformFeePercent);
  const keeps = 1000 - Math.round((1000 * c.platformFeePercent) / 100);
  const facts = d.facts.map(f => ({
    icon: f.icon,
    label: f.label,
    value: { fee, minFee: inr(info.delivery.minFeeInr), radius: `${info.delivery.defaultRadiusKm} km`, hours: `${info.delivery.maxHours} hrs` }[f.key] ?? '',
  }));
  const related = categories.filter(x => x.slug !== c.slug);

  return (
    <>
      <section className="tone-night">
        <div data-morph-target className="detail-hero">
          <Aurora variant="night" />
          <div className="shell relative pt-[calc(var(--header-h)+16px)]">
            <MorphBack href="/services" label={ui.common.back} />
          </div>
          <div className="detail-hero-body shell relative my-auto grid items-center gap-8 pt-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10">
            <div className="relative flex justify-center lg:order-2">
              <span aria-hidden="true" className="orbits [--o:clamp(300px,60vw,560px)]">
                <span style={{ ['--k' as string]: 0 }} />
                <span style={{ ['--k' as string]: 1 }} />
                <span style={{ ['--k' as string]: 2 }} />
                <b className="ping" style={{ left: '15%', top: '28%' }} />
                <b className="ping" style={{ left: '86%', top: '62%', ['--delay' as string]: '-1.2s' }} />
                <b className="ping" style={{ left: '40%', top: '92%', ['--delay' as string]: '-2s' }} />
              </span>
              <Enter delay={160} effect="scale" className="group relative">
                <Slab3D icon={c.icon} hue={c.hue} size={300} active />
              </Enter>
            </div>
            <div data-vanish className="min-w-0 lg:order-1" style={{ ['--vanish' as string]: '70vh' }}>
              <Enter delay={0} className="hidden sm:block">
                <Breadcrumbs crumbs={[{ label: copy.meta.title, href: '/services' }, { label: c.name }]} home={ui.common.home} label={ui.common.breadcrumb} />
              </Enter>
              <Enter as="p" delay={60} className="t-eyebrow sm:mt-7">
                {d.eyebrow}
              </Enter>
              <Enter as="h1" delay={110} effect="blur" className="t-hero mt-4 text-[clamp(3rem,1.6rem+6vw,6.5rem)]">
                {c.name}
              </Enter>
              <Enter as="p" delay={170} className="t-lead mt-5 max-w-xl text-[clamp(1.2rem,1rem+0.8vw,1.6rem)] font-semibold text-fg">
                {c.tagline}
              </Enter>
              <Enter as="p" delay={210} className="t-body mt-2 max-w-xl">
                {c.blurb}.
              </Enter>
              <Enter delay={260} className="mt-8 flex flex-wrap gap-2.5">
                <span className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-bold text-fg">
                  <Icon name="tag" size={16} className="text-[#f7b16d]" />
                  {fee} {ui.common.platformFee}
                </span>
                <span className="glass inline-flex h-10 items-center gap-2 rounded-full px-4 text-[14px] font-bold text-fg">
                  <Icon name="wallet" size={16} className="text-[#f7b16d]" />
                  {d.deliveryLabel} {inr(info.delivery.minFeeInr)}
                </span>
              </Enter>
            </div>
          </div>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <h2 className="t-title">{d.examplesTitle}</h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {c.examples.map((e, i) => (
                <li key={e} className="glass enter flex items-center gap-3.5 rounded-[20px] p-4" style={{ ['--d' as string]: i * 60 }}>
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-primary-soft text-primary-ink">
                    <Icon name="check" size={16} strokeWidth={2.4} />
                  </span>
                  <span className="text-[16px] font-bold tracking-[-0.015em] text-fg">{e}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal index={1} className="glass glass-raised stat-box flex flex-col rounded-[var(--radius-panel)] p-7 sm:p-9">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-fg-3">{d.keepTitle}</p>
            <p className="t-stat text-gradient mt-4 text-[clamp(3rem,2rem+4vw,5rem)]">{inr(keeps)}</p>
            <p className="t-small mt-3">{d.keepNote}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={d.costCta.href} iconStart="calculator">
                {d.costCta.label}
              </Button>
              <Button href={d.sellCta.href} variant="glass" icon="arrow-right">
                {d.sellCta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader align="left" title={d.factsTitle} size="title" />
          <div className="mt-10">
            <FactGrid items={facts} />
          </div>
        </div>
      </section>

      <section className="tone-base section overflow-clip pb-8">
        <div className="shell">
          <SectionHeader align="left" title={d.relatedTitle} size="title" />
        </div>
        <Shelf className="mt-6" label={d.relatedTitle} itemWidth="clamp(268px, 74vw, 310px)" labels={{ previous: ui.common.previous, next: ui.common.next }}>
          {related.map(r => (
            <CategoryCard key={r.slug} c={{ slug: r.slug, name: r.name, icon: r.icon, hue: r.hue, tagline: r.tagline, fee: feePercent(r.platformFeePercent) }} feeLabel={ui.common.platformFee} />
          ))}
        </Shelf>
      </section>

      <CtaBanner {...copy.referral} />
    </>
  );
}
