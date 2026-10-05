/** Static fields of warm light behind a night panel. They never move. */
const VARIANTS = {
  night: [
    { tint: 'rgb(240 134 38 / 0.55)', size: '46rem', alpha: 0.75, top: '-24rem', right: '-14rem' },
    { tint: 'rgb(245 198 69 / 0.4)', size: '38rem', alpha: 0.5, bottom: '-24rem', left: '-14rem' },
  ],
  soft: [
    { tint: 'rgb(240 134 38 / 0.35)', size: '44rem', alpha: 0.6, top: '-28rem', right: '-14rem' },
    { tint: 'rgb(245 198 69 / 0.28)', size: '36rem', alpha: 0.5, top: '-16rem', left: '-16rem' },
  ],
} as const;

export default function Aurora({ variant = 'night' }: { variant?: keyof typeof VARIANTS }) {
  return (
    <div className="aurora" aria-hidden="true">
      {VARIANTS[variant].map((b, i) => (
        <span
          key={i}
          style={{ ['--tint' as string]: b.tint, ['--size' as string]: b.size, ['--alpha' as string]: b.alpha, ...('top' in b ? { top: b.top } : {}), ...('bottom' in b ? { bottom: b.bottom } : {}), ...('left' in b ? { left: b.left } : {}), ...('right' in b ? { right: b.right } : {}) }}
        />
      ))}
    </div>
  );
}
