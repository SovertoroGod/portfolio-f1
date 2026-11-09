import { Reveal, SectionHeading } from "@/components/Reveal";
import { profile, stints } from "@/site-data";
import { formatDate, formatMonths, monthsBetween } from "@/lib/format";
import { GitHubMark } from "@/components/Cta";

const current = stints[0];
const totalMonths = stints.reduce((sum, stint) => sum + monthsBetween(stint.from, stint.to), 0);

const spec = [
  { label: "Role", value: profile.role },
  { label: "Base", value: profile.location },
  { label: "Current seat", value: `${current.team} · since ${formatDate(current.from)}` },
  { label: "Track record", value: `${formatMonths(totalMonths)} across ${stints.length} teams` },
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phoneHref}` },
  {
    label: "GitHub",
    value: `@${profile.githubHandle}`,
    href: profile.github,
    mark: true,
  },
];

export function Profile() {
  return (
    <section id="profile" className="relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <SectionHeading index="01" eyebrow="Race licence" title="Building the whole lap, not one corner" />
          <Reveal delay={80} className="mt-8 space-y-5">
            {profile.summary.map((paragraph) => (
              <p key={paragraph} className="max-w-2xl text-lg leading-relaxed text-ice/85">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={140} className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {["React frontends", "Node & Python services", "SQL, document & vector data", "Models, agents and servers"].map(
              (item) => (
                <p key={item} className="flex items-center gap-2.5 font-display text-sm tracking-[0.1em] text-ice uppercase">
                  <span aria-hidden className="h-2.5 w-2.5 rotate-45 bg-rb-red" />
                  {item}
                </p>
              ),
            )}
          </Reveal>
        </div>

        <Reveal delay={60}>
          <div className="plate relative overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.16] mix-blend-screen"
              style={{
                backgroundImage: "url('/assets/texture-carbon.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative">
              <p className="border-b border-line px-5 py-4 font-mono text-[0.65rem] tracking-[0.24em] text-rb-yellow uppercase">
                Car spec
              </p>
              <dl>
                {spec.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start justify-between gap-6 border-b border-line/70 px-5 py-4 last:border-b-0"
                  >
                    <dt className="font-mono text-[0.65rem] tracking-[0.2em] text-steel uppercase">
                      {row.label}
                    </dt>
                    <dd className="text-right text-sm font-medium text-ice">
                      {row.href ? (
                        <a
                          href={row.href}
                          {...(row.href.startsWith("http")
                            ? { target: "_blank", rel: "noreferrer noopener" }
                            : {})}
                          className="inline-flex items-center gap-2 underline decoration-rb-red/70 decoration-2 underline-offset-4 transition-colors hover:text-rb-yellow"
                        >
                          {row.mark ? <GitHubMark className="size-4" /> : null}
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
