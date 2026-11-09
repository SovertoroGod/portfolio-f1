import { profile } from "@/site-data";
import { GitHubMark } from "@/components/Cta";

const year = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-navy-950">
      <div aria-hidden className="stripes h-1.5 w-full opacity-80" />
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-6 px-4 py-8 sm:px-8">
        <p className="font-display text-sm tracking-[0.18em] text-ice uppercase">
          {profile.name}
          <span className="ml-3 font-mono text-[0.65rem] tracking-[0.16em] text-steel normal-case">
            © {year}
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-5 font-mono text-[0.66rem] tracking-[0.18em] uppercase">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 text-steel transition-colors hover:text-ice"
          >
            <GitHubMark className="size-4" /> GitHub
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-steel transition-colors hover:text-ice"
          >
            Email
          </a>
          <a href="#top" className="text-rb-yellow transition-colors hover:text-ice">
            Back to top
          </a>
        </div>
      </div>
      <p className="mx-auto max-w-[1400px] px-4 pb-8 font-mono text-[0.62rem] leading-relaxed tracking-[0.14em] text-steel/70 uppercase sm:px-8">
        Built with React, Three.js and Tailwind · 2026 Red Bull RB22 model by{" "}
        <a
          href="https://sketchfab.com/3d-models/2026-redbull-rb22-0a3d24a58e0549d591a5a48c22eec383"
          target="_blank"
          rel="noreferrer noopener"
          className="text-steel underline decoration-rb-red/60 underline-offset-4 hover:text-rb-yellow"
        >
          Dave Love
        </a>
        , CC BY 4.0
      </p>
    </footer>
  );
}
