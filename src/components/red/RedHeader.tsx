import type { ReactNode } from "react";

interface RedHeaderProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function RedHeader({ eyebrow, title, description, action }: RedHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
      <div className="min-w-0">
        <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
          <span className="v3-dot" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="font-semibold tracking-[-0.04em] text-foreground text-[clamp(2rem,5vw,3rem)] leading-[1.04]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-muted-foreground text-base max-w-2xl leading-relaxed font-light">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </header>
  );
}
