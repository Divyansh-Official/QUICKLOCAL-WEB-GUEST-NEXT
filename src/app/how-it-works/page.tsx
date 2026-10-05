/**
 * /how-it-works — one order, end to end: the scroll story with the handset
 * changing scene beside it, every state an order can be in, the four clocks
 * that run on every order, and the estimator one tap away.
 */
import type { Metadata } from 'next';
import Journey from '@/components/sections/how/Journey';
import OrderLifecycle from '@/components/sections/home/OrderLifecycle';
import Clocks from '@/components/sections/shared/Clocks';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import SectionHeader from '@/components/ui/SectionHeader';
import { fillDeep, lifecycle, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.howItWorks);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

export default function HowItWorksPage() {
  return (
    <>
      <PageHero {...copy.hero} crumbs={[{ label: copy.meta.title }]} labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }} />

      <section className="tone-base pb-[var(--section-y)]">
        <div className="shell">
          <SectionHeader eyebrow={copy.journey.eyebrow} title={copy.journey.title} accent={copy.journey.accent} />
          <div className="mt-12 lg:mt-4">
            <Journey steps={copy.journey.steps} progress={copy.journey.progress} />
          </div>
        </div>
      </section>

      <OrderLifecycle section={copy.lifecycle} happy={lifecycle.happy} unhappy={lifecycle.unhappy} />

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.clocks.eyebrow} title={copy.clocks.title} accent={copy.clocks.accent} intro={copy.clocks.intro} />
          <div className="mt-14">
            <Clocks items={copy.clocks.items} />
          </div>
        </div>
      </section>

      <CtaBanner {...copy.banner} />
    </>
  );
}
