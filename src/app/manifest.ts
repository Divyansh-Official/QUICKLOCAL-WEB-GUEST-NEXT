import type { MetadataRoute } from 'next';
import { info, navGroups, site } from '@/lib/data';

/**
 * The web app manifest: what the site becomes when someone adds it to their
 * home screen — its own icon and name, full screen, and shortcuts on a long
 * press of the icon.
 */
export default function manifest(): MetadataRoute.Manifest {
  const named = (href: string) => navGroups.flatMap(g => g.items).find(i => i.href === href);
  const shortcut = (href: string, fallback: string) => ({ name: named(href)?.label ?? fallback, url: href, icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }] });
  return {
    id: '/',
    name: info.name,
    short_name: info.name,
    description: info.intro,
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: site.theme.lightThemeColor,
    theme_color: site.theme.lightThemeColor,
    categories: ['shopping', 'food', 'lifestyle'],
    icons: [
      { src: '/logo-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
    shortcuts: [
      { name: 'Services', url: '/services', icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }] },
      { name: 'Events & Offers', url: '/events', icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }] },
      shortcut('/try', 'Try a Sample Order'),
      { name: 'Help', url: '/help', icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }] },
    ],
  };
}
