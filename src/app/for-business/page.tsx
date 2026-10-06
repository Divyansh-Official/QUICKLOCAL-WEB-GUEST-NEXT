/**
 * /for-business — the two partner tracks, each with its numbers up front,
 * then what a delivery pays, on a slider.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import FactGrid from '@/components/sections/shared/FactGrid';
import PageHero from '@/components/sections/shared/PageHero';
import RiderCalc from '@/components/sections/shared/RiderCalc';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import { deliveryRules, features, fillDeep, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.forBusiness);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

function Track({ id, icon, hue, title, text, items, cta, secondary }: { id: string; icon: string; hue: string; title: string; text: string; items: string[]; cta: { label: string; href: string }; secondary?: { label: string; href: string } }) {
  return (
    <Tilt max={4} className="group glass glass-raised relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-panel)] p-7 sm:p-9">
      <span id={id} className="absolute -top-28" />
      <div className="flex items-start justify-between gap-4">
        <h2 className="t-title max-w-[14ch]">{title}</h2>
        <Slab3D icon={icon} hue={hue} size={120} className="-mr-3 -mt-4 flex-none" />
      </div>
      <p className="t-body mt-3">{text}</p>
      <ul className="mt-7 flex-1 space-y-3">
        {items.map(f => (
          <li key={f} className="flex items-start gap-3">
            <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-ok text-white">
              <Icon name="check" size={13} strokeWidth={2.8} />
            </span>
            <span className="text-[15.5px] leading-snug text-fg">{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={cta.href} icon="arrow-right">
          {cta.label}
        </Button>
        {secondary ? (
          <Button href={secondary.href} variant="glass">
            {secondary.label}
          </Button>
        ) : null}
      </div>
    </Tilt>
  );
}

export default function ForBusinessPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="store" hue="butter" size={300} />}
      />

      <section className="tone-base pb-[var(--section-y)]">
        <div className="shell m-rail m-rail-wide grid gap-5 lg:grid-cols-2">
          <Reveal className="flex">
            <Track id="vendors" icon="store" hue="butter" title={copy.vendors.title} text={copy.vendors.text} items={features.vendors} cta={copy.vendors.cta} secondary={copy.vendors.secondary} />
          </Reveal>
          <Reveal index={1} className="flex">
            <Track id="partners" icon="bike" hue="ink" title={copy.partners.title} text={copy.partners.text} items={features.partners} cta={copy.partners.cta} />
          </Reveal>
        </div>
      </section>

      <section id="earnings" className="tone-alt section scroll-mt-24">
        <div className="shell">
          <SectionHeader eyebrow={copy.earnings.eyebrow} title={copy.earnings.title} accent={copy.earnings.accent} intro={copy.earnings.intro} />
          <div className="mx-auto mt-14 max-w-[980px]">
            <FactGrid items={copy.earnings.items} cols={3} />
          </div>
          <Reveal className="mt-6">
            <RiderCalc fees={deliveryRules} labels={{ title: copy.earnings.calcTitle, distance: copy.earnings.calcLabel, result: copy.earnings.calcResult, legend: copy.earnings.legend }} />
          </Reveal>
          <Reveal as="p" className="t-small mx-auto mt-6 max-w-xl text-center">
            {copy.earnings.example}
          </Reveal>
        </div>
      </section>
    </>
  );
}
