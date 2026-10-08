import type { MetadataRoute } from 'next';
import { allRoutes, categories, siteUrl } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const aisles = categories.map(c => `/services/${c.slug}`);
  return [
    ...allRoutes.filter(href => !aisles.includes(href)).map(href => ({ url: `${siteUrl}${href === '/' ? '' : href}`, lastModified: now, priority: href === '/' ? 1 : 0.8 })),
    ...aisles.map(href => ({ url: `${siteUrl}${href}`, lastModified: now, priority: 0.7 })),
  ];
}
