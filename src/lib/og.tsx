/**
 * Link previews for every page, drawn at build time from the same JSON the
 * pages render: the mark, the page's eyebrow, its headline with the accent
 * phrase in brand orange, and its one-line description.
 */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { contact, fill, info, pages } from './data';

export const ogSize = { width: 1200, height: 630 };

const HUES: Record<string, [string, string]> = {
  tangerine: ['rgba(240,134,38,0.34)', 'rgba(245,198,69,0.26)'],
  butter: ['rgba(245,198,69,0.42)', 'rgba(240,134,38,0.2)'],
  coral: ['rgba(232,96,70,0.32)', 'rgba(245,198,69,0.22)'],
  sky: ['rgba(88,140,220,0.3)', 'rgba(240,134,38,0.2)'],
  green: ['rgba(60,160,100,0.3)', 'rgba(245,198,69,0.22)'],
  ink: ['rgba(60,50,40,0.22)', 'rgba(240,134,38,0.24)'],
};

async function assets() {
  const font = (weight: number) => readFile(join(process.cwd(), 'node_modules', '@fontsource', 'manrope', 'files', `manrope-latin-${weight}-normal.woff`));
  /* Manrope's Latin subset has no ₹; Next's bundled Geist supplies it. */
  const rupee = readFile(join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'Geist-Regular.ttf'));
  const logo = readFile(join(process.cwd(), 'public', 'logo-180.png'));
  const [regular, bold, heavy, fallback, mark] = await Promise.all([font(500), font(700), font(800), rupee, logo]);
  return {
    logo: `data:image/png;base64,${mark.toString('base64')}`,
    fonts: [
      { name: 'Manrope', data: regular, weight: 500 as const, style: 'normal' as const },
      { name: 'Manrope', data: bold, weight: 700 as const, style: 'normal' as const },
      { name: 'Manrope', data: heavy, weight: 800 as const, style: 'normal' as const },
      { name: 'Geist', data: fallback, weight: 400 as const, style: 'normal' as const },
    ],
  };
}

export async function ogCard({ eyebrow, title, accent, text, chips = [], hue = 'tangerine' }: { eyebrow: string; title: string; accent?: string; text: string; chips?: string[]; hue?: string }) {
  const { logo, fonts } = await assets();
  const cut = accent && title.endsWith(accent) ? title.length - accent.length : title.length;
  const lead = title.slice(0, cut).trim();
  const tail = title.slice(cut).trim();
  const [a, b] = HUES[hue] ?? HUES.tangerine;
  const big = title.length > 34 ? 76 : 92;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          backgroundColor: '#fdfaf6',
          backgroundImage: `radial-gradient(circle at 92% 0%, ${a}, transparent 52%), radial-gradient(circle at 0% 100%, ${b}, transparent 50%)`,
          fontFamily: 'Manrope',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>, not next/image */}
            <img src={logo} width={60} height={60} alt="" style={{ borderRadius: 17 }} />
            <div style={{ display: 'flex', fontSize: 32, fontWeight: 800, letterSpacing: -1, color: '#1a1713' }}>
              QUICK<span style={{ color: '#d9690f' }}>LOCAL</span>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#b85a0c' }}>{eyebrow}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: big, fontWeight: 800, lineHeight: 1.04, letterSpacing: -3.2, color: '#1a1713', maxWidth: 1040 }}>
            {lead ? <span style={{ marginRight: 22 }}>{lead}</span> : null}
            {tail ? <span style={{ color: '#d9690f' }}>{tail}</span> : null}
          </div>
          <div style={{ display: 'flex', fontSize: 28, lineHeight: 1.4, marginTop: 24, color: '#575047', maxWidth: 980 }}>{text.length > 150 ? `${text.slice(0, text.lastIndexOf(' ', 147))}…` : text}</div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {[...chips, `${contact.city} · ${info.name}`].map(c => (
            <div
              key={c}
              style={{ display: 'flex', padding: '10px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.82)', border: '1px solid rgba(60,50,40,0.1)', fontSize: 22, fontWeight: 700, color: '#1a1713' }}>
              {c}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...ogSize, fonts },
  );
}

type PageCopy = { meta: { title: string; description: string }; hero?: { eyebrow?: string; title?: string; accent?: string } };

/** The preview for a page in pages.json, by its key. */
export function pageOgCard(key: keyof typeof pages) {
  const p = pages[key] as unknown as PageCopy;
  return ogCard({
    eyebrow: fill(p.hero?.eyebrow ?? p.meta.title),
    title: fill(p.hero?.title ?? p.meta.title),
    accent: p.hero?.accent ? fill(p.hero.accent) : undefined,
    text: fill(p.meta.description),
  });
}

export const pageOgAlt = (key: keyof typeof pages) => `${fill((pages[key] as unknown as PageCopy).meta.title)} — ${info.name}`;
