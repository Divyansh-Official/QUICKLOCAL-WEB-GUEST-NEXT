import MorphLink from '@/components/motion/MorphLink';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Shelf from '@/components/ui/Shelf';
import Slab3D from '@/components/ui/Slab3D';

export type CategoryCard = { slug: string; name: string; icon: string; hue: string; tagline: string; fee: string };

/**
 * One category as a tall glass card with its 3D slab. Tapping it zooms the
 * card open into the category's page (MorphLink); the slab turns on hover.
 */
export function CategoryCard({ c, feeLabel }: { c: CategoryCard; feeLabel: string }) {
  return (
    <MorphLink
      href={`/services/${c.slug}`}
      className="group glass hover-lift relative flex h-[clamp(380px,56vh,440px)] flex-col overflow-hidden rounded-[var(--radius-card)] p-6">
      <span className="flex items-center justify-between">
        <span className="chip chip-brand">
          <Icon name="tag" size={13} />
          {c.fee} {feeLabel}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] text-fg transition-transform duration-500 ease-[var(--ease-ios)] group-hover:translate-x-1">
          <Icon name="arrow-right" size={17} strokeWidth={1.9} />
        </span>
      </span>
      <span className="flex flex-1 items-center justify-center">
        <Slab3D icon={c.icon} hue={c.hue} size={150} />
      </span>
      <span className="block text-[clamp(1.5rem,1.3rem+0.7vw,1.85rem)] font-extrabold leading-tight tracking-[-0.035em] text-fg">{c.name}</span>
      <span className="mt-1.5 block min-h-[2.75em] text-[15px] leading-snug text-fg-2">{c.tagline}</span>
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
  labels: { fee: string; previous: string; next: string; explore: string };
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
      <Shelf className="mt-8" label={section.title} itemWidth="clamp(268px, 74vw, 310px)" labels={labels}>
        {items.map(c => (
          <CategoryCard key={c.slug} c={c} feeLabel={labels.fee} />
        ))}
      </Shelf>
    </section>
  );
}
