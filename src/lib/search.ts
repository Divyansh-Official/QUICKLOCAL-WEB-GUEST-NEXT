/**
 * The site's search index, built at build time from the same JSON the pages
 * render: every page, the sections worth landing on, the six aisles and every
 * answer in the Help Centre. Served as one static file (/search-index.json)
 * and fetched only when someone opens search.
 */
import searchJson from '@/data/search.json';
import { allRoutes, categories, faqAll, faqAudiences, fill, info, mainNav, navGroups, pages } from './data';

export type SearchKind = 'page' | 'section' | 'category' | 'faq';
export type SearchEntry = { kind: SearchKind; title: string; text: string; href: string; icon: string; keywords?: string };

type Meta = { title: string; description: string };
const PAGE_ICON: Record<string, string> = {
  '/': 'home',
  '/services': 'basket',
  '/events': 'calendar',
  '/how-it-works': 'route',
  '/try': 'basket',
  '/app': 'smartphone',
  '/safety': 'shield-check',
  '/about': 'heart',
  '/sell': 'store',
  '/deliver': 'bike',
  '/pricing': 'tag',
  '/for-business': 'users',
  '/help': 'info',
  '/contact': 'headset',
  '/get-the-app': 'download',
};

function pageMeta(href: string): Meta | null {
  if (href === '/') return { title: info.name, description: info.intro };
  const key = (searchJson.pageKeys as Record<string, string>)[href];
  const page = key ? (pages as unknown as Record<string, { meta?: Meta }>)[key] : undefined;
  return page?.meta ? { title: fill(page.meta.title), description: fill(page.meta.description) } : null;
}

export function buildSearchIndex(): SearchEntry[] {
  const keywords = searchJson.keywords as Record<string, string>;
  const audienceIcon = Object.fromEntries(faqAudiences.map(a => [a.key, a.icon]));

  const pageEntries = allRoutes.flatMap(href => {
    const meta = pageMeta(href);
    return meta ? [{ kind: 'page' as const, title: meta.title, text: meta.description, href, icon: PAGE_ICON[href] ?? 'arrow-right', keywords: keywords[href] }] : [];
  });

  const sections = searchJson.sections.map(s => ({ kind: 'section' as const, title: s.label, text: fill(s.text), href: s.href, icon: s.icon, keywords: s.keywords }));

  const aisles = categories.map(c => ({
    kind: 'category' as const,
    title: c.name,
    text: c.tagline,
    href: `/services/${c.slug}`,
    icon: c.icon,
    keywords: `${c.blurb} ${c.examples.join(' ')}`,
  }));

  const answers = faqAll.map(item => ({
    kind: 'faq' as const,
    title: item.q,
    text: item.a,
    href: `/help?q=${encodeURIComponent(item.q)}`,
    icon: audienceIcon[item.audience] ?? 'info',
  }));

  return [...pageEntries, ...sections, ...aisles, ...answers];
}

/** The shortcuts search shows before anything is typed. */
export function searchQuickLinks() {
  const named = [...navGroups.flatMap(g => g.items), ...mainNav.map(l => ({ ...l, icon: PAGE_ICON[l.href] ?? 'arrow-right' }))];
  return searchJson.quick.flatMap(href => {
    const hit = named.find(n => n.href === href);
    return hit ? [{ label: hit.label, href, icon: PAGE_ICON[href] ?? hit.icon }] : [];
  });
}
