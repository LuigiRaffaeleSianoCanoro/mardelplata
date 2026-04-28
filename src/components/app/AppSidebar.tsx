"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { IS_MOCK } from "@/lib/devMock";

const STORAGE_KEY = "mdpdev:sidebar-expanded";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  matchPrefix?: string;
}

interface AppSidebarProps {
  isAdmin?: boolean;
}

export default function AppSidebar({ isAdmin }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(STORAGE_KEY);
      if (v === "1") setExpanded(true);
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      try { window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch {}
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    if (!IS_MOCK) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  }, [router]);

  const items: SidebarItem[] = [
    {
      href: "/",
      label: "Inicio",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12 12 4l9 8" />
          <path d="M5 10v10h14V10" />
        </svg>
      ),
    },
    {
      href: "/perfil",
      label: "Mi perfil",
      matchPrefix: "/perfil",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
    {
      href: "/bolsa",
      label: "Bolsa",
      matchPrefix: "/bolsa",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 8h14l-1 12H6Z" />
          <path d="M9 8V6a3 3 0 0 1 6 0v2" />
        </svg>
      ),
    },
    {
      href: "/primer-trabajo",
      label: "Primer Trabajo",
      matchPrefix: "/primer-trabajo",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path d="M9 6V4h6v2" />
          <path d="M3 12h18" />
        </svg>
      ),
    },
    ...(isAdmin
      ? [
          {
            href: "/admin",
            label: "Admin",
            matchPrefix: "/admin",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 3 7l9 5 9-5-9-5z" />
                <path d="M3 17l9 5 9-5" />
                <path d="M3 12l9 5 9-5" />
              </svg>
            ),
          } as SidebarItem,
        ]
      : []),
  ];

  const isActive = (item: SidebarItem) => {
    if (item.matchPrefix) return pathname?.startsWith(item.matchPrefix);
    return pathname === item.href;
  };

  return (
    <aside
      className={`app-sidebar ${expanded ? "is-expanded" : ""}`}
      aria-label="Navegación principal"
    >
      <Link href="/" className="flex items-center gap-3 px-3 h-14">
        <span className="metal-chip w-9 h-9 rounded-xl">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/85">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </span>
        <span className="app-sidebar-label text-white/95 text-[0.85rem] tracking-[0.04em]">
          mardelplata<span className="text-neon-amber/80">.dev</span>
        </span>
      </Link>

      <div className="mx-3 hairline" />

      <nav className="flex-1 py-3 overflow-y-auto">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`app-sidebar-item ${isActive(item) ? "active" : ""}`}
          >
            <span className="app-sidebar-icon">{item.icon}</span>
            <span className="app-sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mx-3 hairline" />
      <div className="py-2">
        <button
          type="button"
          onClick={toggle}
          className="app-sidebar-item app-sidebar-toggle w-full text-left"
          aria-label={expanded ? "Colapsar navegación" : "Expandir navegación"}
          aria-expanded={expanded}
        >
          <span className="app-sidebar-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 6 6 6-6 6" />
            </svg>
          </span>
          <span className="app-sidebar-label">{expanded ? "Colapsar" : "Expandir"}</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="app-sidebar-item w-full text-left"
        >
          <span className="app-sidebar-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </span>
          <span className="app-sidebar-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
