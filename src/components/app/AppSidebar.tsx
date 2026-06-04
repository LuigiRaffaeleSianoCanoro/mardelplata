"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Home,
  User,
  Network,
  Shield,
  Settings,
  LogOut,
  UserCircle2,
  QrCode,
  CalendarCheck,
  CalendarDays,
  GitBranch,
  Bookmark,
  Lightbulb,
  Boxes,
  Search,
  LayoutDashboard,
  ScanLine,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IS_MOCK } from "@/lib/devMock";
import QrDialog from "./QrDialog";

/* ------------------------------------------------------------------ */
/*  Tooltip — slides in from the right                                  */
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
            ? "bg-[rgba(28,31,39,0.95)] border border-[rgba(59,130,246,0.32)] text-[#3B82F6] shadow-lg"
            : "bg-[rgba(20,22,28,0.95)] border border-white/[0.08] text-white/80 shadow-lg"
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
/*  Pillar button (top — context switcher)                              */
/* ------------------------------------------------------------------ */

type Pillar = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Path used for active-state detection from pathname. */
  basePath: string;
  accent: string;
  tabs: TabItem[];
  /** When true, clicking the pillar navigates. When false (default for
   *  context-only pillars like "Yo" / "Red"), the click only swaps the
   *  tabs shown below — no route change. */
  navigate?: boolean;
};

type TabItem = {
  href?: string;
  label: string;
  icon: LucideIcon;
  matchPrefix?: string;
  /** Special action — clicking the tab triggers in-app behavior instead of navigating. */
  action?: "qr";
};

