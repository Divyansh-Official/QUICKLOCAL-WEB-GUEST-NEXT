/**
 * /deliver — for a rider deciding whether to join: what a delivery pays (the
 * whole delivery fee, on a slider), the papers for the vehicle they ride, the
 * tiers, and the rules that protect their time.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import { TierGrid } from '@/components/sections/home/RiderTiers';
import VehiclePicker from '@/components/sections/partners/VehiclePicker';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import FactGrid from '@/components/sections/shared/FactGrid';
import PageHero from '@/components/sections/shared/PageHero';
import RiderCalc from '@/components/sections/shared/RiderCalc';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import { deliveryRules, fillDeep, pages, riders, ui } from '@/lib/data';

const copy = fillDeep(pages.deliver);
const earnings = fillDeep(pages.forBusiness.earnings);
const docs = fillDeep(riders.documents);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

export default function DeliverPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="bike" hue="ink" size={300} />}>
        <Button href={copy.hero.cta.href} size="lg" icon="arrow-right">
          {copy.hero.cta.label}
        </Button>
        <Button href={copy.hero.secondary.href} size="lg" variant="glass">
          {copy.hero.secondary.label}
        </Button>
      </PageHero>

      <section id="earnings" className="tone-alt section scroll-mt-24">
        <div className="shell">
          <SectionHeader eyebrow={copy.earnings.eyebrow} title={copy.earnings.title} accent={copy.earnings.accent} intro={copy.earnings.intro} />
          <div className="mx-auto mt-14 max-w-[980px]">
            <FactGrid items={earnings.items} cols={3} />
          </div>
          <Reveal className="mt-6">
            <RiderCalc fees={deliveryRules} labels={{ title: copy.earnings.calcTitle, distance: copy.earnings.calcLabel, result: copy.earnings.calcResult, legend: earnings.legend }} />
          </Reveal>
          <Reveal as="p" className="t-small mx-auto mt-6 max-w-xl text-center">
            {earnings.example}
          </Reveal>
        </div>
      </section>

      <section id="documents" className="tone-base section scroll-mt-24">
        <div className="shell">
          <SectionHeader eyebrow={copy.vehicles.eyebrow} title={copy.vehicles.title} accent={copy.vehicles.accent} intro={copy.vehicles.intro} />
          <Reveal className="mt-14">
            <VehiclePicker vehicles={riders.vehicles} everyone={docs.everyone} motorised={docs.motorised} copy={copy.vehicles} />
          </Reveal>
        </div>
      </section>

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader eyebrow={copy.tiers.eyebrow} title={copy.tiers.title} accent={copy.tiers.accent} intro={copy.tiers.intro} />
          <div className="mt-14">
            <TierGrid tiers={riders.tiers} labels={{ deliveries: copy.tiers.deliveries, rating: copy.tiers.rating }} />
          </div>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.rules.eyebrow} title={copy.rules.title} accent={copy.rules.accent} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.rules.items.map((r, i) => (
              <Reveal as="li" key={r.title} index={i % 3} className="flex">
                <Tilt max={5} className="group glass hover-lift flex w-full flex-col rounded-[var(--radius-card)] p-6 sm:p-7">
                  <span className="icon-tile" style={{ ['--s' as string]: '46px' }}>
                    <Icon name={r.icon} size={21} strokeWidth={1.9} effect="draw" />
                  </span>
                  <h3 className="mt-6 text-[18px] font-extrabold tracking-[-0.025em] text-fg">{r.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-2">{r.text}</p>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner {...copy.banner} />
    </>
  );
}
