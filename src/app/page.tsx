/**
 * Home, top to bottom:
 *   HomeHero → Marquee → QuickJump (phones) → Statement → CategoryShelf → EventsTeaser → Bento → StatsBand →
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
import EventsTeaser from '@/components/sections/home/EventsTeaser';
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
import QuickJump from '@/components/ui/QuickJump';
import {
  about,
  appStores,
  categories,
  contact,
  faq,
  features,
  deliveryRules,
  fill,
  fillDeep,
  home,
  lifecycle,
  pages,
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
      <QuickJump items={h.jump} label={ui.common.onThisPage} />
      <Statement {...h.statement} />
      <div id="shops" className="jump-target">
        <CategoryShelf
          section={h.categories}
          items={categories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon, hue: c.hue, tagline: c.tagline, badge: fill(ui.common.deliveryFrom), examples: c.examples }))}
          labels={{ explore: ui.common.explore, ...shelf }}
        />
      </div>
      <div id="events" className="jump-target">
        <EventsTeaser copy={h.events} screen={fillDeep(pages.events.rail.screen)} />
      </div>
      <div id="why" className="jump-target">
        <Bento section={h.bento} tiles={h.bento.tiles} />
      </div>
      <StatsBand section={h.stats} stats={stats} />
      <div id="how" className="jump-target">
        <HowItWorks section={h.how} steps={steps} />
      </div>
      <div id="tracking" className="jump-target">
        <OrderLifecycle section={h.lifecycle} happy={lifecycle.happy} unhappy={lifecycle.unhappy} />
      </div>
      <div id="costs" className="jump-target">
        <FeeEstimator fees={deliveryRules} copy={h.estimator} />
      </div>
      <div id="for-you" className="jump-target">
        <Audiences
          section={h.audiences}
          tabs={h.audiences.tabs.map(t => ({ ...t, items: features[t.key as keyof typeof features] as string[] }))}
        />
      </div>
      <div id="riders" className="jump-target">
        <RiderTiers section={h.riders} tiers={riders.tiers} documents={riders.documents.everyone.filter(d => !d.type.startsWith('VEHICLE_'))} />
      </div>
      <AboutSplit eyebrow={h.about.eyebrow} heading={about.heading} accent="local communities" paragraphs={about.paragraphs} cta={h.about.cta} more={ui.common.readMore} less={ui.common.readLess} />
      <Testimonials section={h.testimonials} items={testimonials} />
      <div id="app" className="jump-target">
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
      </div>
      <div id="faq" className="jump-target">
        <FaqSection section={h.faq} items={faq} tone="tone-alt" phoneLimit={4} />
      </div>
      <Newsletter copy={h.newsletter} contactEmail={contact.email} />
    </>
  );
}
