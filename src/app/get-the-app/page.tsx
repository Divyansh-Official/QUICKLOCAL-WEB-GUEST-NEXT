/**
 * Get the app — where "become a vendor" and "become a delivery partner" land.
 *
 * ── ONE PAGE, TWO ROLES, ONE ACTION ─────────────────────────────────────────
 * Signing up as a vendor or a rider happens IN THE APP, because both need
 * document verification and neither can be completed on a static marketing
 * site. So the honest destination for both buttons is the same: here is the
 * app, here is what your onboarding looks like, install it and start.
 *
 * A link that names a role targets it by HASH — /get-the-app#partner — rather
 * than a query the server reads. Reading searchParams would opt the route out
 * of static rendering for the sake of reordering two cards, and a hash does the
 * same job with the browser's own scrolling, no JavaScript and no server.
 *
 * ── THE STORE BUTTONS DO NOT LIE ────────────────────────────────────────────
 * `app.json` carries `available: false` for both listings, so they render as a
 * disabled control that says Coming soon rather than an anchor to a store page
 * that does not exist. When the listings go live, the flag and the URL are the
 * only things that change.
 */
import type { Metadata } from 'next';
import { Icon, type IconName } from '@/components/Icon';
import { Reveal } from '@/components/Reveal';
import { DownloadScene, RiderScene, ShopScene } from '@/components/Scenes';
import { Card, Container, IconTile } from '@/components/ui';
import { appRoles, appStores, contact, info } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Get the App',
  description: `Sell on ${info.name} or deliver for it — both start in the app. Here is what onboarding looks like for each.`,
};

export default function GetTheAppPage() {
  return (
    <>
      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+36px)] pb-14">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-[10%] -top-[30%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(240,134,38,.20),transparent_66%)]" />
        </div>

        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Reveal anim="scale">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-tangerine-300)] bg-[var(--color-tangerine-100)] px-3 py-1.5 text-[11.5px] font-bold text-[var(--color-tangerine-700)]">
                  <Icon name="sparkle" size={13} />
                  Partner onboarding
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-5 text-[34px] font-extrabold leading-[1.08] tracking-tight sm:text-[46px]">
                  It all starts in the{' '}
                  <span className="text-[var(--color-tangerine-500)]">app</span>.
                </h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-4 max-w-[480px] text-[14.5px] leading-relaxed text-[var(--color-ink-500)]">
                  Selling or delivering both need document verification, so both
                  are done in the app rather than on a web form. Install it, pick your
                  role, and you are a few screens from live.
                </p>
              </Reveal>

              <Reveal delay={220}>
                <div className="mt-7 flex flex-wrap gap-3">
                  <StoreButton listing={appStores.android} icon="play" top="Get it on" />
                  <StoreButton listing={appStores.ios} icon="apple" top="Download on the" />
                </div>
              </Reveal>

              <Reveal delay={280}>
                <p className="mt-4 text-[12px] text-[var(--text-muted)]">
                  Questions first?{' '}
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-semibold text-[var(--color-tangerine-600)] hover:underline">
                    {contact.email}
                  </a>
                </p>
              </Reveal>
            </div>

            <Reveal anim="left" delay={200}>
              <DownloadScene className="mx-auto w-full max-w-[300px]" />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ── the two tracks ───────────────────────────────────────────────── */}
      <Container className="pb-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {appRoles.map((r, i) => (
            <Reveal key={r.key} delay={i * 120}>
              <Card id={r.key} className="flex h-full scroll-mt-28 flex-col overflow-hidden p-0">
                <div className="relative bg-[var(--color-cream-100)] px-6 pt-6">
                  {r.key === 'vendor' ? (
                    <ShopScene className="mx-auto h-[130px] w-full max-w-[240px]" />
                  ) : (
                    <RiderScene className="mx-auto h-[130px] w-full max-w-[280px]" />
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <IconTile name={r.icon as IconName} size={44} />
                    <h2 className="text-[19px] font-extrabold tracking-tight">{r.title}</h2>
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-muted)]">
                    {r.blurb}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {r.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--color-ok)] text-white">
                          <Icon name="check" size={11} strokeWidth={2.8} />
                        </span>
                        <span className="text-[13px] leading-relaxed text-[var(--color-ink-700)]">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-7 text-[11.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-tangerine-600)]">
                    How onboarding goes
                  </h3>
                  <ol className="mt-3 flex-1 space-y-0">
                    {r.steps.map((step, n) => (
                      <li key={step} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--color-ink-950)] text-[11px] font-extrabold text-white">
                            {n + 1}
                          </span>
                          {n < r.steps.length - 1 ? (
                            <span className="my-1 w-[2px] flex-1 rounded-full bg-[var(--color-cream-200)]" />
                          ) : null}
                        </div>
                        <p className={`text-[12.5px] leading-relaxed text-[var(--color-ink-500)] ${
                          n < r.steps.length - 1 ? 'pb-3.5' : ''
                        }`}>
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      {/* ── closing band ─────────────────────────────────────────────────── */}
      <Container className="py-14">
        <Reveal anim="scale">
          <div className="relative overflow-hidden rounded-[26px] bg-[var(--color-ink-950)] px-6 py-11 text-center sm:px-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[6%] -top-[50%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(240,134,38,.28),transparent_66%)]"
            />
            <div className="relative">
              <h2 className="text-[24px] font-extrabold tracking-tight text-white sm:text-[29px]">
                Verified once, then you are live
              </h2>
              <p className="mx-auto mt-3 max-w-[480px] text-[13.5px] leading-relaxed text-[var(--color-cream-300)]">
                Every shop and every rider clears document checks before taking an order — which is
                the reason a customer can trust the one that turns up.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <StoreButton listing={appStores.android} icon="play" top="Get it on" onDark />
                <StoreButton listing={appStores.ios} icon="apple" top="Download on the" onDark />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}

/**
 * A store button that is a link when the listing exists and a labelled,
 * disabled control when it does not — never an anchor to a page that 404s.
 */
function StoreButton({
  listing,
  icon,
  top,
  onDark = false,
}: {
  listing: { available: boolean; url: string | null; store: string };
  icon: IconName;
  top: string;
  onDark?: boolean;
}) {
  const shell = onDark
    ? 'border-white/15 bg-white/6 text-white hover:border-[var(--color-tangerine-500)] hover:bg-[var(--color-tangerine-500)]'
    : 'border-[var(--line)] bg-[var(--surface)] text-[var(--color-ink-900)] hover:border-[var(--color-tangerine-300)] hover:bg-[var(--color-cream-100)]';
  const sub = onDark ? 'text-[var(--color-cream-300)]' : 'text-[var(--text-muted)]';

  const inner = (
    <>
      <Icon name={icon} size={23} />
      <span className="text-left leading-tight">
        <span className={`block text-[9.5px] uppercase tracking-wide ${sub}`}>{top}</span>
        <span className="block text-[13.5px] font-bold">{listing.store}</span>
      </span>
      {!listing.available ? (
        <span className="ml-1 rounded-md bg-[var(--color-tangerine-500)] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-white">
          Soon
        </span>
      ) : null}
    </>
  );

  if (listing.available && listing.url) {
    return (
      <a
        href={listing.url}
        target="_blank"
        rel="noreferrer noopener"
        className={`ql-glint inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 transition ${shell}`}>
        {inner}
      </a>
    );
  }

  return (
    <span
      title={`${listing.store} listing coming soon`}
      aria-disabled="true"
      className={`inline-flex cursor-default items-center gap-2.5 rounded-xl border px-4 py-2.5 opacity-90 ${shell}`}>
      {inner}
    </span>
  );
}
