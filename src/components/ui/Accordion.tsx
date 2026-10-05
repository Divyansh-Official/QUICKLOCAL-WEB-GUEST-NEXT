import Icon from './Icon';

/**
 * Native <details>: works without JavaScript, announced correctly, findable
 * with Ctrl-F. Items sharing `group` close each other where supported, and
 * the height animates where `::details-content` exists.
 */
export default function Accordion({ items, group, defaultOpen = 0 }: { items: { q: string; a: string }[]; group: string; defaultOpen?: number }) {
  return (
    <div>
      {items.map((item, i) => (
        <details key={item.q} name={group} className="disclosure" open={i === defaultOpen || undefined}>
          <summary>
            <span>{item.q}</span>
            <span className="disclosure-icon" aria-hidden="true">
              <Icon name="plus" size={15} strokeWidth={2.2} />
            </span>
          </summary>
          <p className="t-body max-w-3xl pb-6 pr-10">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
