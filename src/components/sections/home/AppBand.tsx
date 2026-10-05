import Reveal from '@/components/motion/Reveal';
import AccentText from '@/components/ui/AccentText';
import Aurora from '@/components/ui/Aurora';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Slab3D from '@/components/ui/Slab3D';
import StoreBadge from '@/components/ui/StoreBadge';

type Listing = { available: boolean; url: string | null; store: string };

/** The app, on a night panel: the promise, the store badges, and three guarantees. */
export default function AppBand({
  copy,
  stores,
  labels,
}: {
  copy: { eyebrow: string; title: string; accent: string; text: string; points: { icon: string; text: string }[]; cta: { label: string; href: string } };
  stores: { android: Listing; ios: Listing };
  labels: { googleTop: string; appleTop: string; version: string; soon: string; soonTitle: string };
}) {
  return (
    <section className="tone-base section-tight">
      <div className="shell">
        <Reveal>
          <div className="tone-night relative overflow-hidden rounded-[var(--radius-panel)] px-5 py-14 xs:px-7 sm:px-12 sm:py-16 lg:px-16">
            <Aurora variant="night" />
            <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div>
                <p className="t-eyebrow">{copy.eyebrow}</p>
                <h2 className="t-display mt-4">
                  <AccentText text={copy.title} accent={copy.accent} />
                </h2>
                <p className="t-lead mt-5 max-w-lg">{copy.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <StoreBadge listing={stores.android} icon="play" top={labels.googleTop} soon={labels.soon} soonTitle={labels.soonTitle} />
                  <StoreBadge listing={stores.ios} icon="apple" top={labels.appleTop} soon={labels.soon} soonTitle={labels.soonTitle} />
                </div>
                <p className="t-caption mt-4">{labels.version}</p>
                <div className="mt-8">
                  <Button href={copy.cta.href} variant="light" icon="arrow-right" className="h-auto min-h-[2.85rem] max-w-full whitespace-normal py-2.5 text-left">
                    {copy.cta.label}
                  </Button>
                </div>
              </div>
              <div className="group grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center lg:grid-cols-1 lg:justify-items-center">
                <div className="flex justify-center">
                  <Slab3D icon="download" hue="tangerine" size={200} />
                </div>
                <ul className="grid w-full gap-3">
                  {copy.points.map((p, i) => (
                    <Reveal as="li" key={p.text} index={i}>
                      <div className="glass flex items-center gap-3.5 rounded-2xl px-4 py-3.5">
                        <span className="icon-tile" style={{ ['--s' as string]: '38px' }}>
                          <Icon name={p.icon} size={18} strokeWidth={1.9} />
                        </span>
                        <span className="text-[15px] font-bold text-fg">{p.text}</span>
                      </div>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
