'use client';

import Button from '@/components/ui/Button';
import ui from '@/data/ui.json';

/** A section that fails to render still leaves a way forward. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  const c = ui.error;
  return (
    <section className="tone-base flex min-h-[72vh] items-center pb-24 pt-[calc(var(--header-h)+64px)]">
      <div className="shell text-center">
        <p className="t-eyebrow justify-center">{c.eyebrow}</p>
        <h1 className="t-hero mx-auto mt-4 max-w-3xl text-[clamp(2.4rem,1.4rem+4vw,4.6rem)]">{c.title}</h1>
        <p className="t-lead mx-auto mt-6 max-w-xl">{c.body}</p>
        <div className="mt-10 flex justify-center">
          <Button onClick={reset} size="lg" iconStart="refresh">
            {c.retry}
          </Button>
        </div>
      </div>
    </section>
  );
}
