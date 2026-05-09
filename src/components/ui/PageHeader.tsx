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
  /** Optional naval-style coord strip rendered under the title (mono). */
  coords?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, actions, coords }: PageHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
      <div className="min-w-0">
        {eyebrow && (
          <p className="kicker kicker-amber mb-4 flex items-center gap-2">
            <span className="dot-amber" />
            {eyebrow}
          </p>
        )}
        <h1
          className="display-thin text-white text-[clamp(2rem,5vw,3.4rem)] leading-[1.02]"
        >
          {title}
        </h1>
        {coords && (
          <p className="coord-line mt-3">{coords}</p>
        )}
        {description && (
          <p className="mt-4 text-white/55 text-base max-w-2xl leading-relaxed font-light">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}
