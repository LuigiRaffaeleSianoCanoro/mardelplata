"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  Briefcase,
  Compass,
  Shield,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IS_MOCK } from "@/lib/devMock";

/* ------------------------------------------------------------------ */
/*  Tooltip — slides in from the right, no Radix                       */
/* ------------------------------------------------------------------ */

function SidebarTooltip({
  children,
  label,
  icon: Icon,
  active = false,
}: {
  children: ReactNode;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <div
        className={`absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-lg whitespace-nowrap text-[12px] font-medium pointer-events-none z-[60] transition-all duration-150 ${
          show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
        } ${
          active
            ? "bg-[rgba(20,20,28,0.92)] border border-[rgba(59,130,246,0.32)] text-[#3B82F6] shadow-lg"
            : "bg-[rgba(14,14,20,0.92)] border border-white/[0.08] text-white/75 shadow-lg"
        }`}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} />}
          {label}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shimmer overlay (hover gradient slide)                             */
/* ------------------------------------------------------------------ */

function Shimmer({ hovered }: { hovered: boolean }) {
  return (
    <div
      style={{
        transform: hovered ? "translateX(100%)" : "translateX(-100%)",
        transition: hovered ? "transform 500ms ease-out" : "none",
      }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl pointer-events-none"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Pillar / section button                                             */
/* ------------------------------------------------------------------ */

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  prefix?: string;
  accent: string;
};

function NavButton({
  item,
  isActive,
  index,
}: {
  item: NavItem;
  isActive: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <SidebarTooltip label={item.label} icon={Icon} active={isActive}>
      <Link
        href={item.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 overflow-hidden active:scale-95 ${
          hovered && !isActive ? "scale-105" : ""
        } ${
          isActive
            ? "bg-[rgba(20,20,28,0.85)] ring-1 ring-white/10"
            : ""
        }`}
        style={{
          animation: `sidebar-tab-in 300ms ease-out ${index * 60}ms both`,
          ...(isActive
            ? { boxShadow: `0 0 14px ${item.accent}22, inset 0 0 0 1px ${item.accent}30` }
            : hovered
              ? { boxShadow: `0 0 8px ${item.accent}18` }
              : undefined),
        }}
      >
        <Icon
          size={20}
          strokeWidth={1.6}
          className="relative z-10 transition-colors duration-200"
          style={{
            color: isActive
              ? item.accent
              : hovered
                ? `${item.accent}cc`
                : "rgba(255,255,255,0.5)",
          }}
        />
        <Shimmer hovered={hovered} />
      </Link>
    </SidebarTooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer button (settings, logout)                                    */
/* ------------------------------------------------------------------ */

function FooterButton({
  label,
  icon: Icon,
  onClick,
  href,
  active = false,
}: {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const inner = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 overflow-hidden cursor-pointer ${
        active ? "bg-[rgba(20,20,28,0.85)] ring-1 ring-white/10" : ""
      }`}
    >
      <Icon
        size={18}
        strokeWidth={1.6}
        className="relative z-10 transition-colors duration-200"
        style={{
          color: active
            ? "rgba(255,255,255,0.95)"
            : hovered
              ? "rgba(255,255,255,0.85)"
              : "rgba(255,255,255,0.45)",
        }}
      />
      <Shimmer hovered={hovered} />
    </div>
  );

  return (
    <SidebarTooltip label={label} icon={Icon} active={active}>
      {href ? (
        <Link href={href}>{inner}</Link>
      ) : (
        <button type="button" onClick={onClick} aria-label={label} className="block">
          {inner}
        </button>
      )}
    </SidebarTooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

interface AppSidebarProps {
  isAdmin?: boolean;
}

export default function AppSidebar({ isAdmin }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const items: NavItem[] = [
    { href: "/", label: "Inicio", icon: Home, accent: "#3B82F6" },
    { href: "/perfil", label: "Mi perfil", icon: User, prefix: "/perfil", accent: "#3B82F6" },
    { href: "/bolsa", label: "Bolsa", icon: Briefcase, prefix: "/bolsa", accent: "#FFB070" },
    { href: "/primer-trabajo", label: "Primer Trabajo", icon: Compass, prefix: "/primer-trabajo", accent: "#FF2DAA" },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", icon: Shield, prefix: "/admin", accent: "#FF2DAA" } as NavItem]
      : []),
  ];

  const isActive = (item: NavItem) =>
    item.prefix ? pathname?.startsWith(item.prefix) ?? false : pathname === item.href;

  const handleLogout = async () => {
    if (!IS_MOCK) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  const settingsActive = pathname?.startsWith("/perfil/settings") ?? false;

  return (
    <aside className="app-sidebar" aria-label="Navegación principal">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(59,130,246,0.04)] to-transparent pointer-events-none rounded-inherit" />

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 mb-5 mt-1 flex items-center justify-center group"
        title="mardelplata.dev"
      >
        <span className="metal-chip w-10 h-10 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Image src="/mdpdev.png" alt="MdPDev" width={22} height={22} className="opacity-95" />
        </span>
      </Link>

      {/* Separator */}
      <div className="relative z-10 w-8 h-px bg-white/[0.06] mb-4 mx-auto" />

      {/* Pillars */}
      <nav className="relative z-10 flex flex-col items-center gap-1.5 mb-4 flex-1">
        {items.map((item, i) => (
          <NavButton key={item.href} item={item} isActive={isActive(item)} index={i} />
        ))}
      </nav>

      {/* Separator */}
      <div className="relative z-10 w-8 h-px bg-white/[0.06] mb-3 mx-auto" />

      {/* Footer */}
      <div className="relative z-10 flex flex-col items-center gap-1 pb-1">
        <FooterButton
          label="Configuración"
          icon={Settings}
          href="/perfil"
          active={settingsActive}
        />
        <FooterButton label="Cerrar sesión" icon={LogOut} onClick={handleLogout} />
      </div>
    </aside>
  );
}
