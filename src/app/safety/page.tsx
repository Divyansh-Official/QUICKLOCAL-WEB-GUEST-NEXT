/**
 * /safety — every guarantee the platform makes, each one a rule in code:
 * verification, the codes at both ends, money that waits for the order, the
 * clocks on every stuck state, and the checks nobody sees.
 */
import type { Metadata } from 'next';
import Reveal from '@/components/motion/Reveal';
import Pillars from '@/components/sections/safety/Pillars';
import Clocks from '@/components/sections/shared/Clocks';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Slab3D from '@/components/ui/Slab3D';
import { fillDeep, pages, ui } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';

const copy = fillDeep(pages.safety);
const clocks = fillDeep(pages.howItWorks.clocks);

export const metadata: Metadata = pageMetadata(copy.meta, '/safety');

export default function SafetyPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Slab3D icon="shield-check" hue="green" size={300} />}
      />

      <section className="tone-base pb-[var(--section-y)]">
        <div className="shell">
          <Pillars items={copy.pillars} />
        </div>
      </section>

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader eyebrow={copy.clocks.eyebrow} title={copy.clocks.title} accent={copy.clocks.accent} intro={copy.clocks.intro} />
          <div className="mt-14">
            <Clocks items={clocks.items} />
          </div>
        </div>
      </section>

      <section className="tone-base section">
        <div className="shell">
          <SectionHeader eyebrow={copy.more.eyebrow} title={copy.more.title} accent={copy.more.accent} />
          <ul className="m-rail mx-auto mt-14 grid max-w-[1080px] gap-4 sm:grid-cols-2">
            {copy.more.items.map((m, i) => (
              <Reveal as="li" key={m.title} index={i % 2} className="glass hover-lift flex gap-5 rounded-[var(--radius-card)] p-6 sm:p-7">
                <span className="icon-tile flex-none" style={{ ['--s' as string]: '46px' }}>
                  <Icon name={m.icon} size={21} strokeWidth={1.9} effect="draw" />
                </span>
                <span>
                  <h3 className="text-[18px] font-extrabold tracking-[-0.025em] text-fg">{m.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-fg-2">{m.text}</p>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner {...copy.banner} />
    </>
  );
}
