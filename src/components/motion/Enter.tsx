import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * Load-time entrance — pure CSS (`.enter*` in globals.css), so it runs before
 * hydration, needs no JavaScript, and under reduced motion or ?nomotion the
 * element simply renders in place. Nothing waits on a script to be seen.
 *
 *   effect  'rise' · 'fade' · 'scale' · 'blur' · 'phone'
 */
const EFFECT = { rise: 'enter', fade: 'enter-fade', scale: 'enter-scale', blur: 'enter-blur', phone: 'enter-phone' } as const;

export default function Enter({
  as: Tag = 'div',
  delay = 0,
  effect = 'rise',
  className = '',
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  delay?: number;
  effect?: keyof typeof EFFECT;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <Tag className={`${EFFECT[effect]} ${className}`} style={{ '--d': delay, ...style } as CSSProperties} {...rest}>
      {children}
    </Tag>
  );
}
