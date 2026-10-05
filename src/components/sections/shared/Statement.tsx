import { Fragment } from 'react';
import Reveal from '@/components/motion/Reveal';

/**
 * A sentence whose words light up one after another as it crosses the screen
 * — the device Apple's product pages use for the line that matters. A CSS
 * view timeline drives it; without one every word is simply lit.
 */
export default function Statement({ eyebrow, text, accent, tone = 'tone-base' }: { eyebrow?: string; text: string; accent?: string; tone?: string }) {
  const words = text.trim().split(/\s+/);
  const target = (accent || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  let from = -1;
  for (let i = 0; target.length && i + target.length <= words.length; i += 1) {
    if (target.every((w, k) => words[i + k].toLowerCase() === w)) {
      from = i;
      break;
    }
  }
  const to = from < 0 ? -1 : from + target.length;

  return (
    <section className={`${tone} section`}>
      <div className="shell">
        {eyebrow ? (
          <Reveal as="p" className="t-eyebrow">
            {eyebrow}
          </Reveal>
        ) : null}
        <Reveal>
          <p className="statement mt-6 max-w-[1080px]" style={{ ['--n' as string]: words.length }}>
            {words.map((word, i) => (
              <Fragment key={`${i}-${word}`}>
                <span style={{ ['--i' as string]: i }} className={i >= from && i < to ? 'is-accent' : undefined}>
                  {word}
                </span>
                {i < words.length - 1 ? ' ' : null}
              </Fragment>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
