"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/primer-trabajo/guia/cv", label: "CV" },
  { href: "/primer-trabajo/guia/linkedin", label: "LinkedIn" },
] as const;

export default function GuiaSubnav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 mb-8" aria-label="Guías CV y LinkedIn">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-foreground text-background"
                : "border border-border bg-card text-muted-foreground hover:border-border-strong hover:bg-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
