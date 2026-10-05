import Enter from '@/components/motion/Enter';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';
import Slab3D from '@/components/ui/Slab3D';
import { ui } from '@/lib/data';

export const metadata = { title: ui.notFound.title, robots: { index: false, follow: false } };

export default function NotFound() {
  const c = ui.notFound;
  return (
    <section className="tone-base relative flex min-h-[86vh] items-center overflow-clip pb-20 pt-[calc(var(--header-h)+48px)]">
      <div className="shell text-center">
        <Enter effect="scale" className="group flex justify-center">
          <Slab3D icon="pin" hue="tangerine" size={200} active />
        </Enter>
        <Enter as="p" delay={60} className="t-eyebrow mt-4 justify-center">
          {c.eyebrow}
        </Enter>
        <Enter as="h1" delay={110} effect="blur" className="t-hero mx-auto mt-4 max-w-4xl text-[clamp(2.4rem,1.4rem+4.4vw,5rem)]">
          <AccentText text={c.title} accent={c.accent} />
        </Enter>
        <Enter as="p" delay={170} className="t-lead mx-auto mt-6 max-w-xl">
          {c.body}
        </Enter>
        <Enter delay={230} className="mt-10 flex flex-col items-center justify-center gap-3 xs:flex-row">
          <Button href={c.cta.href} size="lg" iconStart="home">
            {c.cta.label}
          </Button>
          <Button href={c.secondary.href} size="lg" variant="glass" icon="arrow-right">
            {c.secondary.label}
          </Button>
        </Enter>
      </div>
    </section>
  );
}
