/**
 * /help — the Help Centre: every question the site answers, searchable and
 * filterable by who is asking, with a person one tap away. The questions
 * also go out as FAQPage structured data.
 */
import type { Metadata } from 'next';
import JsonLd from '@/components/layout/JsonLd';
import Reveal from '@/components/motion/Reveal';
import HelpCentre from '@/components/sections/help/HelpCentre';
import PageHero from '@/components/sections/shared/PageHero';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { faqAll, faqAudiences, fillDeep, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.help);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

export default function HelpPage() {
  return (
    <>
      <JsonLd
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqAll.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
        }}
      />
      <PageHero {...copy.hero} crumbs={[{ label: copy.meta.title }]} labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }} />

      <section className="tone-base pb-[var(--section-y)]">
        <div className="shell">
          <HelpCentre items={faqAll} audiences={faqAudiences} copy={copy.search} />

          <Reveal className="mx-auto mt-16 max-w-[920px]">
            <div className="tone-night relative flex flex-col items-start gap-6 overflow-hidden rounded-[var(--radius-panel)] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div className="flex items-start gap-4">
                <span className="icon-tile flex-none" style={{ ['--s' as string]: '48px' }}>
                  <Icon name="headset" size={22} strokeWidth={1.9} />
                </span>
                <span>
                  <span className="t-headline block">{copy.contact.title}</span>
                  <span className="t-small mt-1.5 block max-w-md">{copy.contact.text}</span>
                </span>
              </div>
              <Button href={copy.contact.cta.href} icon="arrow-right" className="flex-none">
                {copy.contact.cta.label}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
