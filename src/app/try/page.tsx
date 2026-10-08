/**
 * /try — a sample order, tapped through. The only page whose subject is the
 * product itself rather than a description of it: the steps, fees and codes
 * are the platform's; the shop and its prices are made up and say so.
 */
import type { Metadata } from 'next';
import PageHero from '@/components/sections/shared/PageHero';
import CtaBanner from '@/components/sections/shared/CtaBanner';
import SampleOrder from '@/components/sections/try/SampleOrder';
import { categories, deliveryRules, fillDeep, lifecycle, pages, ui } from '@/lib/data';
import { pageMetadata } from '@/lib/seo';

const copy = fillDeep(pages.try);

export const metadata: Metadata = pageMetadata(copy.meta, '/try');

export default function TryPage() {
  const items = copy.aisleItems as Record<string, { name: string; price: number }[]>;
  const aisles = categories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon, items: items[c.slug] ?? [] })).filter(a => a.items.length);
  const states = lifecycle.happy.map(s => ({ status: s.status, label: s.label }));
  const steps = copy.steps.map(step => {
    const state = 'status' in step && step.status ? lifecycle.happy.find(s => s.status === step.status) : undefined;
    return { key: step.key, status: state?.status, title: step.title, text: step.text || state?.detail || '', rule: step.rule };
  });

  return (
    <>
      <PageHero {...copy.hero} crumbs={[{ label: copy.meta.title }]} labels={{ home: ui.common.home, breadcrumb: ui.common.breadcrumb }} />

      <section className="tone-base pb-[var(--section-y)]">
        <div className="shell">
          <SampleOrder copy={copy.demo} steps={steps} aisles={aisles} rules={deliveryRules} states={states} />
        </div>
      </section>

      <CtaBanner {...copy.after} />
    </>
  );
}
