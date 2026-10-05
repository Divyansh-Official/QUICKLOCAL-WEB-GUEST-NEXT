/**
 * /events — events and offers as a customer meets them: an event's tab
 * sliding into the category rail, the occasions it is made for, the offers
 * shops set and the rules they follow, the always-on savings, and an event's
 * life from open to close.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import EventLife from '@/components/sections/events/EventLife';
import EventPhone from '@/components/sections/events/EventPhone';
import Occasions from '@/components/sections/events/Occasions';
import OfferTickets from '@/components/sections/events/OfferTickets';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import Tilt from '@/components/ui/Tilt';
import { fillDeep, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.events);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

function Card({ icon, title, text, index }: { icon: string; title: string; text: string; index: number }) {
  return (
    <Reveal as="li" index={index} className="flex">
      <Tilt max={5} className="group glass hover-lift flex w-full flex-col rounded-[var(--radius-card)] p-6 sm:p-7">
        <span className="icon-tile" style={{ ['--s' as string]: '46px' }}>
          <Icon name={icon} size={21} strokeWidth={1.9} effect="draw" />
        </span>
        <h3 className="mt-6 text-[18px] font-extrabold tracking-[-0.025em] text-fg">{title}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-fg-2">{text}</p>
      </Tilt>
    </Reveal>
  );
}

export default function EventsPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="calendar" hue="butter" size={300} />}>
        <Button href={copy.hero.cta.href} size="lg" iconStart="download">
          {copy.hero.cta.label}
        </Button>
        <Button href={copy.hero.secondary.href} size="lg" variant="glass">
          {copy.hero.secondary.label}
        </Button>
      </PageHero>

      <section className="tone-alt section overflow-clip">
        <div className="shell grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <SectionHeader align="left" eyebrow={copy.rail.eyebrow} title={copy.rail.title} accent={copy.rail.accent} />
            <ul className="mt-10 space-y-6">
              {copy.rail.points.map((p, i) => (
                <Reveal as="li" key={p.title} index={i} className="flex gap-4">
                  <span className="icon-tile flex-none" style={{ ['--s' as string]: '44px' }}>
                    <Icon name={p.icon} size={20} strokeWidth={1.9} />
                  </span>
                  <span>
                    <span className="t-headline block">{p.title}</span>
                    <span className="t-small mt-1 block max-w-md">{p.text}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal className="flex justify-center">
            <EventPhone screen={copy.rail.screen} />
          </Reveal>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.occasions.eyebrow} title={copy.occasions.title} accent={copy.occasions.accent} intro={copy.occasions.intro} />
          <div className="mt-14">
            <Occasions items={copy.occasions.items} />
          </div>
        </div>
      </section>

      <section id="offers" className="tone-alt section scroll-mt-24">
        <div className="shell">
          <SectionHeader eyebrow={copy.offers.eyebrow} title={copy.offers.title} accent={copy.offers.accent} intro={copy.offers.intro} />
          <div className="mx-auto mt-14 max-w-[1120px]">
            <OfferTickets items={copy.offers.tickets} note={copy.offers.ticketNote} />
          </div>
          <ul className="mx-auto mt-10 grid max-w-[1120px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.offers.rules.map((r, i) => (
              <Card key={r.title} index={i} {...r} />
            ))}
          </ul>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.life.eyebrow} title={copy.life.title} accent={copy.life.accent} />
          <div className="mx-auto mt-14 max-w-[1000px]">
            <EventLife steps={copy.life.steps} />
          </div>
        </div>
      </section>

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader eyebrow={copy.more.eyebrow} title={copy.more.title} accent={copy.more.accent} />
          <ul className="mx-auto mt-14 grid max-w-[1080px] gap-4 md:grid-cols-3">
            {copy.more.items.map((m, i) => (
              <Card key={m.title} index={i} {...m} />
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner {...copy.banner} />
    </>
  );
}
