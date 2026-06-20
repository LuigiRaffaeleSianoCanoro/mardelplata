// Conmutador de idioma ES/EN entre páginas equivalentes. Server component.
// Ver docs/nomad-it-hub/04-seo.md §5.

import Link from "next/link";

interface LangSwitcherProps {
  es: string;
  en: string;
  current: "es" | "en";
}

export default function LangSwitcher({ es, en, current }: LangSwitcherProps) {
  return (
    <div
      style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center" }}
      aria-label={current === "es" ? "Cambiar idioma" : "Change language"}
    >
      <Link
        href={es}
        hrefLang="es"
        className={`shell-tag ${current === "es" ? "shell-tag--violet" : ""}`}
        style={{ textDecoration: "none", opacity: current === "es" ? 1 : 0.6 }}
        aria-current={current === "es" ? "true" : undefined}
      >
        ES
      </Link>
      <Link
        href={en}
        hrefLang="en"
        className={`shell-tag ${current === "en" ? "shell-tag--violet" : ""}`}
        style={{ textDecoration: "none", opacity: current === "en" ? 1 : 0.6 }}
        aria-current={current === "en" ? "true" : undefined}
      >
        EN
      </Link>
    </div>
  );
}
