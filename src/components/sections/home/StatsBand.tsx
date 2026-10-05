import Reveal from '@/components/motion/Reveal';
import Aurora from '@/components/ui/Aurora';
import CountUp from '@/components/ui/CountUp';
import Icon from '@/components/ui/Icon';
import SectionHeader from '@/components/ui/SectionHeader';

/**
 * The four figures the platform commits to, on night: large gradient numbers
 * in glass tiles that count up as they arrive. Facts, not growth claims —
 * see stats.json for why.
 */
export default function StatsBand({
  section,
  stats,
}: {
  section: { eyebrow: string; title: string; accent: string };
  stats: { value: string; label: string; detail: string; icon: string }[];
}) {
  return (
    <section className="tone-night section relative overflow-clip">
      <Aurora variant="night" />
      <div className="shell relative">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} accent={section.accent} />
        <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal as="li" key={s.label} index={i}>
              <div className="glass stat-box flex h-full flex-col rounded-[var(--radius-card)] p-4 xs:p-5 sm:p-7">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-[#f7b16d]">
                  <Icon name={s.icon} size={21} strokeWidth={1.9} />
                </span>
                <CountUp value={s.value} className="t-stat text-gradient mt-7 block whitespace-nowrap" />
                <span className="mt-3 text-[14.5px] font-extrabold sm:text-[16px] tracking-[-0.02em] text-fg">{s.label}</span>
                <span className="mt-1 text-[13px] leading-snug sm:text-[14px] text-fg-2">{s.detail}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
