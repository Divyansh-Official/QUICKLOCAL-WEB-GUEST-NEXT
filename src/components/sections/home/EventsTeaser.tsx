import Reveal from '@/components/motion/Reveal';
import EventPhone, { type EventScreen } from '@/components/sections/events/EventPhone';
import AccentText from '@/components/ui/AccentText';
import Button from '@/components/ui/Button';

/** Home: events and offers in one panel, with the event tab sliding into the rail. */
export default function EventsTeaser({
  copy,
  screen,
}: {
  copy: { eyebrow: string; title: string; accent: string; text: string; cta: { label: string; href: string }; secondary: { label: string; href: string } };
  screen: EventScreen;
}) {
  return (
    <section className="tone-base section-tight pb-[var(--section-y)]">
      <div className="shell">
        <Reveal className="glass glass-raised grid items-center gap-10 overflow-hidden rounded-[var(--radius-panel)] p-7 sm:p-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-14">
          <div className="min-w-0">
            <p className="t-eyebrow">{copy.eyebrow}</p>
            <h2 className="t-display mt-4">
              <AccentText text={copy.title} accent={copy.accent} />
            </h2>
            <p className="t-lead mt-5 max-w-xl max-sm:text-[13.5px]">{copy.text}</p>
            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              <Button href={copy.cta.href} icon="arrow-right">
                {copy.cta.label}
              </Button>
              <Button href={copy.secondary.href} variant="glass">
                {copy.secondary.label}
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <EventPhone screen={screen} width="clamp(150px, 40vw, 270px)" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
