import type { MetadataRoute } from 'next';
import { allNav, categories, secondaryNav, siteUrl } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...[...allNav, ...secondaryNav].map(item => ({ url: `${siteUrl}${item.href === '/' ? '' : item.href}`, lastModified: now, priority: item.href === '/' ? 1 : 0.8 })),
    ...categories.map(c => ({ url: `${siteUrl}/services/${c.slug}`, lastModified: now, priority: 0.7 })),
  ];
}
