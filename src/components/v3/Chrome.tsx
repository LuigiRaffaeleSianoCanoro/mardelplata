"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { Kbd } from "@/components/shadcn/kbd";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/shadcn/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/shadcn/tooltip";
import { BRAND } from "@/lib/v3/brand";
import { MARKETPLACE_NAV_ENABLED } from "@/lib/flags";
import { Lockup } from "./Logo";
import { ICON_STROKE } from "./parts";
import { UserMenu } from "./user-menu";
import { useSessionUser, useTheme } from "./hooks";

/** Activa tokens Piedra en cualquier ruta (el :has(.v3-shell) de v3.css). */
export function PiedraRoot({ page = true }: { page?: boolean }) {
  return (
    <div
      className={cn("v3-shell pointer-events-none !fixed inset-0 -z-10", page && "v3-shell--page")}
      aria-hidden
    >
      <div className="v3-piedra v3-piedra--fixed" />
    </div>
  );
}

const PRIMARY: { href: string; label: string; match?: (p: string) => boolean }[] = [
  { href: "/eventos", label: "Eventos", match: (p) => p.startsWith("/eventos") },
  { href: "/?tab=comunidad", label: "Comunidad", match: (p) => p === "/" },
  { href: "/prensa", label: "Prensa", match: (p) => p.startsWith("/prensa") },
  { href: "/bolsa", label: "Empleos", match: (p) => p.startsWith("/bolsa") || p.startsWith("/primer-trabajo") },
];

const MORE: { href: string; label: string; group: string }[] = [
  { href: "/proyectos", label: "Proyectos", group: "Comunidad" },
  { href: "/red", label: "Red", group: "Comunidad" },
  { href: "/blog", label: "Lectura", group: "Comunidad" },
  { href: "/reglamento", label: "Código de conducta", group: "Comunidad" },
  { href: "/primer-trabajo", label: "Primer trabajo", group: "Aprender" },
  { href: "/primer-trabajo/entrevista-hr", label: "Entrevista con HR", group: "Aprender" },
  { href: "/estudiar", label: "Estudiar", group: "Aprender" },
  { href: "/vivir-en-mardelplata", label: "Vivir en Mar del Plata", group: "Ciudad" },
  { href: "/trabajar", label: "Cafés y coworkings", group: "Ciudad" },
  { href: "/que-hacer", label: "Qué hacer", group: "Ciudad" },
  { href: "/empresas", label: "Empresas", group: "Ecosistema" },
  { href: "/invertir", label: "Invertir", group: "Ecosistema" },
  ...(MARKETPLACE_NAV_ENABLED
    ? [{ href: "/marketplace", label: "Marketplace", group: "Ecosistema" }]
    : []),
  { href: "/brand", label: "Brand book", group: "Recursos" },
  { href: "/marketing-kit", label: "Marketing kit", group: "Recursos" },
];

