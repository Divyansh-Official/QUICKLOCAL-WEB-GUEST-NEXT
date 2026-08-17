/**
 * The shell every page renders inside.
 *
 * Manrope, the same face the console and the mobile apps use, loaded through
 * next/font so it is self-hosted and there is no render-blocking request to a
 * font CDN — and no third party learning who visited the site.
 *
 * The header is fixed, so the body carries top padding equal to its height
 * rather than each page remembering to leave room.
 */
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { contact, info } from '@/lib/data';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${info.name} — ${info.headline.lead} ${info.headline.accent}`,
    template: `%s · ${info.name}`,
  },
  description: info.intro,
  keywords: ['local delivery', 'grocery delivery', contact.city, 'local vendors', info.name],
  openGraph: {
    title: `${info.name} — ${info.tagline}`,
    description: info.intro,
    type: 'website',
    locale: 'en_IN',
    images: [{ url: '/logo-512.png', width: 512, height: 512, alt: `${info.name} logo` }],
  },
  // The same artwork as the console tab, the iOS home screen and any install
  // prompt — one mark across every surface of the product.
  icons: {
    icon: [
      { url: '/logo-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/logo-180.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#f08626',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={manrope.variable}>
      <body className="min-h-screen font-sans antialiased">
        {/* First stop for a keyboard, before six nav links. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[var(--color-ink-950)] focus:px-4 focus:py-2.5 focus:text-[13px] focus:font-bold focus:text-white">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
