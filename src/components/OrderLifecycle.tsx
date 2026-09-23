/**
 * The states an order really passes through.
 *
 * ── WHY PUT THE ENUM ON A PUBLIC PAGE ───────────────────────────────────────
 * Every delivery site promises tracking. Almost none say what the states ARE,
 * which is precisely what somebody is asking when an order has sat on one of
 * them for ten minutes. These are the real OrderStatus constants in their real
 * order, each with the constant printed next to it so what is written here can
 * be matched against what the app shows.
 *
 * ── THE THREE UNHAPPY STATES ARE HERE TOO ───────────────────────────────────
 * Cancelled, refund started, refunded. Leaving them out would make the list a
 * sales pitch rather than a description, and they are the ones a nervous
 * customer most wants to see named before they order.
 *
 * ── IT WALKS ITSELF, AND IT STOPS WHEN TOUCHED ──────────────────────────────
 * The timeline advances on its own so the section is alive on arrival, and any
 * click hands control over for good — an animation that keeps moving under
 * somebody who is reading it is worse than one that never moved. It also stops
 * entirely under Reduce Motion, where every step is simply shown complete.
 */
'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { lifecycle } from '@/lib/data';
import { GlassPane } from './glass/GlassPane';
import { Icon, type IconName } from './Icon';
import { Container, Eyebrow } from './ui';
import { Reveal } from './Reveal';

const STEP_MS = 2200;

/**
 * Does this reader want less motion?
 *
 * A subscription rather than a read inside an effect. Reading it in an effect
 * and calling setState is the pattern React 19 rightly refuses: the first
 * paint shows the animated state and then corrects itself, which is a flash of
 * exactly the motion the setting asked not to see. This resolves before paint
 * and updates if the preference changes while the page is open.
 */
const QUIET = '(prefers-reduced-motion: reduce)';

function subscribeToMotion(onChange: () => void) {
  const mq = matchMedia(QUIET);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotion,
    () => matchMedia(QUIET).matches,
    // On the server there is no preference to read, and the markup this
    // produces is the still one — which is the safe half of the choice.
    () => true,
  );
}

