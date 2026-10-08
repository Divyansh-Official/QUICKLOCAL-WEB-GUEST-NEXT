/**
 * /app — a tour of the customer app: eight screens in the scroll story
 * (the same sticky handset as How It Works), the message an order sends at
 * each step, and how ratings work.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import Journey from '@/components/sections/how/Journey';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import MessageStack from '@/components/sections/shared/MessageStack';
import PageHero from '@/components/sections/shared/PageHero';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import { fillDeep, info, pages, ui } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';

const copy = fillDeep(pages.app);

export const metadata: Metadata = pageMetadata(copy.meta, '/app');

export default function AppPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="smartphone" hue="tangerine" size={300} />}
      />

      <section className="tone-base pb-[var(--section-y)]">
        <div className="shell">
          <SectionHeader eyebrow={copy.tour.eyebrow} title={copy.tour.title} accent={copy.tour.accent} />
          <div className="mt-12 lg:mt-4">
            <Journey steps={copy.tour.steps} progress={copy.tour.progress} />
          </div>
        </div>
      </section>

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader eyebrow={copy.messages.eyebrow} title={copy.messages.title} accent={copy.messages.accent} intro={copy.messages.intro} />
          <div className="mt-14">
            <MessageStack items={copy.messages.items} now={copy.messages.now} brand={info.name} />
          </div>
          <Reveal as="p" className="t-small mx-auto mt-8 max-w-md text-center">
            {copy.messages.more}
          </Reveal>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.reviews.eyebrow} title={copy.reviews.title} accent={copy.reviews.accent} />
          <ul className="m-rail mx-auto mt-14 grid max-w-[1080px] gap-4 md:grid-cols-3">
            {copy.reviews.items.map((r, i) => (
              <Reveal as="li" key={r.title} index={i} className="glass hover-lift flex flex-col rounded-[var(--radius-card)] p-6 sm:p-7">
                <span className="icon-tile" style={{ ['--s' as string]: '46px' }}>
                  <Icon name={r.icon} size={21} strokeWidth={1.9} effect="draw" />
                </span>
                <h3 className="mt-6 text-[18px] font-extrabold tracking-[-0.025em] text-fg">{r.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-2">{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner {...copy.banner} />
    </>
  );
}
