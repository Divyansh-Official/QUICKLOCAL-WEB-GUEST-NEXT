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
    <section className="tone-base relative overflow-clip pb-[clamp(56px,7vw,110px)] pt-[calc(var(--header-h)+clamp(28px,6vw,80px))]">
      <div className="shell grid items-center gap-14 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-8">
        <div data-vanish className="text-center lg:text-left" style={{ ['--vanish' as string]: '70vh' }}>
          <Enter delay={0} className="flex justify-center lg:justify-start">
            <span className="glass-blur inline-flex min-h-9 items-center gap-2.5 rounded-full px-4 py-1.5 text-[13.5px] font-bold">
              <span className="status-dot ping relative" />
              <span className="text-fg">{hero.pill}</span>
              <span className="font-medium text-fg-3">· {hero.pillDetail}</span>
            </span>
          </Enter>
          <Enter as="h1" delay={90} effect="blur" className="t-hero mx-auto mt-7 max-w-[13ch] lg:mx-0">
            <AccentText text={hero.title} accent={hero.accent} />
          </Enter>
          <Enter as="p" delay={180} className="t-lead mx-auto mt-6 max-w-[34rem] lg:mx-0">
            {hero.subtitle}
          </Enter>
          <Enter delay={260} className="mt-9 flex flex-col items-stretch justify-center gap-3 xs:flex-row xs:items-center lg:justify-start">
            <Button href={hero.primaryCta.href} size="lg" iconStart={hero.primaryCta.icon}>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} size="lg" variant="glass" iconStart={hero.secondaryCta.icon}>
              {hero.secondaryCta.label}
            </Button>
          </Enter>
          <Enter delay={340} className="mt-10">
            <p className="t-caption font-bold uppercase tracking-[0.14em]">{hero.quickLabel}</p>
            <ul className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
              {categories.map(c => (
                <li key={c.slug}>
                  <Link
                    href={`/services/${c.slug}`}
                    className="group glass inline-flex h-9 items-center gap-1.5 rounded-full pl-1.5 pr-3.5 text-[13.5px] font-bold text-fg transition-transform duration-500 ease-[var(--ease-ios)] hover:-translate-y-0.5">
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

        <Enter delay={220} effect="phone" className="relative mx-auto w-full max-w-[520px] py-6 lg:py-10">
          <Phone3D {...phone} />
        </Enter>
      </div>
    </section>
  );
}
