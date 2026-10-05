import Reveal from '@/components/motion/Reveal';

/**
 * An event's life in three beats on one line that draws itself across as the
 * row scrolls in (`.life-line`, a view timeline); a vertical line on phones.
 */
export default function EventLife({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <div className="relative">
      <span aria-hidden="true" className="absolute bottom-6 left-[21px] top-6 w-[2px] rounded-full bg-[color-mix(in_oklab,var(--fg)_9%,transparent)] md:bottom-auto md:left-[16%] md:right-[16%] md:top-[21px] md:h-[2px] md:w-auto">
        <span className="life-line block h-full w-full rounded-full bg-gradient-to-b from-[var(--grad-a)] to-accent md:bg-gradient-to-r" />
      </span>
      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-6">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.title} index={i} className="flex gap-5 md:flex-col md:items-center md:text-center">
            <span className="tnum grid h-11 w-11 flex-none place-items-center rounded-full bg-primary text-[15px] font-extrabold text-white shadow-[0_0_0_6px_var(--bg-2),0_8px_18px_-8px_rgb(240_134_38/0.9)]">{i + 1}</span>
            <span>
              <span className="t-headline block md:mt-5">{s.title}</span>
              <span className="t-small mt-1.5 block max-w-[18rem] md:mx-auto">{s.text}</span>
            </span>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
