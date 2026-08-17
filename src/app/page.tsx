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
 */
import { Hero } from '@/components/Hero';
import { Categories } from '@/components/Categories';
import { Newsletter } from '@/components/Newsletter';
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
      <WhyAndAbout />
      <Testimonials />
      <AppBand />
      <Newsletter />
    </>
  );
}