export function OrderLifecycle() {
  const steps = lifecycle.happy;
  const [active, setActive] = useState(0);
  /** Once somebody picks a step, the walk stops for good. */
  const [taken, setTaken] = useState(false);
  const host = useRef<HTMLDivElement | null>(null);
  const quiet = useReducedMotion();

  /**
   * Still, and shown complete, for a reader who asked for less motion — until
   * they pick a step themselves, which is a deliberate act and not motion.
   */
  const current = quiet && !taken ? steps.length - 1 : active;

  useEffect(() => {
    if (taken || quiet) return;
    // Only while the section is on screen: a timer running against a section
    // nobody is looking at is a wakeup every two seconds for nothing.
    let timer: ReturnType<typeof setInterval> | null = null;
    const start = () => {
      if (timer) return;
      timer = setInterval(() => setActive(i => (i + 1) % steps.length), STEP_MS);
    };
    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    };
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      for (const e of entries) (e.isIntersecting ? start : stop)();
    }, { rootMargin: '0px 0px -20% 0px' });
    io.observe(el);
    return () => {
      stop();
      io.disconnect();
    };
  }, [taken, quiet, steps.length]);

  return (
    <section className="py-16 sm:py-20" id="order-lifecycle" ref={host}>
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[620px] text-center">
            <Eyebrow>Every state, named</Eyebrow>
            <h2 className="mt-2.5 text-balance text-[26px] font-extrabold leading-[1.15] tracking-tight sm:text-[34px]">
              What &ldquo;tracking&rdquo; actually{' '}
              <span className="text-[var(--color-tangerine-600)]">means here</span>
            </h2>
            <p className="mx-auto mt-3 max-w-[54ch] text-[14px] leading-relaxed text-[var(--color-ink-500)]">
              These are the states the platform moves an order through — the real names, in the real
              order. Nothing is a stand-in, and the three that are not part of a happy ending are
              listed too.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-[980px] gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          {/* ── the walk ───────────────────────────────────────────────── */}
          <Reveal anim="left">
            <GlassPane
              radius={24}
              tint="rgba(255,255,255,0.56)"
              blur={2.2}
              strength="full"
              elevation="float"
              className="ql-glint h-full p-4 sm:p-5">
              <ol className="ql-stagger relative">
                {/* The rail the markers sit on. */}
                <span
                  aria-hidden
                  className="absolute left-[27px] top-6 bottom-6 w-px bg-[var(--color-cream-300)]"
                />
                {steps.map((step, i) => {
                  const done = i < current;
                  const now = i === current;
                  return (
                    <li key={step.status} style={{ ['--i' as string]: i }}>
                      <button
                        type="button"
                        onClick={() => {
                          setTaken(true);
                          setActive(i);
                        }}
                        aria-current={now ? 'step' : undefined}
                        className="relative flex w-full items-start gap-3.5 rounded-2xl px-2 py-2.5 text-left transition-colors hover:bg-white/45">
                        <span
                          className={`relative mt-0.5 grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full transition-all duration-500 ${
                            now
                              ? 'ql-live bg-[var(--color-tangerine-500)] text-white'
                              : done
                                ? 'bg-[var(--color-ok)] text-white'
                                : 'bg-white text-[var(--color-ink-300)] ring-1 ring-[var(--color-cream-300)]'
                          }`}>
                          <Icon
                            name={done ? 'check' : (step.icon as IconName)}
                            size={14}
                            strokeWidth={done ? 2.6 : 1.8}
                          />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-baseline gap-x-2">
                            <span
                              className={`text-[14px] font-extrabold transition-colors ${
                                now ? 'text-[var(--color-tangerine-700)]' : ''
                              }`}>
                              {step.label}
                            </span>
                            <code className="rounded bg-[var(--color-cream-200)]/70 px-1.5 py-px text-[10px] font-bold tracking-wide text-[var(--color-ink-500)]">
                              {step.status}
                            </code>
                          </span>
                          <span
                            className={`mt-0.5 block text-[12.5px] leading-relaxed transition-all duration-500 ${
                              now
                                ? 'text-[var(--color-ink-700)]'
                                : 'text-[var(--color-ink-500)] opacity-70'
                            }`}>
                            {step.detail}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </GlassPane>
          </Reveal>

          {/* ── when it does not go to plan ────────────────────────────── */}
          <Reveal anim="right" delay={90}>
            <GlassPane
              radius={24}
              tint="rgba(255,255,255,0.5)"
              blur={2}
              strength="soft"
              elevation="raised"
              className="ql-glint flex h-full flex-col p-5">
              <h3 className="text-[13px] font-extrabold uppercase tracking-[.09em] text-[var(--color-ink-500)]">
                When it does not go to plan
              </h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--color-ink-500)]">
                Three more states, and none of them is a dead end you have to phone about.
              </p>

              <ul className="ql-stagger mt-4 flex flex-1 flex-col gap-2.5">
                {lifecycle.unhappy.map((step, i) => (
                  <li
                    key={step.status}
                    style={{ ['--i' as string]: i }}
                    className="flex items-start gap-3 rounded-2xl bg-white/55 px-3 py-2.5">
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[var(--color-cream-200)] text-[var(--color-ink-500)]">
                      <Icon name={step.icon as IconName} size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-[13px] font-bold">{step.label}</span>
                        <code className="rounded bg-[var(--color-cream-200)]/70 px-1.5 py-px text-[9.5px] font-bold tracking-wide text-[var(--color-ink-500)]">
                          {step.status}
                        </code>
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-relaxed text-[var(--color-ink-500)]">
                        {step.detail}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </GlassPane>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
