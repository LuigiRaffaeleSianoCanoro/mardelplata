"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GUIA_GROUPS, GUIA_PAGES, guiaPath } from "@/content/guia";

export default function GuiaSubnav() {
  const pathname = usePathname();

  return (
    <nav className="mb-10 max-w-3xl" aria-label="Secciones de la guía tech">
      <p className="mb-3">
        <Link
          href="/guia"
          className={`text-sm font-semibold underline-offset-2 ${
            pathname === "/guia" ? "text-foreground underline" : "text-primary hover:underline"
          }`}
        >
          Portada de la guía
        </Link>
      </p>
      <div className="flex flex-col gap-4">
        {GUIA_GROUPS.map((group) => (
          <div key={group.id}>
            <p className="mb-2 font-mono text-[10.5px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
              {group.label}
            </p>
            <ul className="flex flex-wrap gap-2">
              {GUIA_PAGES.filter((page) => page.group === group.id).map((page) => {
                const href = guiaPath(page.slug);
                const active = pathname === href;
                return (
                  <li key={page.slug}>
                    <Link
                      href={href}
                      className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-foreground text-background"
                          : "border border-border bg-card text-muted-foreground hover:border-border-strong hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {page.navLabel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
