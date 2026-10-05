import Reveal from '@/components/motion/Reveal';
import Accordion from '@/components/ui/Accordion';
import SectionHeader from '@/components/ui/SectionHeader';

/** Questions asked before ordering — answered only from rules the platform enforces. */
export default function FaqSection({ section, items, tone = 'tone-base' }: { section: { eyebrow: string; title: string; accent: string }; items: { q: string; a: string }[]; tone?: string }) {
  return (
    <section className={`${tone} section`}>
      <div className="shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
          <SectionHeader align="left" eyebrow={section.eyebrow} title={section.title} accent={section.accent} />
        </div>
        <Reveal>
          <Accordion items={items} group="faq" />
        </Reveal>
      </div>
    </section>
  );
}
