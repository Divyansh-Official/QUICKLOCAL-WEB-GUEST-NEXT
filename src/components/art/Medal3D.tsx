import type { CSSProperties } from 'react';
import Icon from '@/components/ui/Icon';

/* Literal classes for Tailwind's scan. */
const METALS: Record<string, string> = {
  bronze: 'metal-bronze',
  silver: 'metal-silver',
  gold: 'metal-gold',
  platinum: 'metal-platinum',
};

/**
 * A tier medal with real thickness: a stack of discs along Z, a struck face
 * front and back, seen at a slight angle. It turns a full revolution on a
 * spring when its `.group` parent is hovered — a coin flipped on a counter —
 * and spins in once as it scrolls into view. Purely decorative.
 */
export default function Medal3D({ tone, size = 64, className = '' }: { tone: string; size?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`medal-stage ${METALS[tone] ?? METALS.bronze} ${className}`} style={{ '--m': `${size}px` } as CSSProperties}>
      <span className="medal">
        {Array.from({ length: 7 }, (_, i) => (
          <i key={i} style={{ '--i': i } as CSSProperties} />
        ))}
        <span className="medal-face">
          <Icon name="star" size={Math.round(size * 0.4)} strokeWidth={1.6} />
        </span>
        <span className="medal-face medal-back">
          <Icon name="bike" size={Math.round(size * 0.42)} strokeWidth={1.8} />
        </span>
      </span>
    </span>
  );
}
