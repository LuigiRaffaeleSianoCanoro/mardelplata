import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageFrame, PageHero, PageSection } from "@/components/v3/Page";
import { Badge } from "@/components/shadcn/badge";
import { createClient } from "@/lib/supabase/server";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  eventSchema,
  type JsonLdObject,
} from "@/lib/seo/jsonLd";
import {
  mergePublicEvents,
  partitionEvents,
  type PublicEvent,
} from "@/lib/events";
import {
  formatEventDay,
  formatEventMonth,
  formatEventTimeRange,
  getTagFlavor,
  isOnlineEvent,
} from "@/lib/events/format";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Eventos",
  description:
    "Meetups, workshops, charlas y hackatones de la comunidad IT de Mar del Plata.",
  alternates: { canonical: "/eventos" },
};

export default async function EventosPage() {
  const supabase = await createClient();
  const { data: supabaseEvents } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false });

  const all = mergePublicEvents(supabaseEvents);
  const { upcoming, pastCommunity, pastCity } = partitionEvents(all);

  const eventSchemas: JsonLdObject[] = upcoming
    .filter((e) => !e.is_mystery)
    .map((e) =>
      eventSchema({
        name: e.title,
        description: e.subtitle ?? e.description,
        startDate: e.date,
        endDate: e.end_date,
        locationName: e.location,
        url: e.registration_url,
        isOnline: isOnlineEvent(e.location, e.tags),
      }),
    );
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Eventos", path: "/eventos" },
    ]),
    ...eventSchemas,
  ];

  const hasPast = pastCommunity.length > 0 || pastCity.length > 0;

  return (
    <PageFrame>
      <JsonLd schema={schemas} />
      <PageHero
        eyebrow="Calendario"
        title="Eventos en Mar del Plata"
        description="Meetups, workshops, charlas y hackatones para aprender, enseñar y conectar en persona. Agenda sincronizada con Luma."
      />

      <PageSection title={upcoming.length > 0 ? `Próximos · ${upcoming.length}` : "Próximos"}>
        {upcoming.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {upcoming.map((e) => (
              <EventoCard key={e.id} event={e} past={false} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border bg-card/60 p-5 text-[14px] text-muted-foreground">
            No hay encuentros próximos publicados. Mirás el histórico más abajo o volvé a la{" "}
            <Link href="/" className="text-foreground underline-offset-4 hover:underline">
              home
            </Link>
            .
          </p>
        )}
      </PageSection>

      {pastCommunity.length > 0 ? (
        <PageSection title="Histórico — comunidad" muted>
          <div className="grid gap-3 sm:grid-cols-2">
            {pastCommunity.map((e) => (
              <EventoCard key={e.id} event={e} past />
            ))}
          </div>
        </PageSection>
      ) : null}

      {pastCity.length > 0 ? (
        <PageSection title="En la ciudad" muted>
          <p className="mb-4 text-[13.5px] text-muted-foreground">
            Encuentros del ecosistema tech local que sumamos a la agenda.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {pastCity.map((e) => (
              <EventoCard key={e.id} event={e} past cityTone />
            ))}
          </div>
        </PageSection>
      ) : null}

      {upcoming.length === 0 && !hasPast ? (
        <p className="text-[14px] text-muted-foreground">Todavía no hay eventos publicados. Volvé pronto.</p>
      ) : null}
    </PageFrame>
  );
}

function EventoCard({
  event,
  past,
  cityTone = false,
}: {
  event: PublicEvent;
  past: boolean;
  cityTone?: boolean;
}) {
  const day = formatEventDay(event.date);
  const month = formatEventMonth(event.date);
  const time = formatEventTimeRange(event.date, event.end_date);
  const tag = getTagFlavor(event.tags);
  const isMystery = event.is_mystery;
  const hostsLine = event.hosts.length > 0 ? event.hosts.join(" · ") : null;
  const title = isMystery ? event.codename ?? event.title : event.title;
  const desc = isMystery ? event.teaser ?? "" : event.subtitle ?? event.description ?? "";

  const body = (
    <>
      <div className="flex size-[52px] shrink-0 flex-col items-center justify-center rounded-lg border bg-background font-mono">
        <span className="text-[18px] font-semibold leading-none tracking-tight">{day}</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{month}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {!past ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-[color:var(--oxido)]">
              <span className="v3-dot" aria-hidden /> Próximo
            </span>
          ) : null}
          <Badge variant="outline">{tag.label}</Badge>
          {cityTone ? <Badge variant="outline">Ciudad</Badge> : null}
        </div>
        <h3 className="mt-1.5 text-[16px] font-semibold tracking-[-0.02em] text-foreground">{title}</h3>
        {desc ? <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-muted-foreground">{desc}</p> : null}
        {hostsLine ? <p className="mt-1.5 text-[12px] text-muted-foreground">{hostsLine}</p> : null}
        <p className="mt-2 truncate font-mono text-[11px] tracking-[0.02em] text-muted-foreground">
          {time}
          {event.location ? ` · ${event.location}` : ""}
          {event.city ? ` · ${event.city}` : ""}
        </p>
        {event.registration_url ? (
          <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] text-foreground">
            Ver en Luma <ArrowUpRight className="size-3.5" strokeWidth={1.75} aria-hidden />
          </span>
        ) : null}
      </div>
    </>
  );

  const cls = cn(
    "v3-press flex gap-4 rounded-xl border bg-card/70 p-4 transition-colors hover:bg-card",
    past && "opacity-80",
  );

  if (event.registration_url) {
    return (
      <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  }
  return <article className={cls}>{body}</article>;
}
