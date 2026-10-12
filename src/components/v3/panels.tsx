"use client";

import Link from "next/link";
import { ArrowUpRight, Briefcase, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/shadcn/toggle-group";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/shadcn/empty";
import { EventRow, ICON_STROKE, Label, NextEventCard, PressRow, PressTeaser, TextLink } from "./parts";
import type { EventVM, JobVM, PressVM } from "@/lib/v3/types";

export const panelCls = "flex h-full min-h-0 flex-col gap-3 lg:gap-4";

/* ── Eventos ─────────────────────────────────────────────────────────── */

export function EventsPanel({
  upcoming,
  past,
  press,
  jobs,
  view,
  onView,
  onEvent,
  onPress,
  onCalendar,
  onPressAll,
  onPublish,
  onJobs,
}: {
  upcoming: EventVM[];
  past: EventVM[];
  press: PressVM[];
  jobs: JobVM[];
  view: "proximos" | "pasados";
  onView: (v: "proximos" | "pasados") => void;
  onEvent: (slug: string) => void;
  onPress: (id: string) => void;
  onCalendar: () => void;
  onPressAll: () => void;
  onPublish: () => void;
  onJobs: () => void;
}) {
  const next = upcoming[0] ?? null;
  const second = upcoming[1] ?? null;
  const months = Array.from(new Set(upcoming.slice(0, 4).map((e) => e.monthLong)));
  // En mobile no hay toggle: siempre «próximos».
  const showPast = view === "pasados";

  return (
    <div className={panelCls}>
      <div className="hidden shrink-0 items-center justify-between lg:flex">
        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => v && onView(v as "proximos" | "pasados")}
          variant="outline"
          size="sm"
          aria-label="Filtrar eventos"
          className="bg-muted/60 rounded-[10px] border p-[2px] shadow-none"
        >
          <ToggleGroupItem value="proximos" className="h-7 rounded-[7px] border-0 px-3 text-[12.5px] data-[state=on]:bg-background data-[state=on]:shadow-[0_0_0_1px_var(--border-strong)]">
            Próximos
          </ToggleGroupItem>
          <ToggleGroupItem value="pasados" className="h-7 rounded-[7px] border-0 px-3 text-[12.5px] data-[state=on]:bg-background data-[state=on]:shadow-[0_0_0_1px_var(--border-strong)]">
            Pasados
          </ToggleGroupItem>
        </ToggleGroup>
        <button type="button" onClick={onCalendar} className="v3-label inline-flex h-8 items-center gap-1 hover-device:hover:text-foreground">
          {showPast
            ? `${past.length} pasados`
            : `${upcoming.length} ${upcoming.length === 1 ? "evento" : "eventos"}${months.length ? ` · ${months.join(" / ")}` : ""}`}
          <ChevronRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
        </button>
      </div>

      {/* Mobile siempre muestra próximos; desktop respeta el toggle. */}
      <div className={cn("flex shrink-0 flex-col gap-3 lg:gap-4", showPast && "lg:hidden")}>
        {next ? (
          <NextEventCard event={next} onDetails={() => onEvent(next.slug)} />
        ) : (
          <div className="v3-glass flex shrink-0 flex-col gap-2 rounded-xl border p-4 lg:p-5">
            <Label>Próximo evento</Label>
            <p className="text-[15px]">Todavía no anunciamos la próxima juntada.</p>
            <button type="button" onClick={onCalendar} className="v3-label inline-flex min-h-11 items-center gap-1 self-start hover-device:hover:text-foreground">
              Ver eventos pasados <ChevronRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
            </button>
          </div>
        )}
        {second ? <EventRow event={second} onOpen={() => onEvent(second.slug)} data-fit="2" /> : null}
        <button
          type="button"
          onClick={onCalendar}
          data-fit="3"
          className="v3-label flex h-11 shrink-0 items-center justify-between px-1 hover-device:hover:text-foreground lg:hidden shorter:hidden"
        >
          <span>Ver calendario completo</span>
          <ChevronRight className="size-3.5" strokeWidth={ICON_STROKE} aria-hidden />
        </button>
      </div>

      {showPast ? (
        <div className="hidden shrink-0 flex-col gap-3 lg:flex">
          {past.slice(0, 5).map((e, i) => (
            <EventRow key={e.slug} event={e} onOpen={() => onEvent(e.slug)} data-fit={String(10 - i)} />
          ))}
        </div>
      ) : null}

      {press[0] ? (
        <PressTeaser item={press[0]} onOpen={() => onPress(press[0].id)} className="mt-auto lg:hidden short:hidden" data-fit="4" />
      ) : null}

      {press.length > 0 ? (
        <div className="v3-glass hidden shrink-0 flex-col rounded-xl border px-5 pt-3 pb-1 lg:flex" data-fit="5">
          <div className="flex items-center justify-between">
            <Label>Prensa reciente</Label>
            <button type="button" onClick={onPressAll} className="v3-label inline-flex h-8 items-center gap-1 hover-device:hover:text-foreground">
              Ver todo <ChevronRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
            </button>
          </div>
          <div className="divide-y">
            {press.slice(0, 3).map((p, i) => (
              <PressRow key={p.id} item={p} onOpen={() => onPress(p.id)} data-fit={i === 2 ? "7" : undefined} />
            ))}
          </div>
        </div>
      ) : null}

      <div
        className="hidden min-h-[72px] flex-1 items-center gap-4 rounded-xl border border-dashed px-5 lg:flex dshort:!hidden"
        data-fit="6"
      >
        <Briefcase className="size-5 shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
        <div className="min-w-0 flex-1">
          <Label className="!text-[10px]">Empleos</Label>
          <div className="mt-1 text-[13.5px]">
            {jobs.length > 0
              ? `${jobs.length} ${jobs.length === 1 ? "búsqueda abierta" : "búsquedas abiertas"} en la comunidad.`
              : "Por ahora no hay búsquedas. ¿Contratás? Publicá la primera."}
          </div>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-[12.5px]" onClick={jobs.length > 0 ? onJobs : onPublish}>
          {jobs.length > 0 ? "Ver" : "Publicar"}
        </Button>
      </div>
    </div>
  );
}

