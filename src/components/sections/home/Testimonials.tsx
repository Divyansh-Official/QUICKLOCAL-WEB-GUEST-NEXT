import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';

/**
 * Renders NOTHING while there are no reviews. Inventing an endorsement
 * attributed to a named person is the one thing a testimonial cannot be; the
 * section appears by itself the day testimonials.json has an entry.
 */
export default function Testimonials({ section, items }: { section: { eyebrow: string; title: string; accent: string }; items: { name: string; city: string; rating: number; body: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="tone-base section">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} />
        <ul className="m-rail mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t, i) => (
            <Reveal as="li" key={t.name + i} index={i % 3} className="glass flex flex-col rounded-[var(--radius-card)] p-7">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }, (_, n) => (
                  <Icon key={n} name="star" size={15} className={n < t.rating ? '' : 'opacity-25'} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-[17px] leading-relaxed text-fg">{t.body}</blockquote>
              <p className="mt-6 border-t border-hair pt-4 text-[14px] font-bold text-fg">
                {t.name} <span className="font-medium text-fg-3">· {t.city}</span>
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
