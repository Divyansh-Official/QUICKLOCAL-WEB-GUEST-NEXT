/**
 * Home.
 *
 * The sections in the order the design has them. Two differences, both because
 * the data does not support the mock:
 *
 *   · The stats band carries platform facts rather than growth numbers — see
 *     stats.json for why.
 *   · Testimonials render nothing while there are no reviews, so the page goes
 *     straight from the about block to the app band.
 *
 * The three added sections sit in the order the questions get asked. How it
 * works says an order reaches you; the lifecycle names every state it passes
 * through on the way, including the three that are not a happy ending; the
 * estimator says what it costs and who pays for what; and the rider tiers
 * answer the same question from the other side of the transaction.
 */
import { Hero } from '@/components/Hero';
import { Categories } from '@/components/Categories';
import { Newsletter } from '@/components/Newsletter';
import { FeeEstimator } from '@/components/FeeEstimator';
import { OrderLifecycle } from '@/components/OrderLifecycle';
import { RiderTiers } from '@/components/RiderTiers';
import {
  AppBand,
  HowItWorks,
  StatsBand,
  Testimonials,
  TrustStrip,
  WhyAndAbout,
} from '@/components/sections';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Categories />
      <StatsBand />
      <HowItWorks />
      <OrderLifecycle />
      <FeeEstimator />
      <RiderTiers />
      <WhyAndAbout />
      <Testimonials />
      <AppBand />
      <Newsletter />
    </>
  );
}
