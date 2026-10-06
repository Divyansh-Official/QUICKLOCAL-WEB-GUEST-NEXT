/**
 * /services — PageHero → every category as a card that zooms open into its
 * page → how delivery works → refer a friend. The old #slug anchors still
 * resolve: each card carries its category's id.
 */
import type { Metadata } from 'next';
import Slab3D from '@/components/ui/Slab3D';
import Reveal from '@/components/motion/Reveal';
import { CategoryCard } from '@/components/sections/home/CategoryShelf';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import FactGrid from '@/components/sections/shared/FactGrid';
import PageHero from '@/components/sections/shared/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';
import { categories, fill, fillDeep, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.services);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

export default function ServicesPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="basket" hue="tangerine" size={300} />}
      />

      <section className="tone-base pb-[var(--section-y)]">
        <ul className="shell grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.slug} id={c.slug} index={i % 3} className="scroll-mt-28">
              <CategoryCard c={{ slug: c.slug, name: c.name, icon: c.icon, hue: c.hue, tagline: c.tagline, badge: fill(ui.common.deliveryFrom), examples: c.examples }} />
            </Reveal>
          ))}
        </ul>
        <div className="shell mt-5">
          <Reveal className="glass glass-raised flex flex-col items-start gap-6 rounded-[var(--radius-panel)] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="flex items-start gap-5">
              <span className="group hidden flex-none sm:block">
                <Slab3D icon="calendar" hue="butter" size={96} />
              </span>
              <span>
                <span className="t-title block text-[clamp(1.4rem,1.1rem+1vw,1.9rem)]">
                  <AccentText text={copy.events.title} accent={copy.events.accent} />
                </span>
                <span className="t-small mt-2 block max-w-xl">{copy.events.text}</span>
              </span>
            </div>
            <Button href={copy.events.cta.href} icon="arrow-right" className="flex-none">
              {copy.events.cta.label}
            </Button>
          </Reveal>
        </div>
      </section>

      <section id="delivery" className="tone-alt section scroll-mt-24">
        <div className="shell">
          <SectionHeader eyebrow={copy.delivery.eyebrow} title={copy.delivery.title} accent={copy.delivery.accent} intro={copy.delivery.intro} />
          <div className="mt-14">
            <FactGrid items={copy.delivery.items} />
          </div>
        </div>
      </section>

      <div id="referral" className="scroll-mt-24">
        <CtaBanner {...copy.referral} />
      </div>
    </>
  );
}
