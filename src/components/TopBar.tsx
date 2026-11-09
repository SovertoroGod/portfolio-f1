import { useEffect, useState } from "react";
import { useActiveSection, useScrollProgress } from "@/hooks/use-site";
import { profile } from "@/site-data";
import { Button } from "@/components/ui/button";
import { GitHubMark } from "@/components/Cta";
import { cn } from "@/lib/utils";

export const NAV = [
  { id: "profile", label: "Profile" },
  { id: "stack", label: "Stack" },
  { id: "stints", label: "Stints" },
  { id: "pipeline", label: "Pipeline" },
  { id: "contact", label: "Contact" },
];

const NAV_IDS = NAV.map((item) => item.id);

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);
  const progress = useScrollProgress();

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-line bg-navy-950/78 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-8">
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label={`${profile.name} — back to top`}
          >
            <span className="relative flex size-10 items-center justify-center bg-navy-800 font-display text-[0.7rem] font-bold tracking-widest text-ice ring-1 ring-line">
              {profile.initials}
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-rb-red" />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-rb-yellow" />
            </span>
            <span className="hidden text-sm font-medium tracking-[0.2em] text-steel uppercase transition-colors group-hover:text-ice sm:block">
              Shine Wai Yan
            </span>
          </a>

          <nav aria-label="Sections" className="ml-auto hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                className={cn(
                  "relative px-3 py-2 font-display text-[0.72rem] tracking-[0.18em] uppercase transition-colors",
                  active === item.id ? "text-ice" : "text-steel hover:text-ice",
                )}
              >
                {item.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3 bottom-1 h-[2px] origin-left bg-rb-yellow transition-transform",
                    active === item.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden size-10 rounded-none text-steel hover:bg-navy-800 hover:text-ice sm:inline-flex"
            >
              <a href={profile.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub profile">
                <GitHubMark className="size-5" />
              </a>
            </Button>
            <Button
              asChild
              className="h-10 rounded-none bg-rb-red px-4 font-display text-[0.72rem] font-semibold tracking-[0.16em] uppercase hover:bg-rb-red-lift"
            >
              <a href={profile.resume.href} onClick={(event) => event.preventDefault()}>
                Résumé
                <span className="bg-rb-yellow px-1 py-0.5 font-mono text-[9px] font-bold text-navy-950">
                  soon
                </span>
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="size-10 rounded-none text-ice hover:bg-navy-800 md:hidden"
            >
              <span className="sr-only">Toggle section menu</span>
              <span aria-hidden className="flex flex-col gap-[5px]">
                <span className={cn("h-[2px] w-5 bg-current transition-transform", menuOpen && "translate-y-[7px] rotate-45")} />
                <span className={cn("h-[2px] w-5 bg-current transition-opacity", menuOpen && "opacity-0")} />
                <span className={cn("h-[2px] w-5 bg-current transition-transform", menuOpen && "-translate-y-[7px] -rotate-45")} />
              </span>
            </Button>
          </div>
        </div>

        <div
          aria-hidden
          className="h-[3px] origin-left bg-linear-to-r from-rb-red via-rb-red-lift to-rb-yellow"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {menuOpen ? (
        <nav
          id="mobile-nav"
          aria-label="Sections"
          className="mx-4 mt-2 border border-line bg-navy-900/95 p-2 backdrop-blur-md md:hidden"
        >
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 font-display text-sm tracking-[0.18em] text-ice uppercase"
            >
              {item.label}
              <span className="font-mono text-[0.65rem] text-rb-yellow">
                {String(NAV.indexOf(item) + 1).padStart(2, "0")}
              </span>
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
