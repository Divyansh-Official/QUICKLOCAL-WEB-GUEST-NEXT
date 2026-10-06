'use client';

/**
 * One platform, three sides: a segmented control swaps between what a
 * customer, a vendor and a rider get — each list from features.json, each
 * capability a module the backend implements. The panel cross-fades and its
 * rows rise in one after another; the 3D slab turns to face the new side.
 */
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/motion/Reveal';
import SectionHeader from '@/components/ui/SectionHeader';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Slab3D from '@/components/ui/Slab3D';

type Tab = { key: string; label: string; icon: string; title: string; cta: { label: string; href: string }; items: string[] };
const HUE: Record<string, string> = { customers: 'tangerine', vendors: 'butter', partners: 'ink' };

export default function Audiences({ section, tabs }: { section: { eyebrow: string; title: string; accent: string }; tabs: Tab[] }) {
  const [key, setKey] = useState(tabs[0].key);
  const tab = tabs.find(t => t.key === key) ?? tabs[0];

  return (
    <section className="tone-alt section">
      <div className="shell">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} />
        <Reveal className="mt-10 flex justify-center">
          <SegmentedControl
            mode="tabs"
            idPrefix="aud"
            label={section.title}
            value={key}
            onChange={setKey}
            items={tabs.map(t => ({ value: t.key, label: t.label, icon: t.icon }))}
          />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-[1080px]">
          <div
            id="aud-panel"
            role="tabpanel"
            aria-labelledby={`aud-tab-${tab.key}`}
            className="glass glass-raised grid items-center gap-8 overflow-hidden rounded-[var(--radius-panel)] p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12">
            <div key={tab.key}>
              <h3 className="enter t-title max-w-xl">{tab.title}</h3>
              <ul className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2 sm:gap-y-3.5">
                {tab.items.map((item, i) => (
                  <li key={item} className="enter flex items-start gap-3" style={{ ['--d' as string]: 60 + i * 50 }}>
                    <span className="mt-0.5 grid h-5 w-5 flex-none sm:h-6 sm:w-6 place-items-center rounded-full bg-ok text-white">
                      <Icon name="check" size={13} strokeWidth={2.8} />
                    </span>
                    <span className="text-[13.5px] leading-snug text-fg sm:text-[15.5px]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="enter mt-8" style={{ ['--d' as string]: 360 }}>
                <Button href={tab.cta.href} icon="arrow-right">
                  {tab.cta.label}
                </Button>
              </div>
            </div>
            <div className="hidden justify-center md:flex">
              <Slab3D key={tab.key} icon={tab.icon} hue={HUE[tab.key] ?? 'tangerine'} size={220} active className="enter-scale" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
