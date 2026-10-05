import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { contact, fees, info, inr, tokens } from '@/lib/data';

/**
 * The link preview for WhatsApp, iMessage, X and the rest: the promise, the
 * mark, and three figures the platform commits to — generated at build time
 * from the same JSON as the site, so it can never quote a stale fee.
 */
export const alt = `${info.name} — ${info.headline.lead} ${info.headline.accent}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public', 'logo-180.png'));
  /* Manrope, the site's face, so the card reads like the page it links to. */
  const font = (weight: number) =>
    readFile(join(process.cwd(), 'node_modules', '@fontsource', 'manrope', 'files', `manrope-latin-${weight}-normal.woff`));
  /* Manrope's Latin subset has no ₹; Next's bundled Geist supplies it. */
  const rupee = readFile(join(process.cwd(), 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'Geist-Regular.ttf'));
  const [regular, bold, heavy, fallback] = await Promise.all([font(500), font(700), font(800), rupee]);
  const src = `data:image/png;base64,${logo.toString('base64')}`;
  const facts = [
    `${info.delivery.defaultRadiusKm} km radius`,
    `${info.delivery.maxHours} hrs, maximum`,
    `${inr(fees.baseFeeInr)} base delivery`,
    `From ${tokens.lowestFee}% platform fee`,
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '68px 80px',
          backgroundColor: '#fdfaf6',
          backgroundImage:
            'radial-gradient(circle at 92% 0%, rgba(240,134,38,0.32), transparent 52%), radial-gradient(circle at 0% 100%, rgba(245,198,69,0.28), transparent 50%)',
          fontFamily: 'Manrope',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={src} width={72} height={72} alt="" style={{ borderRadius: 20 }} />
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 800, letterSpacing: -1, color: '#1a1713' }}>
            QUICK<span style={{ color: '#d9690f' }}>LOCAL</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3.5, color: '#1a1713' }}>
            {info.headline.lead}
          </div>
          <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3.5, color: '#d9690f' }}>
            {info.headline.accent}
          </div>
          <div style={{ display: 'flex', fontSize: 32, marginTop: 22, color: '#575047' }}>
            {info.slogan} · {contact.city}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14 }}>
          {facts.map(f => (
            <div
              key={f}
              style={{
                display: 'flex',
                padding: '12px 22px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(60,50,40,0.1)',
                fontSize: 24,
                fontWeight: 700,
                color: '#1a1713',
              }}>
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Manrope', data: regular, weight: 500, style: 'normal' },
        { name: 'Manrope', data: bold, weight: 700, style: 'normal' },
        { name: 'Manrope', data: heavy, weight: 800, style: 'normal' },
        { name: 'Geist', data: fallback, weight: 400, style: 'normal' },
      ],
    },
  );
}
