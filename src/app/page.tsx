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
 * The fee estimator follows How it works, because it answers the question that
 * section raises — the steps say an order reaches you, and the next thing
 * anyone wants to know is what it costs and who pays for what.
 */
import { Hero } from '@/components/Hero';
import { Categories } from '@/components/Categories';
import { Newsletter } from '@/components/Newsletter';
import { FeeEstimator } from '@/components/FeeEstimator';
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
      <FeeEstimator />
      <WhyAndAbout />
      <Testimonials />
      <AppBand />
      <Newsletter />
    </>
  );
}
