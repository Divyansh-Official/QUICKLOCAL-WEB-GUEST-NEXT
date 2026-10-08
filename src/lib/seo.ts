/**
 * Per-page metadata. A page that sets only a title inherits the layout's Open
 * Graph block — so every shared link would preview as the home page. This
 * gives each page its own title, description, canonical URL and preview text.
 */
import type { Metadata } from 'next';
import { info, site } from './data';

export function pageMetadata(meta: { title: string; description: string }, path: string): Metadata {
  const title = `${meta.title} · ${info.name}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: { title, description: meta.description, url: path, siteName: info.name, type: 'website', locale: site.locale.openGraph },
    twitter: { card: 'summary_large_image', title, description: meta.description },
  };
}
