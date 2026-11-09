import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cn("size-4 fill-current", className)}>
      <path d="M8 0a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.39l-.01-1.4c-2.23.49-2.7-1.06-2.7-1.06-.37-.93-.9-1.19-.9-1.19-.73-.5.06-.49.06-.49.81.06 1.24.83 1.24.83.72 1.24 1.9.88 2.36.67.07-.52.28-.88.51-1.08-1.79-.2-3.67-.89-3.67-3.98 0-.88.32-1.6.83-2.17-.08-.2-.36-1.01.08-2.11 0 0 .68-.22 2.21.83a7.6 7.6 0 0 1 4.02 0c1.53-1.05 2.21-.83 2.21-.83.44 1.1.16 1.91.08 2.11.52.57.83 1.29.83 2.17 0 3.1-1.89 3.78-3.68 3.98.29.25.54.73.54 1.48l-.01 2.2c0 .22.15.47.55.39A8 8 0 0 0 8 0Z" />
    </svg>
  );
}

export function SoonTag() {
  return (
    <span className="bg-rb-yellow px-1.5 py-0.5 font-mono text-[10px] leading-none font-bold tracking-widest text-navy-950 uppercase">
      soon
    </span>
  );
}

type CtaProps = {
  href: string;
  children: ReactNode;
  soon?: boolean;
  variant?: "default" | "outline" | "ghost" | "secondary";
  external?: boolean;
  icon?: ReactNode;
  className?: string;
};

export function Cta({
  href,
  children,
  soon = false,
  variant = "default",
  external = false,
  icon,
  className,
}: CtaProps) {
  const shared =
    "h-11 rounded-none px-5 font-display text-[0.78rem] font-semibold tracking-[0.16em] uppercase";

  if (soon) {
    return (
      <Button
        asChild
        variant={variant}
        className={cn(shared, "opacity-90", className)}
      >
        <a
          href={href}
          title="This link is a placeholder — the real URL is added in src/site-data.ts"
          onClick={(event) => event.preventDefault()}
        >
          {icon}
          {children}
          <SoonTag />
        </a>
      </Button>
    );
  }

  return (
    <Button asChild variant={variant} className={cn(shared, className)}>
      <a href={href} {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}>
        {icon}
        {children}
      </a>
    </Button>
  );
}
