/**
 * The newsletter sign-up.
 *
 * ── IT DOES NOT PRETEND TO SUBSCRIBE ANYONE ─────────────────────────────────
 * There is no backend on this site and no mailing list behind it. A form that
 * showed "Thanks, you're subscribed!" and then dropped the address on the floor
 * would be the worst thing on the page — a promise made to a real person that
 * nothing keeps.
 *
 * So it validates the address, then hands it to the support mailbox as a
 * pre-filled mail draft. That genuinely reaches someone, and the button says
 * exactly that. When a list exists this becomes one POST and the copy changes.
 */
'use client';

import { useState } from 'react';
import { Icon } from './Icon';
import { Reveal } from './Reveal';
import { Button, Container } from './ui';
import { contact, info } from '@/lib/data';

/** Deliberately loose: the mail client is the real validator. */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!LOOKS_LIKE_EMAIL.test(value)) {
      setError('That does not look like an email address.');
      return;
    }
    setError(null);
    const subject = encodeURIComponent(`Keep me updated about ${info.name}`);
    const body = encodeURIComponent(
      `Please add ${value} to the QuickLocal updates list.\n\nSent from the QuickLocal site.`,
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }

  return (
    <Container className="py-16 sm:py-20">
      <Reveal>
        <div className="grid items-center gap-6 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] px-6 py-8 sm:px-9 lg:grid-cols-[1.2fr_1fr]">
          <div className="flex items-start gap-4">
            <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--color-tangerine-100)] text-[var(--color-tangerine-600)] sm:grid">
              <Icon name="mail" size={22} />
            </span>
            <div>
              <h2 className="text-[21px] font-extrabold tracking-tight sm:text-[24px]">
                Stay updated with {info.name}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">
                New categories, new neighbourhoods, and when the apps land in the stores.
              </p>
            </div>
          </div>

          <form onSubmit={submit} noValidate>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your email address"
                aria-label="Your email address"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className={`h-11 min-w-0 flex-1 rounded-xl border bg-[var(--color-cream-50)] px-3.5 text-[13px] outline-none transition focus:bg-[var(--surface)] ${
                  error
                    ? 'border-[var(--color-bad)]'
                    : 'border-[var(--line)] focus:border-[var(--color-tangerine-500)]'
                }`}
              />
              <Button type="submit" size="md" className="shrink-0">
                Subscribe
              </Button>
            </div>

            {error ? (
              <p id="newsletter-error" role="alert" className="mt-2 text-[11.5px] text-[var(--color-bad)]">
                {error}
              </p>
            ) : (
              <p className="mt-2 text-[11.5px] text-[var(--text-muted)]">
                Opens your mail app addressed to {contact.email} — no list is stored on this site.
              </p>
            )}
          </form>
        </div>
      </Reveal>
    </Container>
  );
}
