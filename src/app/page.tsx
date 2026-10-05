/**
 * Home, top to bottom:
 *   HomeHero → Marquee → Statement → CategoryShelf → Bento → StatsBand →
 *   HowItWorks → OrderLifecycle → FeeEstimator → Audiences → RiderTiers →
 *   AboutSplit → Testimonials (only once real reviews exist) → AppBand →
 *   FAQ → Newsletter
 * Every string comes from home.json / ui.json, every figure from the
 * platform files, through fill().
 */
import AboutSplit from '@/components/sections/home/AboutSplit';
import AppBand from '@/components/sections/home/AppBand';
import Audiences from '@/components/sections/home/Audiences';
import Bento from '@/components/sections/home/Bento';
import CategoryShelf from '@/components/sections/home/CategoryShelf';
import FeeEstimator from '@/components/sections/home/FeeEstimator';
import HomeHero from '@/components/sections/home/HomeHero';
import HowItWorks from '@/components/sections/home/HowItWorks';
import Marquee from '@/components/sections/home/Marquee';
import Newsletter from '@/components/sections/home/Newsletter';
import OrderLifecycle from '@/components/sections/home/OrderLifecycle';
import RiderTiers from '@/components/sections/home/RiderTiers';
import StatsBand from '@/components/sections/home/StatsBand';
import Testimonials from '@/components/sections/home/Testimonials';
import FaqSection from '@/components/sections/shared/FaqSection';
import Statement from '@/components/sections/shared/Statement';
import {
  about,
  appStores,
  categories,
  contact,
  faq,
  features,
  feePercent,
  fees,
  fill,
  fillDeep,
  home,
  lifecycle,
  riders,
  stats,
  steps,
  testimonials,
  ui,
} from '@/lib/data';

export default function HomePage() {
  const h = fillDeep(home);
  const shelf = { previous: ui.common.previous, next: ui.common.next };

  return (
    <>
      <HomeHero
        hero={h.hero}
        categories={categories}
        phone={{
          steps: lifecycle.happy.slice(0, h.hero.phone.steps),
          chips: h.hero.phone.chips,
          fees: h.hero.phone.fees,
          labels: { eyebrow: h.hero.phone.eyebrow, eta: h.hero.phone.eta, shop: h.hero.phone.shop, order: h.hero.phone.orderLabel, basket: h.hero.phone.basket },
        }}
      />
      <Marquee items={h.marquee} />
      <Statement {...h.statement} />
      <CategoryShelf
        section={h.categories}
        items={categories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon, hue: c.hue, tagline: c.tagline, fee: feePercent(c.platformFeePercent) }))}
        labels={{ fee: ui.common.platformFee, explore: ui.common.explore, ...shelf }}
      />
      <Bento section={h.bento} tiles={h.bento.tiles} />
      <StatsBand section={h.stats} stats={stats} />
      <HowItWorks section={h.how} steps={steps} />
      <OrderLifecycle section={h.lifecycle} happy={lifecycle.happy} unhappy={lifecycle.unhappy} />
      <FeeEstimator fees={fees} copy={h.estimator} />
      <Audiences
        section={h.audiences}
        tabs={h.audiences.tabs.map(t => ({ ...t, items: features[t.key as keyof typeof features] as string[] }))}
      />
      <RiderTiers section={h.riders} payout={riders.payout} tiers={riders.tiers} documents={riders.documents} />
      <AboutSplit eyebrow={h.about.eyebrow} heading={about.heading} accent="local communities" paragraphs={about.paragraphs} cta={h.about.cta} />
      <Testimonials section={h.testimonials} items={testimonials} />
      <AppBand
        copy={h.app}
        stores={appStores}
        labels={{
          googleTop: ui.stores.googleTop,
          appleTop: ui.stores.appleTop,
          version: fill(ui.stores.version),
          soon: ui.common.soon,
          soonTitle: ui.common.comingSoon,
        }}
      />
      <FaqSection section={h.faq} items={faq} tone="tone-alt" />
      <Newsletter copy={h.newsletter} contactEmail={contact.email} />
    </>
  );
}
