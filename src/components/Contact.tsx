import { ArrowUpRight, Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { GitHubMark, SoonTag } from "@/components/Cta";
import { profile } from "@/site-data";

type Row = {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  soon?: boolean;
  external?: boolean;
};

const rows: Row[] = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}`, icon: <Mail className="size-5" /> },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phoneHref}`, icon: <Phone className="size-5" /> },
  {
    label: "GitHub",
    value: `github.com/${profile.githubHandle}`,
    href: profile.github,
    icon: <GitHubMark className="size-5" />,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "Profile link to be added",
    href: profile.linkedin.href,
    icon: <ArrowUpRight className="size-5" />,
    soon: profile.linkedin.placeholder,
  },
  {
    label: "Résumé",
    value: "PDF to be added",
    href: profile.resume.href,
    icon: <ArrowUpRight className="size-5" />,
    soon: profile.resume.placeholder,
  },
];

export function Contact() {
  return (
    <section id="contact" className="carbon relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-4 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div>
          <SectionHeading
            index="05"
            eyebrow="Race control"
            title="Call the pit wall"
            lead="Open to full-stack work, AI-assisted tooling and teams that want someone who can ship the whole feature."
          />
          <Reveal delay={120}>
            <p aria-hidden className="stripes mt-10 h-3 w-40 opacity-80" />
            <p className="mt-6 max-w-md font-mono text-[0.7rem] leading-relaxed tracking-[0.16em] text-steel uppercase">
              {profile.availability}
            </p>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <ul className="plate divide-y divide-line overflow-hidden">
            {rows.map((row) => (
              <li key={row.label}>
                <a
                  href={row.href}
                  {...(row.soon ? { onClick: (event: React.MouseEvent) => event.preventDefault() } : {})}
                  {...(row.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group flex items-center gap-5 px-5 py-5 transition-colors duration-200 hover:bg-navy-800/70 sm:px-7"
                >
                  <span className="text-steel transition-colors duration-200 group-hover:text-rb-yellow">
                    {row.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.62rem] tracking-[0.24em] text-steel uppercase">
                      {row.label}
                    </span>
                    <span className="mt-1 block truncate font-display text-lg font-semibold text-ice sm:text-xl">
                      {row.value}
                    </span>
                  </span>
                  {row.soon ? <SoonTag /> : null}
                  <span
                    aria-hidden
                    className="h-6 w-[3px] shrink-0 origin-bottom scale-y-0 bg-rb-red transition-transform duration-300 group-hover:scale-y-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
