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
import { categories, feePercent, fillDeep, pages, ui } from '@/lib/data';

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
        <ul className="shell grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal as="li" key={c.slug} id={c.slug} index={i % 3} className="scroll-mt-28">
              <CategoryCard c={{ slug: c.slug, name: c.name, icon: c.icon, hue: c.hue, tagline: c.tagline, fee: feePercent(c.platformFeePercent) }} feeLabel={ui.common.platformFee} />
            </Reveal>
          ))}
        </ul>
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
