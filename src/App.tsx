import { TopBar } from "@/components/TopBar";
import { Hero } from "@/components/Hero";
import { Profile } from "@/components/Profile";
import { Skills } from "@/components/Skills";
import { Stints } from "@/components/Stints";
import { Pipeline } from "@/components/Pipeline";
import { Contact } from "@/components/Contact";
import { SiteFooter } from "@/components/SiteFooter";
import { usePrefersReducedMotion } from "@/hooks/use-site";

export default function App() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className="relative">
      <a
        href="#profile"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:bg-rb-yellow focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:text-navy-950"
      >
        Skip to content
      </a>

      <TopBar />

      <main>
        <Hero reducedMotion={reducedMotion} />
        <Profile />
        <Skills />
        <Stints />
        <Pipeline />
        <Contact />
      </main>

      <SiteFooter />
    </div>
  );
}
