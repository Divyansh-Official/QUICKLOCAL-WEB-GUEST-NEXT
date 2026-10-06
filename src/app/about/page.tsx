/**
 * /about — PageHero → story beside "where we operate" → Statement →
 * principles → CtaBanner. Modest about scale on purpose: the platform is
 * early, and a page claiming momentum it does not have loses the vendor who
 * then opens the app and finds four shops.
 */
import type { Metadata } from 'next';
import Link from 'next/link';
import Trio from '@/components/art/Trio';
import Reveal from '@/components/motion/Reveal';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import Statement from '@/components/sections/shared/Statement';
import AccentText from '@/components/ui/AccentText';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Tilt from '@/components/ui/Tilt';
import { about, categories, contact, fillDeep, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.about);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

export default function AboutPage() {
  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={<Trio className="max-w-[400px]" />}
      />

      <section className="tone-alt section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal>
            <p className="t-eyebrow">{copy.story.eyebrow}</p>
            <h2 className="t-display mt-4">
              <AccentText text={copy.story.title} accent={copy.story.accent} />
            </h2>
            <div className="mt-8 space-y-5">
              {about.paragraphs.map((p, i) => (
                <p key={p} className={i === 0 ? 'text-[clamp(18px,1rem+0.45vw,21px)] font-semibold leading-[1.5] tracking-[-0.016em] text-fg' : 't-body'}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal index={1} className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
            <div className="glass glass-raised rounded-[var(--radius-panel)] p-7 sm:p-8">
              <h3 className="t-headline">{copy.where.title}</h3>
              <p className="t-small mt-2">{copy.where.text}</p>
              <div className="mt-6 flex items-center gap-4 rounded-[22px] bg-[color-mix(in_oklab,var(--card)_70%,transparent)] p-4 shadow-[var(--rim),var(--edge)]">
                <span className="icon-tile ping relative" style={{ ['--s' as string]: '50px' }}>
                  <Icon name="pin" size={24} strokeWidth={1.9} />
                </span>
                <span>
                  <span className="block text-[18px] font-extrabold tracking-[-0.025em] text-fg">
                    {contact.city}, {contact.state}
                  </span>
                  <span className="block text-[13.5px] text-fg-3">{copy.where.detail}</span>
                </span>
              </div>
              <h4 className="mt-7 text-[13px] font-extrabold uppercase tracking-[0.12em] text-fg-3">{copy.where.categoriesTitle}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categories.map(c => (
                  <li key={c.slug}>
                    <Link href={`/services/${c.slug}`} className="chip min-h-9 px-3.5 hover:text-fg">
                      <Icon name={c.icon} size={14} />
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <Statement {...copy.statement} />

      <section className="tone-alt section">
        <div className="shell">
          <SectionHeader eyebrow={copy.principles.eyebrow} title={copy.principles.title} accent={copy.principles.accent} intro={copy.principles.intro} />
          <ul className="m-rail mt-14 grid gap-4 sm:grid-cols-2">
            {copy.principles.items.map((p, i) => (
              <Reveal as="li" key={p.title} index={i % 2} className="flex">
                <Tilt max={5} className="group glass hover-lift relative flex w-full gap-5 rounded-[var(--radius-card)] p-7">
                  <span className="icon-tile" style={{ ['--s' as string]: '52px' }}>
                    <Icon name={p.icon} size={24} strokeWidth={1.9} effect="bounce" />
                  </span>
                  <span>
                    <h3 className="t-headline">{p.title}</h3>
                    <p className="t-small mt-2">{p.text}</p>
                  </span>
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
