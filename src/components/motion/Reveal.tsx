import type { CSSProperties, ElementType, ReactNode } from 'react';

/**
 * Scroll-driven reveal: rises in from below as it enters, and vanishes —
 * fading, lifting, shrinking a touch — as it passes under the header.
 * Scrolling back plays it in reverse. Driven by a CSS view timeline: no
 * observer, no listener, no hydration concern. Where view timelines are
 * missing, the content is simply there.
 *
 * Keep hover transforms on a child: the reveal owns this element's transform.
 */
export default function Reveal({
  as: Tag = 'div',
  index = 0,
  effect = 'rise',
  className,
  style,
  children,
  ...rest
}: {
  as?: ElementType;
  index?: number;
  effect?: 'rise' | 'fade';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return (
    <Tag
      data-reveal={effect === 'fade' ? 'fade' : ''}
      className={className}
      style={index ? ({ '--ri': index, ...style } as CSSProperties) : style}
      {...rest}>
      {children}
    </Tag>
  );
}
