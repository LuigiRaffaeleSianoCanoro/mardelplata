"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  Compass,
  Home,
  Link2,
  LogIn,
  Newspaper,
  SunMoon,
  Ticket,
  User,
  Users,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/shadcn/command";
import { Kbd } from "@/components/shadcn/kbd";
import { LogoMark } from "./Logo";
import { BRAND } from "@/lib/v3/brand";
import { ICON_STROKE } from "./parts";
import type { EventVM, PressVM, ShellLink } from "@/lib/v3/types";
import type { TabId } from "./tabs";

const iconCls = "size-4 text-muted-foreground";

export function CommandMenu({
  open,
  onOpenChange,
  upcoming,
  past,
  press,
  links,
  loggedIn,
  onTab,
  onEvent,
  onPress,
  onRsvp,
  onToggleTheme,
  onCopyLink,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  upcoming: EventVM[];
  past: EventVM[];
  press: PressVM[];
  links: ShellLink[];
  loggedIn: boolean;
  onTab: (t: TabId) => void;
  onEvent: (slug: string) => void;
  onPress: (id: string) => void;
  onRsvp: () => void;
  onToggleTheme: () => void;
  onCopyLink: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const searching = q.trim().length > 0;

  const run = (fn: () => void) => {
    onOpenChange(false);
    setQ("");
    // deja cerrar el dialog antes de abrir otro overlay
    window.setTimeout(fn, 0);
  };
  const go = (href: string) => run(() => router.push(href));

  const featured = links.filter((l) => l.href === "/primer-trabajo" || l.href === "/vivir-en-mardelplata");
  const rest = links.filter((l) => !featured.includes(l) && (loggedIn || l.group !== "cuenta"));

  return (
    <CommandDialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setQ("");
      }}
      title="Buscar"
      description="Buscá eventos, gente, proyectos…"
      showCloseButton={false}
      className="top-[max(16px,12dvh)] translate-y-0 rounded-xl border-border-strong p-0 sm:max-w-[640px] lg:top-[132px]"
    >
      <CommandInput placeholder="Buscá eventos, gente, proyectos…" value={q} onValueChange={setQ} />
      <CommandList className="max-h-[min(420px,60dvh)]">
        <CommandEmpty>Nada por acá. Probá con otra palabra.</CommandEmpty>
        {upcoming.length > 0 ? (
          <CommandGroup heading="Eventos">
            {upcoming.map((e) => (
              <CommandItem key={e.slug} value={`evento ${e.title} ${e.venueName ?? ""} ${e.tags.join(" ")}`} onSelect={() => run(() => onEvent(e.slug))}>
                <CalendarDays className={iconCls} strokeWidth={ICON_STROKE} />
                <span className="flex-1 truncate">{e.title}</span>
                <CommandShortcut className="font-mono tracking-normal">{e.dateShort}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        {searching && past.length > 0 ? (
          <CommandGroup heading="Eventos pasados">
            {past.map((e) => (
              <CommandItem key={e.slug} value={`pasado ${e.title} ${e.venueName ?? ""} ${e.tags.join(" ")}`} onSelect={() => run(() => onEvent(e.slug))}>
                <CalendarDays className={iconCls} strokeWidth={ICON_STROKE} />
                <span className="flex-1 truncate">{e.title}</span>
                <CommandShortcut className="font-mono tracking-normal">{e.dateShort}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        <CommandGroup heading="Ir a">
          <CommandItem value="tab eventos" onSelect={() => run(() => onTab("eventos"))}>
            <CalendarDays className={iconCls} strokeWidth={ICON_STROKE} />
            <span className="flex-1">Eventos</span>
            <CommandShortcut className="font-mono">1</CommandShortcut>
          </CommandItem>
          <CommandItem value="tab comunidad miembros proyectos gente" onSelect={() => run(() => onTab("comunidad"))}>
            <Users className={iconCls} strokeWidth={ICON_STROKE} />
            <span className="flex-1">Comunidad</span>
            <CommandShortcut className="font-mono">2</CommandShortcut>
          </CommandItem>
          <CommandItem value="tab prensa notas medios" onSelect={() => run(() => onTab("prensa"))}>
            <Newspaper className={iconCls} strokeWidth={ICON_STROKE} />
            <span className="flex-1">Prensa</span>
            <CommandShortcut className="font-mono">3</CommandShortcut>
          </CommandItem>
          <CommandItem value="tab empleos trabajo búsquedas" onSelect={() => run(() => onTab("empleos"))}>
            <Briefcase className={iconCls} strokeWidth={ICON_STROKE} />
            <span className="flex-1">Empleos</span>
            <CommandShortcut className="font-mono">4</CommandShortcut>
          </CommandItem>
          {featured.map((l) => (
            <CommandItem key={l.href} value={`${l.label} ${l.description ?? ""} ${l.href}`} onSelect={() => go(l.href)}>
              {l.href === "/primer-trabajo" ? (
                <BookOpen className={iconCls} strokeWidth={ICON_STROKE} />
              ) : (
                <Home className={iconCls} strokeWidth={ICON_STROKE} />
              )}
              <span className="flex-1">{l.label}</span>
            </CommandItem>
          ))}
          {(searching ? rest : []).map((l) => (
            <CommandItem
              key={l.href}
              value={`${l.label} ${l.description ?? ""} ${l.href}`}
              onSelect={() => go(l.href)}
            >
              <Compass className={iconCls} strokeWidth={ICON_STROKE} />
              <span className="flex-1 truncate">{l.label}</span>
              {l.description ? <span className="hidden truncate text-[12px] text-muted-foreground sm:inline">{l.description}</span> : null}
            </CommandItem>
          ))}
        </CommandGroup>
        {searching ? (
          <CommandGroup heading="Prensa">
            {press.map((p) => (
              <CommandItem key={p.id} value={`nota ${p.title} ${p.outlet}`} onSelect={() => run(() => onPress(p.id))}>
                <Newspaper className={iconCls} strokeWidth={ICON_STROKE} />
                <span className="flex-1 truncate">{p.title}</span>
                <CommandShortcut className="hidden font-mono sm:inline">{p.outlet}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          {upcoming[0]?.registrationUrl ? (
            <CommandItem value="anotarme al próximo luma rsvp" onSelect={() => run(onRsvp)}>
              <Ticket className={iconCls} strokeWidth={ICON_STROKE} />
              <span className="flex-1">Anotarme al próximo</span>
              <CommandShortcut className="font-mono">↵</CommandShortcut>
            </CommandItem>
          ) : null}
          <CommandItem value="cambiar tema claro oscuro" onSelect={() => run(onToggleTheme)}>
            <SunMoon className={iconCls} strokeWidth={ICON_STROKE} />
            <span className="flex-1">Cambiar tema</span>
            <CommandShortcut className="font-mono">T</CommandShortcut>
          </CommandItem>
          <CommandItem value="copiar link compartir" onSelect={() => run(onCopyLink)}>
            <Link2 className={iconCls} strokeWidth={ICON_STROKE} />
            <span className="flex-1">Copiar link</span>
          </CommandItem>
          {loggedIn ? (
            <CommandItem value="mi perfil cuenta" onSelect={() => go("/perfil")}>
              <User className={iconCls} strokeWidth={ICON_STROKE} />
              <span className="flex-1">Mi perfil</span>
            </CommandItem>
          ) : (
            <CommandItem value="entrar login cuenta registrarme" onSelect={() => go("/auth/login")}>
              <LogIn className={iconCls} strokeWidth={ICON_STROKE} />
              <span className="flex-1">Entrar</span>
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
      <div className="flex h-10 items-center justify-between border-t px-4">
        <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <LogoMark className="size-3.5" />
          <span className="font-mono">{BRAND}</span>
        </span>
        <span className="hidden items-center gap-3 font-mono text-[10px] tracking-[0.06em] text-muted-foreground uppercase sm:flex">
          <span className="flex items-center gap-1.5">
            <Kbd className="h-[18px]">↑↓</Kbd> navegar
          </span>
          <span className="flex items-center gap-1.5">
            <Kbd className="h-[18px]">↵</Kbd> abrir
          </span>
        </span>
      </div>
    </CommandDialog>
  );
}
