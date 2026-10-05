import Icon from '@/components/ui/Icon';

/**
 * A slow ribbon of the platform's guarantees, under the hero. Two identical
 * tracks scroll as one so the loop has no seam; the second is hidden from
 * assistive technology. Hover pauses it; reduced motion stills it.
 */
export default function Marquee({ items }: { items: { icon: string; text: string }[] }) {
  const track = (hidden: boolean) => (
    <ul className="marquee-track" aria-hidden={hidden || undefined}>
      {items.map(item => (
        <li key={item.text} className="glass inline-flex h-11 shrink-0 items-center gap-2.5 rounded-full pl-2 pr-5 text-[14px] font-bold text-fg">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-soft text-primary-ink">
            <Icon name={item.icon} size={15} strokeWidth={1.9} />
          </span>
          {item.text}
        </li>
      ))}
    </ul>
  );
  return (
    <section className="tone-base py-3" aria-label="Platform guarantees">
      <div className="marquee py-2">
        {track(false)}
        {track(true)}
      </div>
    </section>
  );
}
