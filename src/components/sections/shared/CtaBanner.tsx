import Reveal from '@/components/motion/Reveal';
import AccentText from '@/components/ui/AccentText';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';

/** The closing panel of an inner page: night, warm light, one promise, one action. */
export default function CtaBanner({
  eyebrow,
  title,
  accent,
  text,
  cta,
  secondary,
  children,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  text?: string;
  cta?: { label: string; href: string };
  secondary?: { label: string; href: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="tone-base section-tight pb-[var(--section-y)]">
      <div className="shell">
        <Reveal>
          <div className="tone-night relative overflow-hidden rounded-[var(--radius-panel)] px-6 py-16 text-center sm:px-12 sm:py-20">
            <Aurora variant="night" />
            <div className="relative mx-auto max-w-3xl">
              {eyebrow ? <p className="t-eyebrow justify-center">{eyebrow}</p> : null}
              <h2 className="t-display mt-4">
                <AccentText text={title} accent={accent} />
              </h2>
              {text ? <p className="t-lead mx-auto mt-5 max-w-xl">{text}</p> : null}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                {cta ? (
                  <Button href={cta.href} size="lg" icon="arrow-right">
                    {cta.label}
                  </Button>
                ) : null}
                {secondary ? (
                  <Button href={secondary.href} size="lg" variant="glass">
                    {secondary.label}
                  </Button>
                ) : null}
                {children}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
