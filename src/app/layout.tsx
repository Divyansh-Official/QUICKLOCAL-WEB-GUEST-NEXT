/**
 * The shell every page renders inside: the field, the header, the page, the
 * footer, and on phones the tab bar. All copy arrives from JSON via lib/data.
 *
 * Manrope — the face the console and the mobile apps use — self-hosted by
 * next/font, so there is no request to a font CDN at runtime.
 */
import type { Metadata, Viewport } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import Backdrop from '@/components/layout/Backdrop';
import JsonLd from '@/components/layout/JsonLd';
import SiteFooter from '@/components/layout/SiteFooter';
import SiteHeader from '@/components/layout/SiteHeader';
import TabBar from '@/components/layout/TabBar';
import HeadScript from '@/components/motion/HeadScript';
import MorphProvider from '@/components/motion/MorphProvider';
import ScrollProgress from '@/components/motion/ScrollProgress';
import { contact, fill, footerColumns, info, isEnabled, mailHref, menuNav, nav, secondaryNav, site, siteUrl, telHref, ui } from '@/lib/data';

/* The variable font: one file, and every weight between 200 and 800 —
   headings sit at weights a static family does not ship. */
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${info.name} — ${info.headline.lead} ${info.headline.accent}`, template: `%s · ${info.name}` },
  description: info.intro,
  applicationName: info.name,
  keywords: ['local delivery', 'grocery delivery', contact.city, 'local vendors', 'delivery partner', info.name],
  openGraph: {
    title: `${info.name} — ${info.tagline}`,
    description: info.intro,
    type: 'website',
    locale: site.locale.openGraph,
    siteName: info.name,
  },
  twitter: { card: 'summary_large_image', title: `${info.name} — ${info.tagline}`, description: info.intro },
  icons: {
    icon: [
      { url: '/logo-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/logo-180.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: { capable: true, title: info.name, statusBarStyle: 'default' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: site.theme.lightThemeColor },
    { media: '(prefers-color-scheme: dark)', color: site.theme.darkThemeColor },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const contactProps = {
    phone: contact.phone,
    phoneHref: telHref(contact.phone),
    email: contact.email,
    emailHref: mailHref(contact.email),
    address: contact.address,
  };
  const showTheme = isEnabled('themeToggle');
  const theme = ui.theme;

  return (
    <html lang={site.locale.htmlLang} className={manrope.variable} suppressHydrationWarning>
      <head>
        <HeadScript fallback={site.theme.default} />
      </head>
      <body data-tabbar={isEnabled('tabBar') ? 'on' : 'off'}>
        <JsonLd
          schema={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: info.name,
            slogan: info.tagline,
            description: info.intro,
            url: siteUrl,
            logo: `${siteUrl}/logo-512.png`,
            email: contact.email,
            areaServed: `${contact.city}, ${contact.state}`,
            sameAs: contact.socials.map(s => s.href),
          }}
        />
        <a href="#main" className="skip-link">
          {ui.common.skipToContent}
        </a>
        <Backdrop />
        {isEnabled('scrollProgress') ? <ScrollProgress /> : null}

        <SiteHeader
          items={nav}
          all={menuNav}
          secondary={secondaryNav}
          cta={ui.header.cta}
          contact={contactProps}
          showTheme={showTheme}
          labels={{
            brand: `${info.name} — ${ui.common.home}`,
            menu: ui.common.menu,
            primaryNav: ui.common.primaryNav,
            openMenu: ui.common.openMenu,
            closeMenu: ui.common.closeMenu,
            ctaShort: ui.header.ctaShort,
            theme,
          }}
        />

        <main id="main" tabIndex={-1} className="min-h-[60vh] outline-none">
          {children}
        </main>
        <MorphProvider />

        <SiteFooter
          brandLabel={`${info.name} — ${ui.common.home}`}
          tagline={`${info.headline.lead} ${info.headline.accent}`}
          blurb={fill(ui.footer.blurb)}
          cta={ui.footer.cta}
          ctaTitle={fill(ui.footer.ctaTitle)}
          ctaText={fill(ui.footer.ctaText)}
          columns={footerColumns}
          contact={contactProps}
          socials={contact.socials}
          copyright={fill(ui.footer.copyright)}
          madeFor={ui.footer.madeFor}
          showTheme={showTheme}
          labels={{ contact: ui.footer.contactHeading, theme }}
        />

        {isEnabled('tabBar') ? <TabBar items={ui.tabBar.items} label={ui.tabBar.label} /> : null}
      </body>
    </html>
  );
}
