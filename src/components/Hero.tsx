import { HeroScene } from "@/three/HeroScene";
import { Cta, GitHubMark } from "@/components/Cta";
import { marqueeSkills, profile, heroReadout } from "@/site-data";
import { useProgress } from "@react-three/drei";
import { ArrowDown, Download, Gauge } from "lucide-react";

function ModelStatus() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="absolute right-4 bottom-24 z-20 w-44 sm:right-8 sm:w-56">
      <p className="text-right font-mono text-[0.62rem] tracking-[0.24em] text-rb-yellow uppercase">
        Loading the RB22 · {Math.round(progress)}%
      </p>
      <div className="mt-2 h-[3px] w-full bg-line">
        <div
          className="h-full bg-linear-to-r from-rb-red to-rb-yellow transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Scrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        background:
          "radial-gradient(120% 100% at 12% 42%, rgba(2,5,15,0.92) 0%, rgba(2,5,15,0.68) 34%, rgba(2,5,15,0.1) 62%, transparent 78%), linear-gradient(to bottom, rgba(2,5,15,0.85) 0%, transparent 22%, transparent 62%, rgba(2,5,15,0.92) 100%)",
      }}
    />
  );
}

function Readout() {
  return (
    <dl className="grid grid-cols-2 gap-px border border-line bg-line/60 sm:grid-cols-4 lg:grid-cols-2">
      {heroReadout.map((item) => (
        <div key={item.label} className="bg-navy-950/85 px-4 py-3 backdrop-blur-sm">
          <dt className="font-mono text-[0.6rem] tracking-[0.2em] text-steel uppercase">{item.label}</dt>
          <dd className="mt-1 flex items-center gap-2 font-display text-sm text-ice sm:text-[0.95rem]">
            <span
              aria-hidden
              className="telemetry-dot size-1.5 shrink-0 rounded-full bg-rb-yellow"
            />
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Hero({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <section id="top" className="relative isolate min-h-[100svh] overflow-hidden">
      <HeroScene reducedMotion={reducedMotion} />
      <Scrim />
      <ModelStatus />

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-between px-4 pt-24 pb-32 sm:px-8">
        <div className="flex flex-1 items-center">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-3">
              <Gauge className="size-4 text-rb-red" aria-hidden />
              {profile.role}
            </p>

            <h1 className="mt-5 font-display font-bold leading-[0.82] tracking-[-0.02em] text-[clamp(3.2rem,9.5vw,7.5rem)]">
              <span className="block text-ice drop-shadow-[0_6px_30px_rgba(2,5,15,0.9)]">Shine</span>
              <span
                className="block text-transparent"
                style={{ WebkitTextStroke: "2px var(--ice)" }}
              >
                Wai Yan
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed font-medium text-ice/90">
              {profile.tagline} Full-stack work from React interfaces to NestJS services, databases,
              containers and the server they end up on.
            </p>

            <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
              <Cta href="#stack" className="bg-rb-red hover:bg-rb-red-lift">
                See the setup
              </Cta>
              <Cta
                href={profile.github}
                variant="outline"
                external
                icon={<GitHubMark className="size-4" />}
                className="border-ice/25 bg-navy-950/50 text-ice hover:bg-navy-800 hover:text-ice"
              >
                GitHub
              </Cta>
              <Cta
                href={profile.resume.href}
                soon={profile.resume.placeholder}
                variant="ghost"
                icon={<Download className="size-4" />}
                className="text-ice hover:bg-navy-900/70 hover:text-ice"
              >
                Résumé
              </Cta>
            </div>

            <p className="mt-6 hidden items-center gap-2 font-mono text-[0.68rem] tracking-[0.18em] text-steel uppercase lg:flex">
              <ArrowDown className="size-3.5 rotate-[-90deg]" aria-hidden />
              Drag anywhere to orbit the car
            </p>
          </div>
        </div>

        <div className="pointer-events-auto mt-10 max-w-md">
          <Readout />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-y border-line bg-navy-900/85 py-3 backdrop-blur-sm">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {marqueeSkills.map((skill) => (
                <li
                  key={`${copy}-${skill}`}
                  className="flex items-center gap-4 px-4 font-display text-[0.78rem] tracking-[0.22em] text-ice/75 uppercase sm:text-sm"
                >
                  {skill}
                  <span aria-hidden className="h-2.5 w-2.5 rotate-45 bg-rb-red" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
