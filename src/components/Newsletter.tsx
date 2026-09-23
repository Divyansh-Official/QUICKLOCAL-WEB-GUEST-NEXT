/**
 * The newsletter sign-up.
 *
 * ── IT CONFIRMS, AND IT SAYS WHERE THE ADDRESS WENT ─────────────────────────
 * There is no mailing list behind this site. A form that said "You're
 * subscribed!" and dropped the address would be the worst thing on the page —
 * a promise made to a real person that nothing keeps.
 *
 * So it does both halves honestly: the address is kept locally so the form
 * remembers you and does not ask twice, and the confirmation says plainly that
 * the list is not live yet and offers the mailbox for anyone who wants a human
 * now. Nobody is told they are on a list that does not exist.
 *
 * When a list endpoint exists, `submit` becomes one POST and the confirmation
 * wording changes. Nothing else here moves.
 */
'use client';

import { useState, useSyncExternalStore } from 'react';
import { Icon } from './Icon';
import { MailScene } from './Scenes';
import { Reveal } from './Reveal';
import { Button, Container } from './ui';
import { contact, info } from '@/lib/data';

/** Deliberately loose — the point is to catch a typo, not to police RFC 5322. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const STORE_KEY = 'ql.newsletter.email';

type State = 'idle' | 'sending';

/**
 * localStorage, read the way React wants an external store read.
 *
 * Not an effect that calls setState: that is a cascading render, and on a
 * statically rendered page it also means the server markup and the first
 * client paint disagree. useSyncExternalStore has a separate server snapshot —
 * always null, because the server cannot know — so hydration matches and the
 * saved address appears in the same commit.
 */
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  // Another tab subscribing should update this one.
  window.addEventListener('storage', fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', fn);
  };
}

function readSaved(): string | null {
  try {
    return window.localStorage.getItem(STORE_KEY);
  } catch {
    // A blocked store just means the form always starts empty.
    return null;
  }
}

function writeSaved(value: string | null) {
  try {
    if (value) window.localStorage.setItem(STORE_KEY, value);
    else window.localStorage.removeItem(STORE_KEY);
  } catch {
    /* not being able to remember is not a failure worth reporting */
  }
  listeners.forEach(fn => fn());
}

export function Newsletter() {
  // The saved address IS the "done" state — deriving it means the two can
  // never disagree, and a second visit is greeted rather than asked again.
  const saved = useSyncExternalStore(subscribe, readSaved, () => null);
  const [typed, setTyped] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<State>('idle');

  const email = saved ?? typed;
  const done = saved !== null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = typed.trim();
    if (!LOOKS_LIKE_EMAIL.test(value)) {
      setError('That does not look like an email address.');
      return;
    }
    setError(null);
    setState('sending');
    // A beat, so the button's state change is legible rather than a flicker.
    window.setTimeout(() => {
      writeSaved(value);
      setState('idle');
    }, 550);
  }

  return (
    <Container className="py-16 sm:py-20">
      <Reveal>
        <div className="ql-glint grid items-center gap-8 overflow-hidden rounded-[26px] bg-white/58 px-6 py-9 shadow-[inset_0_1px_0_rgba(255,255,255,.6),inset_0_0_0_.5px_rgba(255,255,255,.35),0_18px_46px_-22px_rgba(26,23,19,.3)] backdrop-blur-lg backdrop-saturate-150 sm:px-10 lg:grid-cols-[1fr_minmax(0,420px)]">
          <div className="flex items-start gap-5">
            <MailScene className="hidden h-[86px] w-[104px] shrink-0 sm:block" />
            <div>
              <h2 className="text-[22px] font-extrabold tracking-tight sm:text-[25px]">
                Stay updated with{' '}
                <span className="text-[var(--color-tangerine-500)]">{info.name}</span>
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
                New categories, new neighbourhoods, and the day the apps land in the stores.
              </p>
            </div>
          </div>

          {done ? (
            <div className="rounded-2xl border border-[var(--color-ok)]/30 bg-[var(--color-ok)]/8 p-5">
              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-ok)] text-white"
                  style={{ animation: 'ql-scale-in .45s cubic-bezier(.22,1,.36,1)' }}>
                  <Icon name="check" size={15} strokeWidth={3} />
                </span>
                <p className="text-[14px] font-bold">You&rsquo;re on the list</p>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-[var(--color-ink-500)]">
                We have kept <span className="font-semibold break-all">{email}</span> on this
                device. The mailing list is not running yet, so nothing has been sent anywhere — if
                you want a person now, write to{' '}
                <a
                  href={`mailto:${contact.email}`}
                  className="font-semibold text-[var(--color-tangerine-600)] hover:underline">
                  {contact.email}
                </a>
                .
              </p>
              <button
                onClick={() => {
                  writeSaved(null);
                  setTyped('');
                  setState('idle');
                }}
                className="mt-3 text-[11.5px] font-semibold text-[var(--text-muted)] underline underline-offset-2 hover:text-[var(--color-ink-900)]">
                Use a different address
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={typed}
                  onChange={e => {
                    setTyped(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your email address"
                  aria-label="Your email address"
                  aria-invalid={error ? true : undefined}
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  disabled={state === 'sending'}
                  className={`h-12 min-w-0 flex-1 rounded-xl border bg-[var(--color-cream-50)] px-4 text-[13.5px] outline-none transition focus:bg-[var(--surface)] disabled:opacity-60 ${
                    error
                      ? 'border-[var(--color-bad)]'
                      : 'border-[var(--line)] focus:border-[var(--color-tangerine-500)] focus:ring-[3px] focus:ring-[var(--color-tangerine-500)]/15'
                  }`}
                />
                <Button type="submit" size="lg" className="shrink-0">
                  {state === 'sending' ? 'Adding…' : 'Subscribe'}
                </Button>
              </div>

              {error ? (
                <p
                  id="newsletter-error"
                  role="alert"
                  className="mt-2 text-[11.5px] text-[var(--color-bad)]">
                  {error}
                </p>
              ) : (
                <p className="mt-2 text-[11.5px] text-[var(--text-muted)]">
                  Kept on your device only — this site has no server to send it to.
                </p>
              )}
            </form>
          )}
        </div>
      </Reveal>
    </Container>
  );
}
