import { Reveal, SectionHeading } from "@/components/Reveal";
import { stints } from "@/site-data";
import { formatDate, stintLength } from "@/lib/format";

export function Stints() {
  return (
    <section id="stints" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="Race history"
          title="Stints on the board"
          lead="Where I have been running, and for how long."
        />

        <ol className="mt-14 border-l border-line pl-0">
          {stints.map((stint, index) => {
            const live = stint.to === null;
            return (
              <Reveal key={stint.team} delay={index * 90}>
                <li className="group relative pb-14 pl-8 last:pb-0 sm:pl-12">
                  <span
                    aria-hidden
                    className={`absolute top-2 -left-[7px] size-3.5 rotate-45 border transition-colors duration-300 ${
                      live
                        ? "border-rb-yellow bg-rb-yellow"
                        : "border-rb-red bg-navy-950 group-hover:bg-rb-red"
                    }`}
                  />
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.68rem] tracking-[0.2em] uppercase">
                    <span className="text-rb-yellow">
                      {formatDate(stint.from)} — {stint.to ? formatDate(stint.to) : "Present"}
                    </span>
                    <span className="text-steel">{stintLength(stint.from, stint.to)} on track</span>
                    {live ? (
                      <span className="inline-flex items-center gap-2 border border-rb-red/70 px-2 py-1 text-rb-red-lift">
                        <span aria-hidden className="telemetry-dot size-1.5 rounded-full bg-rb-red-lift" />
                        Current seat
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 text-3xl leading-tight font-bold text-ice sm:text-4xl">
                    {stint.team}
                  </h3>
                  <p className="mt-1.5 font-display text-base tracking-[0.14em] text-steel uppercase">
                    {stint.role}
                  </p>
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-ice/85">{stint.scope}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {stint.stack.map((item) => (
                      <li
                        key={item}
                        className="border border-line bg-navy-900/80 px-3 py-1.5 font-display text-[0.78rem] tracking-[0.08em] text-ice/85"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              </Reveal>
            );
          })}
        </ol>

        <Reveal delay={200}>
          <p className="mt-12 max-w-2xl border-l-2 border-rb-red pl-5 font-display text-lg text-ice/90">
            Full-time since {formatDate(stints[stints.length - 1].from)}. Currently at {stints[0].team}
            <br className="hidden sm:block" /> — seat taken {formatDate(stints[0].from)}.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
