import MorphLink from '@/components/motion/MorphLink';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Shelf from '@/components/ui/Shelf';
import Slab3D from '@/components/ui/Slab3D';

export type CategoryCard = { slug: string; name: string; icon: string; hue: string; tagline: string; badge: string; examples: string[] };

/**
 * One category as a tall glass card with its 3D slab. Tapping it zooms the
 * card open into the category's page (MorphLink); the slab turns on hover.
 */
export function CategoryCard({ c }: { c: CategoryCard }) {
  return (
    <MorphLink
      href={`/services/${c.slug}`}
      className="group glass hover-lift relative flex h-full min-h-[clamp(196px,50vw,300px)] flex-col overflow-hidden rounded-[var(--radius-card)] p-3.5 xs:p-4 sm:h-[clamp(380px,56vh,440px)] sm:p-6">
      <span className="flex items-center justify-between">
        <span className="chip chip-brand max-sm:hidden">
          <Icon name="truck" size={13} />
          {c.badge}
        </span>
        <span className="sm:hidden" />
        <span className="grid h-7 w-7 place-items-center rounded-full sm:h-10 sm:w-10 bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] text-fg transition-[transform,background-color,color] duration-500 ease-[var(--ease-ios)] group-hover:translate-x-1 group-hover:bg-primary group-hover:text-white">
          <Icon name="arrow-right" size={17} strokeWidth={1.9} />
        </span>
      </span>
      <span className="flex flex-1 items-center justify-center">
        <Slab3D icon={c.icon} hue={c.hue} size={150} phoneSize={88} />
      </span>
      <span className="block text-[clamp(1.15rem,0.9rem+1.4vw,1.85rem)] font-extrabold leading-tight tracking-[-0.035em] text-fg">{c.name}</span>
      <span className="mt-1 block text-[12.5px] leading-snug text-fg-2 sm:mt-1.5 sm:min-h-[2.75em] sm:text-[15px]">{c.tagline}</span>
      <span className="mt-4 block truncate border-t border-hair pt-3.5 text-[12.5px] font-semibold text-fg-3 max-sm:hidden">{c.examples.slice(0, 3).join(' · ')}</span>
    </MorphLink>
  );
}

export default function CategoryShelf({
  section,
  items,
  labels,
}: {
  section: { eyebrow: string; title: string; accent: string; intro: string; cta: { label: string; href: string } };
  items: CategoryCard[];
  labels: { previous: string; next: string; explore: string };
}) {
  return (
    <section className="tone-base section overflow-clip pb-[calc(var(--section-y)*0.6)]">
      <div className="shell">
        <SectionHeader align="left" eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro}>
          <a href={section.cta.href} className="link-more">
            {section.cta.label}
            <Icon name="chevron-right" size={14} strokeWidth={2.2} />
          </a>
        </SectionHeader>
      </div>
      <Shelf className="mt-8" label={section.title} itemWidth="clamp(176px, 46vw, 310px)" labels={labels}>
        {items.map(c => (
          <CategoryCard key={c.slug} c={c} />
        ))}
      </Shelf>
    </section>
  );
}
