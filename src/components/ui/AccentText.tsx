import { Fragment } from 'react';

const escape = (v: string) => v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * A heading with one phrase set in the tangerine gradient. Whole words only,
 * case-insensitive, punctuation left exactly where it was written — and the
 * text is never split into boxes, so it wraps naturally at every width.
 */
export default function AccentText({ text, accent }: { text: string; accent?: string }) {
  const target = (accent || '').trim();
  if (!target) return <>{text}</>;
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(${escape(target)})(?![\\p{L}\\p{N}])`, 'giu');
  const out: { text: string; accent: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    if (m.index! > last) out.push({ text: text.slice(last, m.index), accent: false });
    out.push({ text: m[0], accent: true });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), accent: false });
  return (
    <>
      {out.map((s, i) =>
        s.accent ? (
          <span key={i} className="text-gradient">
            {s.text}
          </span>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </>
  );
}