function isActive(pathname: string, href: string, match?: (p: string) => boolean) {
  if (match) return match(pathname);
  if (href.startsWith("/?")) return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const user = useSessionUser();
  const [theme, setTheme] = useTheme();
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modKey, setModKey] = useState("⌘");

  useEffect(() => {
    if (!/Mac|iP(hone|ad|od)/.test(navigator.platform || navigator.userAgent)) setModKey("Ctrl ");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const userName =
    (user?.user_metadata?.full_name as string | undefined)?.trim() || user?.email || "";
  const userAvatar = (user?.user_metadata?.avatar_url as string | undefined) ?? undefined;

  const groups = useMemo(() => {
    const m = new Map<string, typeof MORE>();
    for (const item of MORE) {
      const arr = m.get(item.group) ?? [];
      arr.push(item);
      m.set(item.group, arr);
    }
    return Array.from(m.entries());
  }, []);

  return (
    <TooltipProvider delayDuration={400}>
      <PiedraRoot page />
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="relative z-10 mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-2 px-4 lg:px-6">
          <Link href="/" className="flex min-h-11 items-center rounded-lg" aria-label={`${BRAND} — inicio`}>
            <Lockup textClassName="lg:text-[16px]" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Secciones">
            {PRIMARY.map((l) => {
              const active = isActive(pathname, l.href, l.match);
              return (
                <Button
                  key={l.href}
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={cn("h-9 rounded-lg px-3 text-[13px]", active && "bg-muted")}
                >
                  <Link href={l.href}>{l.label}</Link>
                </Button>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-1 lg:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-11 md:hidden"
              aria-label="Buscar"
              onClick={() => setCmdOpen(true)}
            >
              <Search className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => setCmdOpen(true)}
                  className="hidden h-9 w-[min(200px,14vw)] justify-between pr-1.5 pl-3 text-[13px] font-normal text-muted-foreground md:inline-flex"
                >
                  <span className="flex items-center gap-2">
                    <Search className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
                    Buscar…
                  </span>
                  <Kbd>{modKey}K</Kbd>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Ir a cualquier sección</TooltipContent>
            </Tooltip>

            {user ? (
              <UserMenu
                name={userName}
                avatarUrl={userAvatar}
                theme={theme}
                onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
              />
            ) : (
              <Button variant="outline" asChild className="h-11 px-4 text-[13px] lg:h-9 lg:px-3.5">
                <Link href="/auth/login">Entrar</Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="size-11 md:hidden"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
              ) : (
                <Menu className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
              )}
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <nav className="relative z-10 border-t bg-background/95 px-4 py-3 md:hidden" aria-label="Menú">
            <ul className="flex flex-col gap-1">
              {PRIMARY.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-3 text-[15px]",
                      isActive(pathname, l.href, l.match) ? "bg-muted font-medium" : "text-muted-foreground",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="my-2 border-t" />
              {MORE.slice(0, 8).map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="flex min-h-11 items-center rounded-lg px-3 text-[14px] text-muted-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <CommandDialog open={cmdOpen} onOpenChange={setCmdOpen}>
        <CommandInput placeholder="Buscá una sección…" />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup heading="Secciones">
            <CommandItem onSelect={() => { setCmdOpen(false); router.push("/"); }}>
              Inicio
            </CommandItem>
            {PRIMARY.map((l) => (
              <CommandItem
                key={l.href}
                onSelect={() => {
                  setCmdOpen(false);
                  router.push(l.href);
                }}
              >
                {l.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          {groups.map(([group, items]) => (
            <CommandGroup key={group} heading={group}>
              {items.map((l) => (
                <CommandItem
                  key={l.href}
                  onSelect={() => {
                    setCmdOpen(false);
                    router.push(l.href);
                  }}
                >
                  {l.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
        <div className="flex items-center justify-between border-t px-3 py-2 text-[11px] text-muted-foreground">
          <span className="font-mono">{BRAND}</span>
          <span>↵ abrir</span>
        </div>
      </CommandDialog>
    </TooltipProvider>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t bg-background/70">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <div>
          <Lockup />
          <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
            El Club Tech de Mar del Plata. Meetups, hackathons, empleos y lo que sale en los medios.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-[13px]">
          <Link href="/eventos" className="text-muted-foreground hover:text-foreground">
            Eventos
          </Link>
          <Link href="/prensa" className="text-muted-foreground hover:text-foreground">
            Prensa
          </Link>
          <Link href="/bolsa" className="text-muted-foreground hover:text-foreground">
            Empleos
          </Link>
          <Link href="/reglamento" className="text-muted-foreground hover:text-foreground">
            Reglamento
          </Link>
          <Link href="/auth/registro" className="text-muted-foreground hover:text-foreground">
            Sumate
          </Link>
        </div>
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-3 font-mono text-[10.5px] tracking-[0.06em] text-muted-foreground uppercase lg:px-6">
          <span>Fondo: piedra Mar del Plata</span>
          <span>© {BRAND}</span>
        </div>
      </div>
    </footer>
  );
}
