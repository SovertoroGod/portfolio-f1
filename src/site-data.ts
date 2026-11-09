// Owner-editable content. `placeholder: true` marks links Shine still has to point
// at a real URL (LinkedIn profile + résumé file); the UI labels them "soon".

export type Level = "core" | "working";

export type SkillGroup = {
  id: string;
  title: string;
  caption: string;
  level: Level;
  skills: string[];
};

export type Stint = {
  team: string;
  role: string;
  from: string;
  to: string | null;
  stack: string[];
  scope: string;
};

export const profile = {
  name: "Shine Wai Yan",
  initials: "SWY",
  role: "Full-Stack Developer & AI Enthusiast",
  tagline: "Interfaces, services and the servers they land on.",
  summary: [
    "I build web products across the whole path: React interfaces up front, Node.js and Python services behind them, and the databases, containers and servers that keep them running.",
    "My work runs on typed state — Redux or Zustand for the app, TanStack Query for the server data — and on APIs in Express or NestJS that stay readable as they grow. Flask is where I take Python when a job is more script than service.",
    "On the data side I work across Postgres, MySQL and MongoDB, plus vector storage when an app needs retrieval. That leads into the part I spend most of my free time on: Python models with pandas, NumPy and scikit-learn, PyTorch or TensorFlow when a job needs training.",
    "Lately the focus is agentic AI — RAG pipelines, tool calling and MCP servers, usually built with LangChain — wiring AI into the build, review and release steps instead of leaving it as a chat box.",
  ],
  location: "Myanmar",
  availability: "Working at Mingalar Mon Group Co., Ltd.",
  email: "waiyanshine465@gmail.com",
  phone: "+95 9 2623 88707",
  phoneHref: "+959262388707",
  github: "https://github.com/SovertoroGod",
  githubHandle: "SovertoroGod",
  linkedin: { href: "#linkedin", label: "LinkedIn", placeholder: true },
  resume: { href: "#resume", label: "Download résumé", placeholder: true },
} as const;

export const heroReadout = [
  { label: "Current seat", value: "Mingalar Mon Group" },
  { label: "Racing since", value: "Dec 2025" },
  { label: "Stack", value: "React · Node · Python" },
  { label: "Focus", value: "Full-stack + agentic AI" },
] as const;

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    caption: "What the user touches",
    level: "core",
    skills: ["React", "TanStack Query", "Redux", "Zustand", "Next.js", "Tailwind CSS"],
  },
  {
    id: "backend",
    title: "Backend",
    caption: "Everything behind the endpoint",
    level: "core",
    skills: ["Node.js", "Express.js", "NestJS", "Flask", "REST APIs"],
  },
  {
    id: "database",
    title: "Database",
    caption: "Rows, documents and embeddings",
    level: "core",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "Chroma"],
  },
  {
    id: "ml",
    title: "Machine Learning",
    caption: "Data wrangling to trained model",
    level: "working",
    skills: ["Python", "Scikit-learn", "Pandas", "NumPy", "TensorFlow", "PyTorch"],
  },
  {
    id: "ai",
    title: "AI & Agentic",
    caption: "Agents wired into the workflow",
    level: "working",
    skills: ["RAG", "Tool Calling", "MCP", "LLM", "LangChain", "Agentic AI"],
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    caption: "Getting it onto a server",
    level: "working",
    skills: ["Docker", "Git", "GitHub", "CI/CD", "AWS", "DigitalOcean"],
  },
];

export const marqueeSkills = [
  "React",
  "Next.js",
  "TanStack Query",
  "Redux",
  "Zustand",
  "Tailwind CSS",
  "Node.js",
  "Express.js",
  "NestJS",
  "Flask",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Chroma",
  "Python",
  "Pandas",
  "NumPy",
  "Scikit-learn",
  "TensorFlow",
  "PyTorch",
  "RAG",
  "MCP",
  "LangChain",
  "Agentic AI",
  "Docker",
  "Git & GitHub",
  "CI/CD",
  "AWS",
  "DigitalOcean",
];

export const stints: Stint[] = [
  {
    team: "Mingalar Mon Group Co., Ltd.",
    role: "Full-Stack Developer",
    from: "2026-07-22",
    to: null,
    stack: ["React", "Node.js", "NestJS", "Docker"],
    scope:
      "Current seat. Building and maintaining production features end to end — React interfaces over Node services, with the data layer and deployment handled in the same pass.",
  },
  {
    team: "Kwin Technology",
    role: "Full-Stack Developer",
    from: "2025-12-01",
    to: "2026-07-21",
    stack: ["React", "Redux", "Express", "MySQL"],
    scope:
      "First full-stack role. Shipped application features across state-managed React frontends, Express APIs and relational schemas, and learned the servers underneath them.",
  },
];

export const pipeline = [
  {
    step: "01",
    title: "Branch & commit",
    detail: "Git and GitHub for review-friendly history — feature branches, pull requests, no mystery merges.",
  },
  {
    step: "02",
    title: "Build & check",
    detail: "CI runs the build and checks on every push so a broken bundle never reaches a server.",
  },
  {
    step: "03",
    title: "Containerize",
    detail: "Dockerfiles for app and dependencies, so staging and production run the same image.",
  },
  {
    step: "04",
    title: "Push to registry",
    detail: "Tagged images to a registry, versioned by commit instead of by whoever deployed last.",
  },
  {
    step: "05",
    title: "Release on the server",
    detail: "Manual deployment on AWS Lightsail and DigitalOcean — reverse proxy, environment, restart, verify.",
  },
];
