import type { ReactNode } from "react";

interface PageHeaderProps {
  /** Small uppercase eyebrow above the title — e.g. "/ MI PERFIL". */
  eyebrow?: string;
  /** Main page title. */
  title: ReactNode;
  /** Optional one-line description below the title. */
  description?: ReactNode;
  /** Right-side action area (buttons, links). */
  actions?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-mono text-[0.7rem] tracking-[0.25em] text-ocean-300/70 mb-3 uppercase">
            {eyebrow}
          </p>
        )}
        <h1
          className="font-display font-bold text-white text-[clamp(1.8rem,4.5vw,3rem)] leading-[1.05]"
          style={{ letterSpacing: "-0.035em" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-ocean-200/80 text-base max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
