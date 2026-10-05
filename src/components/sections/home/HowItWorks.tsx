import Reveal from '@/components/motion/Reveal';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';

const ICONS = ['search', 'basket', 'store', 'bike'];

/**
 * The four stages, as a row joined by a line on wide screens and a timeline
 * down the left edge on a phone. Each stage names the real OrderStatus it
 * belongs to.
 */
export default function HowItWorks({
  section,
  steps,
}: {
  section: { eyebrow: string; title: string; accent: string };
  steps: { n: number; title: string; body: string; status: string }[];
}) {
  return (
    <section id="how-it-works" className="tone-base section scroll-mt-24">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} />
        <div className="relative mt-16">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-[31px] top-8 w-[2px] rounded-full bg-gradient-to-b from-primary/50 via-accent/40 to-transparent lg:bottom-auto lg:left-[12%] lg:right-[12%] lg:top-[31px] lg:h-[2px] lg:w-auto lg:bg-gradient-to-r"
          />
          <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.n} index={i} className="group flex gap-5 lg:flex-col lg:items-center lg:text-center">
                <span className="glass relative grid h-16 w-16 flex-none place-items-center rounded-[22px] text-primary-ink">
                  <Icon name={ICONS[i] ?? 'check'} size={26} strokeWidth={1.8} effect="draw" />
                  <span className="absolute -right-2 -top-2 grid h-7 min-w-7 place-items-center rounded-full bg-primary px-1 text-[12px] font-extrabold text-white shadow-[0_6px_14px_-6px_rgb(240_134_38/0.9)]">
                    {step.n}
                  </span>
                </span>
                <span className="pt-1 lg:pt-0">
                  <span className="t-headline block lg:mt-6">{step.title}</span>
                  <span className="t-small mt-1.5 block max-w-[17rem] lg:mx-auto">{step.body}</span>
                  <code className="mt-3 inline-block rounded-md bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-2 py-0.5 text-[11px] font-bold tracking-wide text-fg-3">
                    {step.status}
                  </code>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
