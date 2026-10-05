import Trio from '@/components/art/Trio';
import Reveal from '@/components/motion/Reveal';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';

/** Home: who we are, beside the platform's three sides as one 3D object. */
export default function AboutSplit({ eyebrow, heading, accent, paragraphs, cta }: { eyebrow: string; heading: string; accent?: string; paragraphs: string[]; cta: { label: string; href: string } }) {
  return (
    <section className="tone-alt section overflow-clip">
      <div className="shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <Trio />
        </Reveal>
        <Reveal index={1}>
          <p className="t-eyebrow">{eyebrow}</p>
          <h2 className="t-display mt-4">
            <AccentText text={heading} accent={accent} />
          </h2>
          <div className="mt-7 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={p} className={i === 0 ? 'text-[clamp(18px,1rem+0.45vw,21px)] font-semibold leading-[1.5] tracking-[-0.016em] text-fg' : 't-body'}>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-9">
            <Button href={cta.href} variant="outline" icon="arrow-right">
              {cta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
