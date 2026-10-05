/**
 * /get-the-app — where "become a vendor" and "become a rider" land. Both sign
 * up in the app, because both need document verification. Store buttons say
 * Soon until app.json marks a listing available.
 */
import type { Metadata } from 'next';
import Phone3D from '@/components/art/Phone3D';
import Reveal from '@/components/motion/Reveal';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import PageHero from '@/components/sections/shared/PageHero';
import Icon from '@/components/ui/Icon';
import Slab3D from '@/components/ui/Slab3D';
import StoreBadge from '@/components/ui/StoreBadge';
import { appRoles, appStores, contact, fill, fillDeep, home, lifecycle, pages, ui } from '@/lib/data';

const copy = fillDeep(pages.getTheApp);
const phone = fillDeep(home.hero.phone);

export const metadata: Metadata = { title: copy.meta.title, description: copy.meta.description };

const HUE: Record<string, string> = { vendor: 'butter', partner: 'ink' };

export default function GetTheAppPage() {
  const badges = (
    <>
      <StoreBadge listing={appStores.android} icon="play" top={ui.stores.googleTop} soon={ui.common.soon} soonTitle={ui.common.comingSoon} />
      <StoreBadge listing={appStores.ios} icon="apple" top={ui.stores.appleTop} soon={ui.common.soon} soonTitle={ui.common.comingSoon} />
    </>
  );

  return (
    <>
      <PageHero
        {...copy.hero}
        crumbs={[{ label: copy.meta.title }]}
        labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }}
        art={
          <div className="w-full max-w-[420px]">
            <Phone3D
              steps={lifecycle.happy.slice(0, phone.steps)}
              chips={[]}
              fees={phone.fees}
              labels={{ eyebrow: phone.eyebrow, eta: phone.eta, shop: phone.shop, order: phone.orderLabel, basket: phone.basket }}
            />
          </div>
        }>
        {badges}
      </PageHero>

      <section className="tone-base -mt-6 pb-4">
        <p className="shell t-small text-center lg:text-left">
          {fill(ui.stores.version)} · {copy.hero.question}{' '}
          <a href={`mailto:${contact.email}`} className="font-bold text-primary-ink hover:underline">
            {contact.email}
          </a>
        </p>
      </section>

      <section className="tone-base section">
        <div className="shell grid gap-5 lg:grid-cols-2">
          {appRoles.map((r, i) => (
            <Reveal key={r.key} index={i} className="group glass glass-raised relative scroll-mt-28 overflow-hidden rounded-[var(--radius-panel)]" id={r.key}>
              <div className="flex items-center justify-center bg-[color-mix(in_oklab,var(--fg)_4%,transparent)] py-8">
                <Slab3D icon={r.icon} hue={HUE[r.key] ?? 'tangerine'} size={180} />
              </div>
              <div className="p-7 sm:p-9">
                <h2 className="t-title">{r.title}</h2>
                <p className="t-body mt-3">{r.blurb}</p>
                <ul className="mt-6 space-y-3">
                  {r.highlights.map(h => (
                    <li key={h} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full bg-ok text-white">
                        <Icon name="check" size={13} strokeWidth={2.8} />
                      </span>
                      <span className="text-[15.5px] leading-snug text-fg">{h}</span>
                    </li>
                  ))}
                </ul>
                <h3 className="mt-9 text-[12px] font-extrabold uppercase tracking-[0.14em] text-primary-ink">{copy.onboardingTitle}</h3>
                <ol className="relative mt-5 space-y-5">
                  <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-[2px] rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)]" />
                  {r.steps.map((s, n) => (
                    <li key={s} className="relative flex items-start gap-4">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-fg text-[13px] font-extrabold text-bg shadow-[0_6px_14px_-6px_rgb(0_0_0/0.5)]">{n + 1}</span>
                      <span className="pt-1 text-[15px] leading-snug text-fg-2">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner eyebrow={copy.banner.eyebrow} title={copy.banner.title} accent={copy.banner.accent} text={copy.banner.text}>
        {badges}
      </CtaBanner>
    </>
  );
}