/* ── Prensa ──────────────────────────────────────────────────────────── */

export function PressPanel({
  press,
  onPress,
  onPressAll,
}: {
  press: PressVM[];
  onPress: (id: string) => void;
  onPressAll: () => void;
}) {
  return (
    <div className={panelCls}>
      <section className="v3-glass flex shrink-0 flex-col rounded-xl border px-4 pt-3 pb-1 lg:px-5">
        <div className="flex items-center justify-between">
          <Label>Prensa reciente</Label>
          <button type="button" onClick={onPressAll} className="v3-label inline-flex min-h-11 items-center gap-1 hover-device:hover:text-foreground lg:min-h-8">
            Ver todo · {press.length} <ChevronRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
          </button>
        </div>
        <div className="divide-y">
          {press.slice(0, 3).map((p, i) => (
            <PressRow key={p.id} item={p} onOpen={() => onPress(p.id)} data-fit={i === 0 ? undefined : String(4 - i)} />
          ))}
        </div>
      </section>
      <TextLink href="/prensa" className="shrink-0 self-start px-1">
        Archivo completo de prensa
      </TextLink>
    </div>
  );
}

/* ── Empleos ─────────────────────────────────────────────────────────── */

export function JobsPanel({ jobs, onPublish }: { jobs: JobVM[]; onPublish: () => void }) {
  if (jobs.length === 0) {
    return (
      <div className={panelCls}>
        <Empty className="v3-glass flex-1 justify-center gap-4 rounded-xl border border-dashed p-6 short:gap-3 short:p-4">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Briefcase strokeWidth={ICON_STROKE} />
            </EmptyMedia>
            <EmptyTitle className="text-[17px] tracking-[-0.02em]">Por ahora no hay búsquedas.</EmptyTitle>
            <EmptyDescription>¿Contratás? Publicá la primera.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button className="h-11 lg:h-9" onClick={onPublish}>
              Publicar búsqueda
            </Button>
            <Button variant="outline" className="h-11 lg:h-9" asChild>
              <Link href="/primer-trabajo">Primer trabajo</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }
  return (
    <div className={panelCls}>
      <section className="v3-glass flex shrink-0 flex-col rounded-xl border px-4 pt-3 pb-1 lg:px-5">
        <div className="flex items-center justify-between">
          <Label>Búsquedas abiertas · {jobs.length}</Label>
          <TextLink href="/bolsa" className="lg:min-h-8">Bolsa</TextLink>
        </div>
        <div className="divide-y">
          {jobs.slice(0, 4).map((j, i) => {
            const inner = (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-medium">{j.title}</span>
                  <span className="block truncate text-[12.5px] text-muted-foreground">
                    {[j.author, j.dateShort, ...j.tags].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <ArrowUpRight className="size-3.5 shrink-0 text-subtle" strokeWidth={ICON_STROKE} aria-hidden />
              </>
            );
            const cls = "flex min-h-14 items-center gap-3 py-2 hover-device:hover:opacity-80";
            return j.url ? (
              <a key={j.id} href={j.url} target="_blank" rel="noopener noreferrer" className={cls} data-fit={i > 0 ? String(5 - i) : undefined}>
                {inner}
              </a>
            ) : (
              <Link key={j.id} href="/bolsa" className={cls} data-fit={i > 0 ? String(5 - i) : undefined}>
                {inner}
              </Link>
            );
          })}
        </div>
      </section>
      <div className="mt-auto flex shrink-0 gap-2 pb-3 lg:pb-0">
        <Button className="h-11 flex-1 lg:h-10" onClick={onPublish}>
          Publicar búsqueda
        </Button>
        <Button variant="outline" className="h-11 lg:h-10" asChild>
          <Link href="/primer-trabajo">Primer trabajo</Link>
        </Button>
      </div>
    </div>
  );
}
