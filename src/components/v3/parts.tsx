"use client";

import Link from "next/link";
import { ArrowUpRight, ChevronRight, MapPin, Newspaper, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/shadcn/hover-card";
import { Badge } from "@/components/shadcn/badge";
import type { EventHostVM, EventVM, PressVM } from "@/lib/v3/types";

export const ICON_STROKE = 1.75;

export function Label({ className, children, ...rest }: React.ComponentProps<"span">) {
  return (
    <span className={cn("v3-label", className)} {...rest}>
      {children}
    </span>
  );
}

export function UpcomingBadge({ label = "Próximo" }: { label?: string }) {
  return (
    <Badge variant="outline" className="text-foreground">
      <span className="v3-dot" aria-hidden />
      {label}
    </Badge>
  );
}

export function DateTile({ month, day, className }: { month: string; day: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 flex-col items-center justify-center rounded-lg border leading-none lg:size-11",
        className,
      )}
      aria-hidden
    >
      <span className="font-mono text-[9px] text-muted-foreground">{month}</span>
      <span className="mt-0.5 text-[16px] font-semibold lg:text-[17px]">{day}</span>
    </div>
  );
}

function HostAvatar({ host, size = 28 }: { host: EventHostVM; size?: number }) {
  return (
    <Avatar
      className="border-2 border-background bg-muted"
      style={{ width: size, height: size }}
    >
      {host.avatarUrl ? <AvatarImage src={host.avatarUrl} alt={host.name} /> : null}
      <AvatarFallback className="bg-muted font-mono text-[10.5px] font-semibold text-foreground">
        {host.initials}
      </AvatarFallback>
    </Avatar>
  );
}

