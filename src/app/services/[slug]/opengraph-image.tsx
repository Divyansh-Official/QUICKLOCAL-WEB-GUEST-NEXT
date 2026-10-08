import { categories, fill, getCategory, info, ui } from '@/lib/data';
import { ogCard, ogSize } from '@/lib/og';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = `${info.name} — every aisle`;

export function generateStaticParams() {
  return categories.map(c => ({ slug: c.slug }));
}

/** An aisle's preview: its name and promise, in its own colour, with what it sells. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug) ?? categories[0];
  return ogCard({
    eyebrow: 'Aisle',
    title: `${c.name}.`,
    accent: `${c.name}.`,
    text: `${c.tagline} ${c.blurb}.`,
    chips: [...c.examples.slice(0, 2), fill(ui.common.deliveryFrom)],
    hue: c.hue,
  });
}
