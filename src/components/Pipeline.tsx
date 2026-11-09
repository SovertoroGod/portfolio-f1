import { Reveal, SectionHeading } from "@/components/Reveal";
import { pipeline } from "@/site-data";

export function Pipeline() {
  return (
    <section id="pipeline" className="relative border-t border-line py-24 sm:py-32">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/assets/texture-carbon.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-4 sm:px-8">
        <SectionHeading
          index="04"
          eyebrow="Pit lane"
          title="From commit to live server"
          lead="I am comfortable doing this by hand on AWS Lightsail and DigitalOcean boxes, not only through a managed platform."
        />

        <ol className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {pipeline.map((stage, index) => (
            <Reveal key={stage.step} delay={index * 70} className="h-full">
              <li className="group relative flex h-full flex-col gap-4 bg-navy-950 p-6 transition-colors duration-300 hover:bg-navy-900">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl leading-none font-bold text-rb-red transition-colors duration-300 group-hover:text-rb-red-lift">
                    {stage.step}
                  </span>
                  <span
                    aria-hidden
                    className="h-px flex-1 origin-left bg-linear-to-r from-rb-red/70 to-transparent transition-transform duration-500 group-hover:scale-x-110"
                  />
                </div>
                <h3 className="text-lg leading-tight font-bold text-ice">{stage.title}</h3>
                <p className="text-sm leading-relaxed text-steel">{stage.detail}</p>
                {index < pipeline.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute top-1/2 -right-1 hidden h-2 w-2 -translate-y-1/2 rotate-45 bg-rb-yellow lg:block"
                  />
                ) : null}
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={120}>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[0.68rem] tracking-[0.2em] text-steel uppercase">
            <span>Git &amp; GitHub</span>
            <span>Docker</span>
            <span>Image registries</span>
            <span>AWS Lightsail</span>
            <span>DigitalOcean</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
