import Reveal from '@/components/motion/Reveal';
import CountUp from '@/components/ui/CountUp';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';
import Tilt from '@/components/ui/Tilt';

type Tile = { kind: string; size: string; icon: string; title: string; text: string; stat?: string; statLabel?: string };

/* Six columns on a desktop, two on a tablet, one on a phone. Literal classes. */
const SIZES: Record<string, string> = {
  large: 'sm:col-span-2 lg:col-span-4 lg:row-span-2',
  tall: 'sm:col-span-2 lg:col-span-2 lg:row-span-2',
  wide: 'sm:col-span-2 lg:col-span-4',
  small: 'lg:col-span-2',
};

/** The delivery radius, drawn: rings, a sweep, and shops pinging inside it. */
function Radar({ label }: { label: string }) {
  const dots = [
    { l: '34%', t: '30%', d: '0s' },
    { l: '66%', t: '40%', d: '-0.8s' },
    { l: '42%', t: '68%', d: '-1.6s' },
    { l: '74%', t: '70%', d: '-2.2s' },
    { l: '22%', t: '55%', d: '-1.1s' },
  ];
  return (
    <div className="relative mx-auto w-full max-w-[340px]" aria-hidden="true">
      <div className="radar">
        <span className="radar-sweep" />
        {dots.map(d => (
          <span key={d.l + d.t} className="radar-dot" style={{ left: d.l, top: d.t, ['--delay' as string]: d.d }} />
        ))}
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-bg shadow-[0_10px_24px_-8px_rgb(0_0_0/0.5)]">
          <Icon name="home" size={20} strokeWidth={1.9} />
        </span>
        <span className="absolute bottom-[8%] right-[2%] rounded-full bg-primary px-3 py-1 text-[13px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgb(240_134_38/0.9)]">
          {label}
        </span>
      </div>
    </div>
  );
}

function TileBody({ tile }: { tile: Tile }) {
  if (tile.kind === 'radar') {
    return (
      <div className="grid h-full grid-cols-1 items-center gap-6 p-7 sm:p-9 md:grid-cols-[1fr_1.05fr]">
        <div>
          <span className="icon-tile" style={{ ['--s' as string]: '50px' }}>
            <Icon name={tile.icon} size={24} strokeWidth={1.9} />
          </span>
          <h3 className="t-title mt-6">{tile.title}</h3>
          <p className="t-body mt-3">{tile.text}</p>
        </div>
        <Radar label={tile.stat ?? ''} />
      </div>
    );
  }
  if (tile.kind === 'stat') {
    return (
      <div className="stat-box flex h-full flex-col p-7 sm:p-8">
        <span className="icon-tile icon-tile-soft" style={{ ['--s' as string]: '46px' }}>
          <Icon name={tile.icon} size={22} strokeWidth={1.9} effect="draw" />
        </span>
        <h3 className="t-headline mt-6">{tile.title}</h3>
        <p className="t-small mt-2 max-w-md">{tile.text}</p>
        <p className="mt-auto pt-8">
          <CountUp value={tile.stat ?? ''} className="t-stat text-gradient block whitespace-nowrap" />
          {tile.statLabel ? <span className="t-caption mt-2 block font-bold uppercase tracking-[0.12em]">{tile.statLabel}</span> : null}
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col p-7 sm:p-8">
      <span className="icon-tile" style={{ ['--s' as string]: '46px' }}>
        <Icon name={tile.icon} size={22} strokeWidth={1.9} />
      </span>
      <h3 className="t-headline mt-6">{tile.title}</h3>
      <p className="t-small mt-2">{tile.text}</p>
    </div>
  );
}

export default function Bento({ section, tiles }: { section: { eyebrow: string; title: string; accent: string; intro: string }; tiles: Tile[] }) {
  return (
    <section className="tone-alt section">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro} />
        <ul className="mt-14 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[minmax(250px,auto)] lg:grid-cols-6 lg:gap-5">
          {tiles.map((tile, i) => (
            <Reveal as="li" key={tile.title} index={i % 3} className={`flex ${SIZES[tile.size] ?? SIZES.small}`}>
              <Tilt max={4} className="glass hover-lift relative w-full overflow-hidden rounded-[var(--radius-card)]">
                <TileBody tile={tile} />
              </Tilt>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
