'use client';

/**
 * The states an order really passes through — the real OrderStatus constants,
 * in the real order, each printed beside its plain-English name so what the
 * site says can be matched against what the app shows. The three that are not
 * a happy ending are here too: they are the ones a nervous customer most wants
 * named before they order.
 *
 * The walk advances on its own while on screen, and the first tap hands
 * control over for good — an animation that keeps moving under somebody
 * reading it is worse than one that never moved. Under reduced motion it is
 * still and shown complete.
 */
import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import { prefersCalm } from '@/lib/hooks';

type Step = { status: string; label: string; detail: string; icon: string };

export default function OrderLifecycle({
  section,
  happy,
  unhappy,
}: {
  section: { eyebrow: string; title: string; accent: string; intro: string; unhappyTitle: string; unhappyText: string; hint: string };
  happy: Step[];
  unhappy: Step[];
}) {
  const [active, setActive] = useState(0);
  const [taken, setTaken] = useState(false);
  const host = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = host.current;
    if (taken || !el) return;
    if (prefersCalm()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(happy.length - 1);
      return;
    }
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (entry.isIntersecting) timer = window.setInterval(() => setActive(i => (i + 1) % happy.length), 2300);
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, [taken, happy.length]);

  const progress = happy.length > 1 ? active / (happy.length - 1) : 1;
  const current = happy[active];

  return (
    <section ref={host} id="order-lifecycle" className="tone-alt section scroll-mt-24">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} intro={section.intro} />

        <div className="m-rail m-rail-wide mx-auto mt-14 grid max-w-[1080px] gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-5">
          <Reveal className="glass glass-raised rounded-[var(--radius-panel)] p-4 sm:p-6">
            {/* The progress rail across the top: it fills as the order moves. */}
            <div className="flex items-center gap-3 px-2 pb-3 pt-1 sm:pb-5">
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]">
                <span
                  className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-[#e0721a] to-[#f2a53c] transition-[width] duration-700 ease-[var(--ease-out)]"
                  style={{ width: `${Math.max(6, progress * 100)}%` }}
                />
              </span>
              <span className="tnum text-[12px] font-extrabold text-fg-3">
                {active + 1}/{happy.length}
              </span>
            </div>
            <ol className="relative">
              <span aria-hidden="true" className="absolute bottom-6 left-[23px] top-6 w-[2px] sm:left-[27px] rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]" />
              {happy.map((step, i) => {
                const done = i < active;
                const now = i === active;
                return (
                  <li key={step.status}>
                    <button
                      type="button"
                      onClick={() => {
                        setTaken(true);
                        setActive(i);
                      }}
                      aria-current={now ? 'step' : undefined}
                      className={`relative flex w-full items-start gap-3 rounded-[16px] px-2 py-1.5 sm:gap-4 sm:rounded-[20px] sm:py-2 text-left transition-colors duration-300 ${
                        now ? 'bg-[color-mix(in_oklab,var(--card)_80%,transparent)] shadow-[var(--rim),var(--edge)]' : 'hover:bg-[color-mix(in_oklab,var(--fg)_4%,transparent)]'
                      }`}>
                      <span
                        className={`relative mt-0.5 grid h-8 w-8 shrink-0 sm:h-10 sm:w-10 place-items-center rounded-full transition-colors duration-500 ${
                          now ? 'live-ring bg-primary text-white' : done ? 'bg-ok text-white' : 'bg-card text-fg-3 shadow-[inset_0_0_0_1.5px_var(--hair)]'
                        }`}>
                        <Icon name={done ? 'check' : step.icon} size={17} strokeWidth={done ? 2.6 : 1.9} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5 pt-1 sm:gap-x-2.5 sm:gap-y-1 sm:pt-2">
                        <span className={`text-[14.5px] font-extrabold sm:text-[16px] tracking-[-0.02em] transition-colors duration-300 ${now ? 'text-primary-ink' : done ? 'text-fg' : 'text-fg-2'}`}>
                          {step.label}
                        </span>
                        <code className="rounded-md bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide text-fg-3">
                          {step.status}
                        </code>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            {/* The current step, explained. A fixed height, so the walk never
                moves anything on the page while somebody is reading. */}
            <div className="mt-3 rounded-[18px] bg-[color-mix(in_oklab,var(--fg)_4.5%,transparent)] px-4 py-3 sm:mt-4 sm:rounded-[22px] sm:px-5 sm:py-4">
              <div className="grid">
                {happy.map(step => {
                  const on = step.status === current.status;
                  return (
                    <p
                      key={step.status}
                      aria-hidden={on ? undefined : true}
                      className={`[grid-area:1/1] text-[13.5px] leading-relaxed sm:text-[15px] text-fg-2 transition-[opacity,transform] duration-500 ease-[var(--ease-out)] ${
                        on ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1.5 opacity-0'
                      }`}>
                      <span className="font-extrabold text-fg">{step.label}. </span>
                      {step.detail}
                    </p>
                  );
                })}
              </div>
              <p className="mt-2 text-[12.5px] font-semibold text-fg-3 max-sm:hidden">{taken ? '\u00a0' : section.hint}</p>
            </div>
          </Reveal>

          <Reveal index={1} className="glass flex flex-col rounded-[var(--radius-panel)] p-6 sm:p-7">
            <span className="icon-tile icon-tile-soft" style={{ ['--s' as string]: '44px' }}>
              <Icon name="refresh" size={20} strokeWidth={1.9} />
            </span>
            <h3 className="t-headline mt-5">{section.unhappyTitle}</h3>
            <p className="t-small mt-2">{section.unhappyText}</p>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {unhappy.map(step => (
                <li key={step.status} className="flex items-start gap-3 rounded-[16px] bg-[color-mix(in_oklab,var(--card)_70%,transparent)] p-3 sm:gap-3.5 sm:rounded-[20px] sm:p-4 shadow-[var(--rim),var(--edge)]">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--fg)_7%,transparent)] text-fg-2">
                    <Icon name={step.icon} size={16} strokeWidth={1.9} />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-[15px] font-extrabold tracking-[-0.015em] text-fg">{step.label}</span>
                      <code className="rounded-md bg-[color-mix(in_oklab,var(--fg)_6%,transparent)] px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-fg-3">{step.status}</code>
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-fg-2">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
