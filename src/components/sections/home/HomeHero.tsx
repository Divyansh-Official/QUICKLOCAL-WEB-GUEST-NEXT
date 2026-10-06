import Link from 'next/link';
import Phone3D from '@/components/art/Phone3D';
import Enter from '@/components/motion/Enter';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';

/**
 * Home's opening. The promise in the largest type on the site, with the word
 * that matters in the gradient; two actions; the five real categories one tap
 * away — and beside it, in 3D, the order tracking a customer actually gets.
 * Everything enters on CSS keyframes, so the page paints complete without
 * JavaScript and nothing waits on hydration. The copy recedes as you scroll.
 */
export default function HomeHero({
  hero,
  categories,
  phone,
}: {
  hero: {
    pill: string;
    pillDetail: string;
    title: string;
    accent: string;
    subtitle: string;
    primaryCta: { label: string; href: string; icon: string };
    secondaryCta: { label: string; href: string; icon: string };
    quickLabel: string;
  };
  categories: { slug: string; name: string; icon: string }[];
  phone: Parameters<typeof Phone3D>[0];
}) {
  return (
    <section className="tone-base relative overflow-clip pb-[clamp(20px,7vw,110px)] pt-[calc(var(--header-h)+clamp(14px,6vw,80px))]">
      <div className="shell grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-8">
        <div data-vanish className="min-w-0 text-center lg:text-left" style={{ ['--vanish' as string]: '70vh' }}>
          <Enter delay={0} className="flex justify-center lg:justify-start">
            <span className="glass-blur inline-flex min-h-8 items-center gap-2 rounded-full px-3.5 py-1 text-[12.5px] font-bold sm:min-h-9 sm:gap-2.5 sm:px-4 sm:py-1.5 sm:text-[13.5px]">
              <span className="status-dot ping relative" />
              <span className="text-fg">{hero.pill}</span>
              <span className="font-medium text-fg-3">· {hero.pillDetail}</span>
            </span>
          </Enter>
          <Enter as="h1" delay={90} effect="blur" className="t-hero mx-auto mt-4 max-w-[13ch] sm:mt-7 lg:mx-0">
            <AccentText text={hero.title} accent={hero.accent} />
          </Enter>
          <Enter as="p" delay={180} className="t-lead mx-auto mt-3 max-w-[30rem] sm:mt-6 sm:max-w-[34rem] lg:mx-0">
            {hero.subtitle}
          </Enter>
          <Enter delay={260} className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-center justify-center gap-2 sm:mt-9 sm:flex sm:flex-row sm:gap-3 lg:justify-start">
            <Button href={hero.primaryCta.href} size="lg" iconStart={hero.primaryCta.icon} className="max-sm:px-4">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="glass" iconStart={hero.secondaryCta.icon} className="max-sm:min-w-0 max-sm:px-3.5 max-sm:text-[13.5px] max-sm:[&>svg]:hidden">
              {hero.secondaryCta.label}
            </Button>
          </Enter>
          <Enter delay={340} className="mt-5 sm:mt-10">
            <p className="t-caption font-bold uppercase tracking-[0.14em]">{hero.quickLabel}</p>
            <ul className="chip-rail mt-2.5 flex justify-center gap-2 max-sm:-mx-[var(--gutter)] max-sm:justify-start max-sm:overflow-x-auto max-sm:px-[var(--gutter)] max-sm:pb-1 sm:mt-3 sm:flex-wrap lg:grid lg:w-max lg:grid-cols-3 lg:justify-start">
              {categories.map(c => (
                <li key={c.slug}>
                  <Link
                    href={`/services/${c.slug}`}
                    className="group glass inline-flex h-8 flex-none items-center whitespace-nowrap sm:h-9 gap-1.5 rounded-full pl-1.5 pr-3.5 text-[13.5px] font-bold text-fg lg:w-full transition-transform duration-500 ease-[var(--ease-ios)] hover:-translate-y-0.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-soft text-primary-ink">
                      <Icon name={c.icon} size={14} strokeWidth={1.9} effect="bounce" />
                    </span>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Enter>
        </div>

        <Enter delay={220} effect="phone" className="relative mx-auto w-full max-w-[520px] py-0 sm:py-6 lg:py-10">
          <Phone3D {...phone} />
        </Enter>
      </div>
    </section>
  );
}