function PillarButton({
  pillar,
  isActive,
  onClick,
  index,
}: {
  pillar: Pillar;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = pillar.icon;

  const className = `relative w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 overflow-hidden active:scale-95 ${
    hovered && !isActive ? "scale-105" : ""
  } ${isActive ? "bg-[rgba(35,39,50,0.92)] ring-1 ring-white/[0.10]" : ""}`;
  const style: React.CSSProperties = {
    animation: `sidebar-tab-in 300ms ease-out ${index * 60}ms both`,
    ...(isActive
      ? { boxShadow: `0 0 16px ${pillar.accent}30, inset 0 0 0 1px ${pillar.accent}40` }
      : hovered
        ? { boxShadow: `0 0 10px ${pillar.accent}20` }
        : {}),
  };
  const inner = (
    <>
      <Icon
        size={20}
        strokeWidth={1.6}
        className="relative z-10 transition-colors duration-200"
        style={{
          color: isActive
            ? pillar.accent
            : hovered
              ? `${pillar.accent}cc`
              : "rgba(255,255,255,0.55)",
        }}
      />
      <Shimmer hovered={hovered} />
    </>
  );

  return (
    <SidebarTooltip label={pillar.label} icon={Icon} active={isActive}>
      {pillar.navigate ? (
        <Link
          href={pillar.basePath}
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={className}
          style={style}
        >
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={className}
          style={style}
          aria-label={pillar.label}
          aria-pressed={isActive}
        >
          {inner}
        </button>
      )}
    </SidebarTooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab button (bottom — for active pillar)                             */
/* ------------------------------------------------------------------ */

const TAB_HOVER_PALETTE = ["#C0D4E8", "#F2D0C8", "#C8E0D0", "#F5E0C0", "#D0C8E8"];

function TabButton({
  tab,
  isActive,
  index,
  onAction,
}: {
  tab: TabItem;
  isActive: boolean;
  index: number;
  onAction?: (action: "qr", e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = tab.icon;
  const hoverColor = TAB_HOVER_PALETTE[index % TAB_HOVER_PALETTE.length];

  const className = `relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 overflow-hidden active:scale-95 ${
    hovered && !isActive ? "scale-105" : ""
  } ${isActive ? "bg-[rgba(35,39,50,0.92)]" : ""}`;
  const style: React.CSSProperties = {
    animation: `sidebar-tab-in 280ms ease-out ${index * 50}ms both`,
    ...(hovered && !isActive ? { boxShadow: `0 0 8px ${hoverColor}40` } : {}),
  };
  const inner = (
    <>
      <Icon
        size={18}
        strokeWidth={1.6}
        className="relative z-10 transition-colors duration-200"
        style={{
          color: isActive
            ? "rgba(255,255,255,0.95)"
            : hovered
              ? hoverColor
              : "rgba(255,255,255,0.45)",
        }}
      />
      <Shimmer hovered={hovered} />
    </>
  );

  return (
    <SidebarTooltip label={tab.label} icon={Icon} active={isActive}>
      {tab.action ? (
        <button
          type="button"
          onClick={(e) => tab.action && onAction?.(tab.action, e)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={className}
          style={style}
          aria-label={tab.label}
        >
          {inner}
        </button>
      ) : (
        <Link
          href={tab.href ?? "#"}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={className}
          style={style}
        >
          {inner}
        </Link>
      )}
    </SidebarTooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer button                                                       */
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
        active ? "bg-[rgba(35,39,50,0.92)] ring-1 ring-white/[0.10]" : ""
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

export interface AppSidebarUser {
  fullName: string | null;
  email: string | null;
  qrCode: string | null;
  memberSince?: string | null;
}

interface AppSidebarProps {
  isAdmin?: boolean;
  user?: AppSidebarUser | null;
  /** Open the global ⌘K command palette. Wired by AppShell. */
  onOpenSearch?: () => void;
}

export default function AppSidebar({ isAdmin, user, onOpenSearch }: AppSidebarProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const [qrOpen, setQrOpen] = useState(false);
  const [qrAnchorY, setQrAnchorY] = useState<number | null>(null);
  // Cerrar el popover de QR al cambiar de ruta — sino queda flotante
  // sobre la nueva pagina (el portal vive en document.body, no se
  // desmonta con la navegacion).
  useEffect(() => { setQrOpen(false); }, [pathname]);

  const pillars: Pillar[] = [
    {
      id: "inicio",
      label: "Inicio",
      icon: Home,
      basePath: "/",
      accent: "#3B82F6",
      tabs: [],
      navigate: true,
    },
    {
      id: "yo",
      label: "Yo",
      icon: User,
      basePath: "/perfil",
      accent: "#3B82F6",
      tabs: [
        { href: "/perfil", label: "Mi perfil", icon: UserCircle2 },
        { label: "Mi QR", icon: QrCode, action: "qr" },
        { href: "/asistencias", label: "Asistencias", icon: CalendarCheck, matchPrefix: "/asistencias" },
        { href: "/eventos", label: "Eventos", icon: CalendarDays, matchPrefix: "/eventos" },
      ],
    },
    {
      id: "red",
      label: "Red",
      icon: Network,
      basePath: "/red",
      accent: "#FF2DAA",
      tabs: [
        { href: "/red", label: "Open source", icon: GitBranch },
        { href: "/red/mis-proyectos", label: "Mis proyectos", icon: Bookmark, matchPrefix: "/red/mis-proyectos" },
        { href: "/red/ideas", label: "Ideas", icon: Lightbulb, matchPrefix: "/red/ideas" },
        { href: "/red/modulos", label: "Módulos", icon: Boxes, matchPrefix: "/red/modulos" },
      ],
    },
    ...(isAdmin
      ? [
          {
            id: "admin",
            label: "Admin",
            icon: Shield,
            basePath: "/admin",
            accent: "#FFB070",
            tabs: [
              { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
              { href: "/admin/scanner", label: "Scanner", icon: ScanLine, matchPrefix: "/admin/scanner" },
            ],
          } as Pillar,
        ]
      : []),
  ];

  // Detect which pillar matches the current pathname. Default to "yo" when
  // landing on something we don't recognize so a useful tab list shows up.
  const detectedPillar =
    pillars.find((p) => p.id !== "inicio" && pathname.startsWith(p.basePath)) ??
    (pathname === "/" ? pillars[0] : null) ??
    pillars[1];

  const [selectedId, setSelectedId] = useState<string>(detectedPillar.id);
  // Re-sync the highlighted pillar when the pathname changes (e.g. user
  // clicked a tab inside another pillar's group, or navigated externally).
  useEffect(() => {
    setSelectedId(detectedPillar.id);
  }, [detectedPillar.id]);
  const activePillar = pillars.find((p) => p.id === selectedId) ?? detectedPillar;

  // En mobile el bottom bar tiene espacio limitado. Mostramos pillars
  // (root) o tabs del pillar activo (sub-nav), no ambos. Por default,
  // si la URL ya esta dentro de un pillar con tabs, arrancamos en
  // modo "tabs" — asi quien entra directo a /red/ideas ve la nav
  // contextual sin tener que tocar Red primero.
  const [isMobile, setIsMobile] = useState(false);
  const [mobileShowingTabs, setMobileShowingTabs] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 760px)");
    const sync = () => setIsMobile(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!isMobile) {
      setMobileShowingTabs(false);
      return;
    }
    const inPillarWithTabs = activePillar.id !== "inicio" && activePillar.tabs.length > 0;
    setMobileShowingTabs(inPillarWithTabs);
  }, [isMobile, activePillar.id, activePillar.tabs.length]);

  const isPillarActive = (p: Pillar) => p.id === selectedId;

  const isTabActive = (tab: TabItem) => {
    if (tab.action === "qr") return qrOpen;
    if (tab.matchPrefix) return pathname.startsWith(tab.matchPrefix);
    if (!tab.href) return false;
    return pathname === tab.href.split("#")[0];
  };

  const handleAction = (action: "qr", e: React.MouseEvent<HTMLButtonElement>) => {
    if (action === "qr") {
      const rect = e.currentTarget.getBoundingClientRect();
      setQrAnchorY(rect.top + rect.height / 2);
      setQrOpen(true);
    }
  };

  const handleLogout = async () => {
    if (!IS_MOCK) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/");
    router.refresh();
  };

  return (
    <aside
      className="app-sidebar"
      aria-label="Navegación principal"
      data-mobile-mode={mobileShowingTabs ? "tabs" : "pillars"}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(59,130,246,0.04)] to-transparent pointer-events-none" />

      {/* Logo */}
      <Link
        href="/"
        className="relative z-10 mb-5 mt-1 flex items-center justify-center group"
        title="mardelplata.dev.ar"
      >
        <span className="metal-chip w-10 h-10 rounded-xl group-hover:scale-110 transition-transform duration-300">
          <Image src="/mdpdev.png" alt="mardelplata.dev.ar" width={22} height={22} className="opacity-95" />
        </span>
      </Link>

      <div className="relative z-10 w-8 h-px bg-white/[0.06] mb-4 mx-auto" />

      {/* Pillars — siempre en DOM. En mobile la visibilidad la decide
          el data-mobile-mode del <aside> via CSS (mas robusto que
          condicionar el render en JS, evita flashes de hidracion donde
          ningun nav termina visible). */}
      <nav className="relative z-10 flex flex-col items-center gap-1.5 mb-4 app-sidebar-pillars">
        {pillars.map((p, i) => (
          <PillarButton
            key={p.id}
            pillar={p}
            isActive={isPillarActive(p)}
            onClick={() => {
              setSelectedId(p.id);
              if (isMobile) {
                router.push(p.basePath);
                if (p.id !== "inicio" && p.tabs.length > 0) {
                  setMobileShowingTabs(true);
                }
              }
            }}
            index={i}
          />
        ))}
      </nav>

      <div className="relative z-10 w-8 h-px bg-white/[0.06] mb-3 mx-auto" />

      {/* Tabs for active pillar — siempre en DOM (ver nota arriba). */}
      <nav
        key={activePillar.id}
        className="relative z-10 flex flex-col items-center gap-1 flex-1 app-sidebar-tabs"
      >
        {/* Back chip en mobile — vuelve a mostrar las pillars sin
            navegar (la URL queda donde esta). Solo visible en mobile
            via CSS (.app-sidebar-back-chip { display: none } por default). */}
        <button
          type="button"
          onClick={() => setMobileShowingTabs(false)}
          aria-label="Volver al menú principal"
          className="app-sidebar-back-chip relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95 text-white/55 hover:text-white"
        >
          <ArrowLeft size={18} strokeWidth={1.6} />
        </button>
        {activePillar.tabs.map((t, i) => (
          <TabButton
            key={t.href ?? t.action ?? t.label}
            tab={t}
            isActive={isTabActive(t)}
            index={i}
            onAction={handleAction}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="relative z-10 flex flex-col items-center gap-1 pb-1">
        {onOpenSearch && (
          <FooterButton
            label="Buscar  ⌘K"
            icon={Search}
            onClick={onOpenSearch}
          />
        )}
        <FooterButton label="Configuración" icon={Settings} href="/perfil" />
        <FooterButton label="Cerrar sesión" icon={LogOut} onClick={handleLogout} />
      </div>

      <QrDialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        qrCode={user?.qrCode ?? null}
        fullName={user?.fullName ?? null}
        email={user?.email ?? null}
        memberSince={user?.memberSince ?? null}
        anchorY={qrAnchorY}
      />
    </aside>
  );
}
