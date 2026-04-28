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
        <p className="kicker text-white/45 mb-3 flex items-center gap-2">
          <span className="dot-amber" />
          {eyebrow}
        </p>
        <h1 className="display-thin text-white text-[clamp(2rem,5vw,3rem)] leading-[1.04]">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-white/55 text-base max-w-2xl leading-relaxed font-light">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </header>
  );
}