/** Avatares apilados; en desktop cada uno muestra el nombre en HoverCard. */
export function HostAvatars({ hosts, max = 4 }: { hosts: EventHostVM[]; max?: number }) {
  if (hosts.length === 0) return <span />;
  const shown = hosts.slice(0, max);
  return (
    <div className="flex -space-x-2" aria-label={`Organizan: ${hosts.map((h) => h.name).join(", ")}`} role="group">
      {shown.map((h) => (
        <HoverCard key={h.name} openDelay={150} closeDelay={60}>
          <HoverCardTrigger asChild>
            <span tabIndex={-1} className="rounded-full">
              <HostAvatar host={h} />
            </span>
          </HoverCardTrigger>
          <HoverCardContent side="top" className="w-auto px-3 py-2 text-[13px]">
            {h.name}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}

export function eventMetaLine(e: EventVM): string {
  const bits: string[] = [];
  if (e.price) bits.push(e.price);
  if (e.capacity) bits.push(`cupo ${e.capacity}`);
  if (bits.length === 0) bits.push(...e.tags.slice(0, 3));
  return bits.join(" · ");
}

/** Card del próximo evento (mobile + desktop). */
export function NextEventCard({
  event,
  onDetails,
  isUpcoming = true,
}: {
  event: EventVM;
  onDetails: () => void;
  isUpcoming?: boolean;
}) {
  const meta = eventMetaLine(event);
  return (
    <article className="v3-glass flex shrink-0 flex-col gap-3 rounded-xl border p-4 lg:gap-3.5 lg:p-5">
      <div className="flex items-center justify-between gap-2">
        {isUpcoming ? <UpcomingBadge /> : <Badge variant="outline">Pasado</Badge>}
        <Label className="truncate">
          {event.dateShort} · {event.timeShort}
        </Label>
      </div>
      <h2 className="text-[22px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance lg:text-[26px] lg:tracking-[-0.035em]">
        {event.title}
      </h2>
      {event.excerpt ? (
        <p className="hidden text-[14px] leading-[1.45] text-muted-foreground lg:line-clamp-2 dshort:!hidden">
          {event.excerpt}
        </p>
      ) : null}
      <div className="flex flex-col gap-1.5 text-[13.5px] text-muted-foreground lg:grid lg:grid-cols-2 lg:gap-2 lg:text-[13px]">
        {event.venueName ? (
          <div className="flex min-w-0 items-center gap-2">
            <MapPin className="size-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
            <span className="truncate">
              {event.venueName}
              {event.venueAddress ? ` · ${event.venueAddress}` : ""}
            </span>
          </div>
        ) : null}
        {meta ? (
          <div className="flex min-w-0 items-center gap-2">
            <Ticket className="size-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
            <span className="truncate">{meta}</span>
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-2 pt-1">
        <HostAvatars hosts={event.hosts} />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onDetails}
            className="v3-press inline-flex h-11 items-center gap-1.5 rounded-lg border border-border-strong bg-background px-4 text-[13px] font-medium hover-device:hover:bg-accent lg:h-9 lg:px-3.5"
          >
            <span className="lg:hidden">Ver detalles</span>
            <span className="hidden lg:inline">Detalles</span>
            <ChevronRight className="size-3.5 lg:hidden" strokeWidth={ICON_STROKE} aria-hidden />
          </button>
          {event.registrationUrl && isUpcoming ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v3-press hidden h-9 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-primary-foreground hover-device:hover:bg-primary/90 lg:inline-flex"
            >
              Anotarme
              <ArrowUpRight className="size-3.5" strokeWidth={ICON_STROKE} aria-hidden />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

/** Fila compacta de evento (Data Challenge, calendario). */
export function EventRow({
  event,
  onOpen,
  className,
  ...rest
}: {
  event: EventVM;
  onOpen: () => void;
  className?: string;
} & Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "v3-glass v3-press flex h-16 w-full shrink-0 items-center gap-3 rounded-xl border px-4 text-left hover-device:hover:border-border-strong lg:h-[72px] lg:gap-4 lg:px-5",
        className,
      )}
      {...rest}
    >
      <DateTile month={event.month} day={event.day} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium tracking-[-0.01em] lg:text-[16px]">{event.title}</span>
        <span className="block truncate text-[12.5px] text-muted-foreground lg:text-[13px]">
          {event.dateShort} · {event.timeShort}
          {event.venueName ? ` · ${event.venueName}` : ""}
        </span>
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
    </button>
  );
}

/** Teaser de prensa (una nota) para mobile. */
export function PressTeaser({ item, onOpen, className, ...rest }: { item: PressVM; onOpen: () => void; className?: string } & Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "v3-glass v3-press flex w-full shrink-0 items-start gap-3 rounded-xl border px-4 py-3 text-left",
        className,
      )}
      {...rest}
    >
      <Newspaper className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={ICON_STROKE} aria-hidden />
      <span className="min-w-0 flex-1">
        <Label className="block truncate !text-[10px]">Prensa · {item.outlet}</Label>
        <span className="mt-1 line-clamp-2 block text-[13.5px] leading-[1.35]">{item.title}</span>
      </span>
      <ArrowUpRight className="mt-0.5 size-3.5 shrink-0 text-subtle" strokeWidth={ICON_STROKE} aria-hidden />
    </button>
  );
}

/** Fila de prensa con fecha (lista desktop / tab Prensa). */
export function PressRow({ item, onOpen, className, ...rest }: { item: PressVM; onOpen: () => void; className?: string } & Omit<React.ComponentProps<"button">, "onClick">) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn("flex min-h-11 w-full items-start gap-3 py-2.5 text-left hover-device:hover:opacity-80", className)}
      {...rest}
    >
      <span className="w-9 shrink-0 pt-[3px] font-mono text-[11px] text-subtle">{item.dateShort}</span>
      <span className="min-w-0 flex-1">
        <Label className="block truncate !text-[10.5px]">{item.outlet}</Label>
        <span className="mt-0.5 line-clamp-2 block text-[13.5px] leading-[1.35]">{item.title}</span>
      </span>
      <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-subtle" strokeWidth={ICON_STROKE} aria-hidden />
    </button>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("v3-label inline-flex min-h-11 items-center gap-1 hover-device:hover:text-foreground", className)}
    >
      {children}
      <ChevronRight className="size-3" strokeWidth={ICON_STROKE} aria-hidden />
    </Link>
  );
}
