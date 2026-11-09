import { Box, Bot, Cpu, Database, Rocket, Server, type LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiDocker,
  SiDigitalocean,
  SiExpress,
  SiFlask,
  SiGithub,
  SiGit,
  SiLangchain,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiNumpy,
  SiPandas,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedux,
  SiScikitlearn,
  SiTailwindcss,
  SiTanstack,
  SiTensorflow,
  SiModelcontextprotocol,
} from "react-icons/si";
import { Reveal, SectionHeading } from "@/components/Reveal";
import { skillGroups, type Level } from "@/site-data";

const GROUP_ICONS: Record<string, LucideIcon> = {
  frontend: Box,
  backend: Server,
  database: Database,
  ml: Cpu,
  ai: Bot,
  devops: Rocket,
};

// Official brand marks from simple-icons. Concept labels (RAG, CI/CD, REST APIs,
// agentic AI) and marks missing from this icon set get a neutral diamond instead.
const BRAND_ICONS: Record<string, IconType> = {
  React: SiReact,
  "TanStack Query": SiTanstack,
  Redux: SiRedux,
  "Next.js": SiNextdotjs,
  "Tailwind CSS": SiTailwindcss,
  "Node.js": SiNodedotjs,
  "Express.js": SiExpress,
  NestJS: SiNestjs,
  Flask: SiFlask,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  MongoDB: SiMongodb,
  Python: SiPython,
  "Scikit-learn": SiScikitlearn,
  Pandas: SiPandas,
  NumPy: SiNumpy,
  TensorFlow: SiTensorflow,
  PyTorch: SiPytorch,
  MCP: SiModelcontextprotocol,
  LangChain: SiLangchain,
  Docker: SiDocker,
  Git: SiGit,
  GitHub: SiGithub,
  DigitalOcean: SiDigitalocean,
};

const LEVEL_TAG: Record<Level, { label: string; className: string }> = {
  core: { label: "Daily driver", className: "border-rb-yellow/60 text-rb-yellow" },
  working: { label: "Working knowledge", className: "border-steel/40 text-steel" },
};

function SkillMark({ skill }: { skill: string }) {
  const Brand = BRAND_ICONS[skill];
  if (Brand) {
    return <Brand aria-hidden className="size-4 shrink-0 text-rb-yellow/85" />;
  }
  return <span aria-hidden className="size-2 shrink-0 rotate-45 bg-rb-red/80" />;
}

export function Skills() {
  return (
    <section id="stack" className="carbon relative border-t border-line py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="02"
            eyebrow="Car setup"
            title="The package I run"
            lead="Tools I use to ship, grouped the way a build actually comes together."
          />
          <Reveal delay={120} className="flex gap-6 font-mono text-[0.65rem] tracking-[0.2em] uppercase">
            {(["core", "working"] as Level[]).map((level) => (
              <p key={level} className="flex items-center gap-2">
                <span aria-hidden className={`size-2.5 rounded-full border ${LEVEL_TAG[level].className}`} />
                {LEVEL_TAG[level].label}
              </p>
            ))}
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((group, index) => {
            const Icon = GROUP_ICONS[group.id] ?? Box;
            const tag = LEVEL_TAG[group.level];
            return (
              <Reveal key={group.id} delay={index * 70}>
                <li className="group plate relative h-full overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1">
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-linear-to-r from-rb-red via-rb-red-lift to-rb-yellow transition-transform duration-500 group-hover:scale-x-100"
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[0.65rem] tracking-[0.24em] text-rb-red">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-ice">{group.title}</h3>
                      <p className="mt-1 text-sm text-steel">{group.caption}</p>
                    </div>
                    <Icon
                      aria-hidden
                      className="size-8 shrink-0 text-ice/70 transition-colors duration-300 group-hover:text-rb-yellow"
                      strokeWidth={1.5}
                    />
                  </div>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <li
                        key={skill}
                        className="flex items-center gap-2 border border-line bg-navy-950/70 px-3 py-1.5 font-display text-[0.8rem] tracking-[0.06em] text-ice/90"
                      >
                        <SkillMark skill={skill} />
                        {skill}
                      </li>
                    ))}
                  </ul>

                  <p
                    className={`mt-6 inline-flex border px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.18em] uppercase ${tag.className}`}
                  >
                    {tag.label}
                  </p>
                </li>
              </Reveal>
            );
          })}

          <Reveal delay={skillGroups.length * 70}>
            <li className="plate flex h-full flex-col justify-between gap-6 p-6 [background:linear-gradient(150deg,color-mix(in_oklab,var(--rb-red)_22%,var(--navy-850)),var(--navy-950))]">
              <div>
                <p className="font-mono text-[0.65rem] tracking-[0.24em] text-rb-yellow">
                  {String(skillGroups.length + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-2xl font-bold">Working style</h3>
                <p className="mt-3 text-sm leading-relaxed text-ice/85">
                  I take a feature from schema to screen in one pass, then push it through a pipeline I
                  can follow: commit, build, container, registry, server.
                </p>
              </div>
              <p className="font-mono text-[0.65rem] leading-relaxed tracking-[0.16em] text-steel uppercase">
                Manual deploys included —
                <br />
                AWS Lightsail &amp; DigitalOcean
              </p>
            </li>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
