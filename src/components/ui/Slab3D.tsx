import type { CSSProperties } from 'react';
import Icon from './Icon';

/* Literal classes for Tailwind's scan. */
const HUES: Record<string, string> = {
  tangerine: 'hue-tangerine',
  ink: 'hue-ink',
  butter: 'hue-butter',
  rose: 'hue-rose',
  green: 'hue-green',
};

/**
 * A rounded tile with real thickness, seen from an isometric angle — the
 * category glyph standing on its lit top face. Built from stacked layers in
 * CSS 3D, so it is sharp at every size and turns on hover (inside a `.group`)
 * on a spring. Purely decorative.
 */
export default function Slab3D({ icon, hue = 'tangerine', size = 132, active = false, className = '' }: { icon: string; hue?: string; size?: number; active?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`slab-stage ${HUES[hue] ?? HUES.tangerine} ${className}`}
      data-active={active ? '' : undefined}
      style={{ '--s': `${size}px` } as CSSProperties}>
      <span className="slab-shadow" />
      <span className="slab">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} style={{ '--i': i } as CSSProperties} />
        ))}
        <span className="slab-top">
          <Icon name={icon} size={Math.round(size * 0.36)} strokeWidth={2} />
        </span>
      </span>
    </span>
  );
}
