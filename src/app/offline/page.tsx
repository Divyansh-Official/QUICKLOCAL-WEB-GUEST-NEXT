/**
 * What the service worker shows for a page that was never opened on this
 * device while there is no connection. Not indexed, not in the sitemap.
 */
import type { Metadata } from 'next';
import Retry from '@/components/pwa/Retry';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { ui } from '@/lib/data';

export const metadata: Metadata = { title: ui.offline.title, robots: { index: false, follow: false } };

export default function OfflinePage() {
  const c = ui.offline;
  return (
    <section className="tone-base section grid min-h-[80svh] place-items-center pt-[calc(var(--header-h)+40px)]">
      <div className="shell flex max-w-xl flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-[22px] bg-primary-soft text-primary-ink">
          <Icon name="wifi-off" size={28} strokeWidth={1.9} />
        </span>
        <h1 className="t-display mt-6">{c.title}</h1>
        <p className="t-lead mt-4">{c.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Retry label={c.retry} />
          <Button href="/" size="lg" variant="glass">
            {c.home}
          </Button>
        </div>
      </div>
    </section>
  );
}
