import type { ElementType, ReactNode } from 'react';
import AccentText from './AccentText';
import Reveal from '@/components/motion/Reveal';

/**
 * Every section opens with this: eyebrow, a large title with one phrase in
 * the gradient, an optional lead and actions. `left` puts the actions across
 * from the title on wide screens — the shelf layout.
 */
export default function SectionHeader({
  eyebrow,
  title,
  accent,
  intro,
  align = 'center',
  as: Heading = 'h2',
  size = 'display',
  children,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  intro?: string;
  align?: 'center' | 'left';
  as?: ElementType;
  size?: 'display' | 'title';
  children?: ReactNode;
  className?: string;
}) {
  const titleClass = size === 'title' ? 't-title' : 't-display';
  if (align === 'left') {
    return (
      <Reveal className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-12 ${className}`}>
        <div className="max-w-3xl">
          {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
          <Heading className={`${titleClass} ${eyebrow ? 'mt-4' : ''}`}>
            <AccentText text={title} accent={accent} />
          </Heading>
          {intro ? <p className="t-lead mt-5 max-w-2xl">{intro}</p> : null}
        </div>
        {children ? <div className="flex flex-none flex-wrap items-center gap-3 md:pb-2">{children}</div> : null}
      </Reveal>
    );
  }
  return (
    <Reveal className={`mx-auto flex max-w-4xl flex-col items-center text-center ${className}`}>
      {eyebrow ? <p className="t-eyebrow">{eyebrow}</p> : null}
      <Heading className={`${titleClass} ${eyebrow ? 'mt-4' : ''}`}>
        <AccentText text={title} accent={accent} />
      </Heading>
      {intro ? <p className="t-lead mt-5 max-w-2xl">{intro}</p> : null}
      {children ? <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </Reveal>
  );
}
