"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  CalendarPlus,
  FolderGit2,
  MapPin,
  Share,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { Badge } from "@/components/shadcn/badge";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/shadcn/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcn/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/pagination";
import { ToggleGroup, ToggleGroupItem } from "@/components/shadcn/toggle-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { DESKTOP_QUERY, useMediaQuery } from "./hooks";
import { addToCalendar, shareLink } from "./actions";
import { EventRow, ICON_STROKE, Label, PressRow, UpcomingBadge } from "./parts";
import type { EventVM, MemberVM, PressVM } from "@/lib/v3/types";
import { BRAND } from "@/lib/v3/brand";

/* ── Contenedor: Drawer (vaul) en mobile, Sheet de 480px en desktop ──── */

export function ResponsiveOverlay({
  open,
  onOpenChange,
  title,
  description,
  hideHeader = false,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** El contenido trae su propio título visible. */
  hideHeader?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  if (isDesktop) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full gap-0 border-l border-border-strong p-0 sm:max-w-[480px]">
          <div className="v3-piedra v3-piedra--top opacity-90" aria-hidden />
          <SheetHeader className={cn("relative px-6 pt-6 pb-0", hideHeader && "sr-only")}>
            <SheetTitle className="text-[20px] tracking-[-0.03em]">{title}</SheetTitle>
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>
          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-6">{children}</div>
          {footer ? <div className="relative flex flex-col gap-2 px-6 pt-4 pb-6">{footer}</div> : null}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={!reduced}>
      <DrawerContent className="max-h-[92dvh] border-border-strong data-[vaul-drawer-direction=bottom]:rounded-t-2xl">
        <div className="v3-piedra v3-piedra--top rounded-t-2xl opacity-90" aria-hidden />
        <DrawerHeader className={cn("relative px-5 pt-3 pb-0 text-left", hideHeader && "sr-only")}>
          <DrawerTitle className="text-[20px] tracking-[-0.03em]">{title}</DrawerTitle>
          {description ? <DrawerDescription>{description}</DrawerDescription> : null}
        </DrawerHeader>
        {/* scroll interno solo como último recurso (pantallas muy bajas) */}
        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-5 pt-4">{children}</div>
        {footer ? (
          <div className="relative flex flex-col gap-2 px-5 pt-4 pb-[max(16px,env(safe-area-inset-bottom))]">{footer}</div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}

/* ── Detalle de evento ───────────────────────────────────────────────── */

export function EventDetail({ event, isUpcoming }: { event: EventVM; isUpcoming: boolean }) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2">
        {isUpcoming ? <UpcomingBadge /> : <Badge variant="outline">Pasado</Badge>}
        {event.price ? <Badge variant="outline">{event.price}</Badge> : null}
        {event.capacity ? <Badge variant="outline">Cupo {event.capacity}</Badge> : null}
        {!event.price && !event.capacity
          ? event.tags.slice(0, 2).map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))
          : null}
      </div>
      <h2 className="mt-3 text-[28px] leading-[1.05] font-semibold tracking-[-0.04em] text-balance">{event.title}</h2>
      {event.excerpt ? (
        <p className="mt-2 text-[14.5px] leading-[1.45] text-muted-foreground">{event.excerpt}</p>
      ) : null}

      <div className="mt-4 divide-y rounded-xl border">
        <div className="flex min-h-[50px] items-center gap-3 px-3.5 py-2">
          <CalendarDays className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-medium">{event.dateLong}</div>
            <div className="text-[12px] text-muted-foreground">{event.timeLong}</div>
          </div>
        </div>
        {event.venueName ? (
          <div className="flex min-h-[50px] items-center gap-3 px-3.5 py-2">
            <MapPin className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">{event.venueName}</div>
              <div className="truncate text-[12px] text-muted-foreground">
                {[event.venueAddress, event.city].filter(Boolean).join(", ")}
              </div>
            </div>
            {event.mapsUrl ? (
              <a
                href={event.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="v3-label inline-flex min-h-11 items-center !text-[10px] hover-device:hover:text-foreground"
              >
                Cómo llegar
              </a>
            ) : null}
          </div>
        ) : null}
        {event.hosts.length > 0 ? (
          <div className="flex min-h-[50px] items-center gap-3 px-3.5 py-2">
            <Users className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-medium">Organizan</div>
              <div className="text-[12px] text-muted-foreground">{event.hosts.map((h) => h.name).join(" · ")}</div>
            </div>
          </div>
        ) : null}
      </div>

      {event.agenda.length > 0 ? (
        <>
          <Label className="mt-4">Agenda</Label>
          <ol className="mt-1">
            {event.agenda.map((a, i) => (
              <li key={a} className="flex min-h-[30px] items-center gap-3">
                <span className="w-5 font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[14px]">{a}</span>
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </div>
  );
}

export function EventDetailFooter({ event, isUpcoming }: { event: EventVM; isUpcoming: boolean }) {
  const detailUrl = () => `${window.location.origin}/?evento=${encodeURIComponent(event.slug)}`;
  return (
    <>
      {event.registrationUrl ? (
        <Button asChild size="xl" className="w-full">
          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer">
            {isUpcoming ? "Anotarme en Luma" : "Ver en Luma"}
            <ArrowUpRight className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
          </a>
        </Button>
      ) : null}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        {isUpcoming ? (
          <Button variant="outline" className="h-11" onClick={() => addToCalendar(event)}>
            <CalendarPlus className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
            Agregar al calendario
          </Button>
        ) : (
          <Button variant="outline" className="h-11" asChild>
            <Link href="/eventos">Ver todos los eventos</Link>
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          className="size-11"
          aria-label="Compartir"
          onClick={() => shareLink({ url: detailUrl(), title: event.title })}
        >
          <Share className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
        </Button>
      </div>
    </>
  );
}

/* ── Detalle de nota de prensa ───────────────────────────────────────── */

export function PressDetail({ item }: { item: PressVM }) {
  return (
    <div className="flex flex-col">
      <Label>
        {item.outlet} · {item.typeLabel}
      </Label>
      <h2 className="mt-3 text-[26px] leading-[1.08] font-semibold tracking-[-0.035em] text-balance">{item.title}</h2>
      <div className="mt-2 text-[13px] text-muted-foreground">{item.dateLong}</div>
      <p className="mt-4 text-[14.5px] leading-[1.5] text-muted-foreground">{item.excerpt}</p>
      {item.eventLabels.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.eventLabels.map((l) => (
            <Badge key={l} variant="outline">
              {l}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PressDetailFooter({ item }: { item: PressVM }) {
  return (
    <>
      {!item.pendingSource ? (
        <Button asChild size="xl" className="w-full">
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            Leer en {item.outlet}
            <ArrowUpRight className="size-4" strokeWidth={ICON_STROKE} aria-hidden />
          </a>
        </Button>
      ) : null}
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button variant="outline" className="h-11" asChild>
          <Link href={item.hasArchive ? `/prensa/${item.id}` : "/prensa"}>
            {item.hasArchive ? "Ver archivo de la nota" : "Archivo de prensa"}
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-11"
          aria-label="Compartir"
          onClick={() =>
            shareLink({ url: `${window.location.origin}/?tab=prensa&nota=${encodeURIComponent(item.id)}`, title: item.title })
          }
        >
          <Share className="size-[18px]" strokeWidth={ICON_STROKE} aria-hidden />
        </Button>
      </div>
    </>
  );
}

/* ── Paginación genérica (nunca scroll) ──────────────────────────────── */

function usePaged<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(page, pages - 1);
  const slice = items.slice(safePage * perPage, safePage * perPage + perPage);
  return { page: safePage, pages, slice, setPage };
}

function Pager({ page, pages, setPage }: { page: number; pages: number; setPage: (p: number) => void }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i).filter(
    (i) => pages <= 5 || Math.abs(i - page) <= 1 || i === 0 || i === pages - 1,
  );
  return (
    <Pagination className="mt-3">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={page === 0}
            className={cn("h-11", page === 0 && "pointer-events-none opacity-40")}
            onClick={(e) => {
              e.preventDefault();
              setPage(Math.max(0, page - 1));
            }}
          />
        </PaginationItem>
        {nums.map((i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === page}
              className="size-11"
              onClick={(e) => {
                e.preventDefault();
                setPage(i);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={page === pages - 1}
            className={cn("h-11", page === pages - 1 && "pointer-events-none opacity-40")}
            onClick={(e) => {
              e.preventDefault();
              setPage(Math.min(pages - 1, page + 1));
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/* ── Calendario completo (lista paginada) ────────────────────────────── */

export function CalendarList({
  upcoming,
  past,
  onOpen,
}: {
  upcoming: EventVM[];
  past: EventVM[];
  onOpen: (slug: string) => void;
}) {
  const [view, setView] = useState<"proximos" | "pasados">(upcoming.length > 0 ? "proximos" : "pasados");
  const list = view === "proximos" ? upcoming : past;
  const { page, pages, slice, setPage } = usePaged(list, 5);
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => {
            if (v) {
              setView(v as typeof view);
              setPage(0);
            }
          }}
          variant="outline"
          aria-label="Filtrar eventos"
        >
          <ToggleGroupItem value="proximos" className="h-11 px-4 lg:h-8">
            Próximos
          </ToggleGroupItem>
          <ToggleGroupItem value="pasados" className="h-11 px-4 lg:h-8">
            Pasados
          </ToggleGroupItem>
        </ToggleGroup>
        <Label>{list.length} eventos</Label>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {slice.length === 0 ? (
          <p className="py-6 text-[14px] text-muted-foreground">No hay eventos para mostrar.</p>
        ) : (
          slice.map((e) => <EventRow key={e.slug} event={e} onOpen={() => onOpen(e.slug)} />)
        )}
      </div>
      <Pager page={page} pages={pages} setPage={setPage} />
    </div>
  );
}

export function PressList({ press, onOpen }: { press: PressVM[]; onOpen: (id: string) => void }) {
  const { page, pages, slice, setPage } = usePaged(press, 3);
  return (
    <div className="flex flex-col">
      <Label>{press.length} notas</Label>
      <div className="mt-2 divide-y">
        {slice.map((p) => (
          <PressRow key={p.id} item={p} onOpen={() => onOpen(p.id)} />
        ))}
      </div>
      <Pager page={page} pages={pages} setPage={setPage} />
    </div>
  );
}

export function MembersList({ members }: { members: MemberVM[] }) {
  const { page, pages, slice, setPage } = usePaged(members, 12);
  return (
    <div className="flex flex-col">
      <p className="text-[14px] leading-[1.45] text-muted-foreground">
        Somos ~700 personas. Acá van los últimos perfiles creados en la web.
      </p>
      <ul className="mt-4 grid grid-cols-3 gap-x-2 gap-y-4 lg:grid-cols-4">
        {slice.map((m) => (
          <li key={m.id} className="flex min-w-0 flex-col items-center gap-1.5 text-center">
            <Avatar className="size-11 border bg-muted">
              {m.avatarUrl ? <AvatarImage src={m.avatarUrl} alt="" /> : null}
              <AvatarFallback className="bg-muted font-mono text-[11px] font-semibold">{m.initials}</AvatarFallback>
            </Avatar>
            <span className="w-full truncate text-[12px]">{m.name}</span>
          </li>
        ))}
      </ul>
      <Pager page={page} pages={pages} setPage={setPage} />
    </div>
  );
}

/* ── Dialogs ─────────────────────────────────────────────────────────── */

export function JoinProjectDialog({
  open,
  onOpenChange,
  loggedIn,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  loggedIn: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border-border-strong sm:max-w-md">
        <DialogHeader>
          <FolderGit2 className="size-5 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
          <DialogTitle className="tracking-[-0.02em]">Sumá tu proyecto</DialogTitle>
          <DialogDescription>
            {loggedIn
              ? "Cargalo en la Red: nombre, repo o demo y una línea de qué hace."
              : "Para publicar un proyecto necesitás entrar con tu cuenta de la comunidad."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="h-11 lg:h-9" asChild>
            <Link href="/proyectos">Ver proyectos</Link>
          </Button>
          <Button className="h-11 lg:h-9" asChild>
            <Link href={loggedIn ? "/red/mis-proyectos" : "/auth/login"}>{loggedIn ? "Cargar proyecto" : "Entrar"}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PublishJobDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border-border-strong sm:max-w-md">
        <DialogHeader>
          <Briefcase className="size-5 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
          <DialogTitle className="tracking-[-0.02em]">Publicar búsqueda</DialogTitle>
          <DialogDescription>
            Las búsquedas se publican en la Bolsa de la comunidad y aparecen acá, en Empleos.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" className="h-11 lg:h-9" onClick={() => onOpenChange(false)}>
            Ahora no
          </Button>
          <Button className="h-11 lg:h-9" asChild>
            <Link href="/bolsa">Ir a la Bolsa</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function useEventIndex(upcoming: EventVM[], past: EventVM[]) {
  return useMemo(() => {
    const m = new Map<string, { event: EventVM; isUpcoming: boolean }>();
    past.forEach((e) => m.set(e.slug, { event: e, isUpcoming: false }));
    upcoming.forEach((e) => m.set(e.slug, { event: e, isUpcoming: true }));
    return m;
  }, [upcoming, past]);
}

/* ── Host: decide qué overlay mostrar (cargado on-demand por el shell) ── */

export type OverlayState =
  | { kind: "evento"; slug: string }
  | { kind: "nota"; id: string }
  | { kind: "calendario" }
  | { kind: "prensa" }
  | { kind: "miembros" }
  | null;

export function OverlayHost({
  overlay,
  open,
  onClose,
  upcoming,
  past,
  press,
  members,
  onEvent,
  onPress,
}: {
  overlay: OverlayState;
  open: boolean;
  onClose: () => void;
  upcoming: EventVM[];
  past: EventVM[];
  press: PressVM[];
  members: MemberVM[];
  onEvent: (slug: string) => void;
  onPress: (id: string) => void;
}) {
  const eventIndex = useEventIndex(upcoming, past);
  const pressIndex = useMemo(() => new Map(press.map((p) => [p.id, p])), [press]);

  let title = BRAND;
  let description: string | undefined;
  let body: React.ReactNode = null;
  let footer: React.ReactNode = null;
  let hideHeader = false;

  if (overlay?.kind === "evento") {
    const hit = eventIndex.get(overlay.slug);
    if (hit) {
      title = hit.event.title;
      hideHeader = true;
      body = <EventDetail event={hit.event} isUpcoming={hit.isUpcoming} />;
      footer = <EventDetailFooter event={hit.event} isUpcoming={hit.isUpcoming} />;
    } else {
      title = "Evento no encontrado";
      body = <p className="text-[14px] text-muted-foreground">Ese evento ya no está en la agenda.</p>;
      footer = (
        <Button variant="outline" className="h-11" asChild>
          <Link href="/eventos">Ver todos los eventos</Link>
        </Button>
      );
    }
  } else if (overlay?.kind === "nota") {
    const item = pressIndex.get(overlay.id);
    if (item) {
      title = item.title;
      hideHeader = true;
      body = <PressDetail item={item} />;
      footer = <PressDetailFooter item={item} />;
    } else {
      title = "Nota no encontrada";
      body = <p className="text-[14px] text-muted-foreground">No encontramos esa nota.</p>;
    }
  } else if (overlay?.kind === "calendario") {
    title = "Calendario";
    description = "Meetups, hackatones y juntadas de la comunidad.";
    body = <CalendarList upcoming={upcoming} past={past} onOpen={onEvent} />;
    footer = (
      <Button variant="outline" className="h-11" asChild>
        <Link href="/eventos">Abrir página de eventos</Link>
      </Button>
    );
  } else if (overlay?.kind === "prensa") {
    title = "Prensa";
    description = "Lo que salió en los medios sobre la comunidad.";
    body = <PressList press={press} onOpen={onPress} />;
    footer = (
      <Button variant="outline" className="h-11" asChild>
        <Link href="/prensa">Archivo completo</Link>
      </Button>
    );
  } else if (overlay?.kind === "miembros") {
    title = "Miembros";
    body = <MembersList members={members} />;
  }

  return (
    <ResponsiveOverlay
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
      title={title}
      description={description}
      hideHeader={hideHeader}
      footer={footer}
    >
      {body}
    </ResponsiveOverlay>
  );
}
