import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
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
  formatEventTime,
  getTagFlavor,
  isOnlineEvent,
} from "@/lib/events/format";

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
    <AppShell>
      <JsonLd schema={schemas} />
      <main className="eventos-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">EN LA FELIZ, SIEMPRE PASA ALGO</p>
            <h1 className="shell-title shell-title--xl">
              Eventos en la <em>costa.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              Meetups, workshops, charlas y hackatones para aprender, enseñar y conectar
              en persona. Agenda sincronizada con eventos públicos en Luma.
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            {upcoming.length > 0 ? (
              <Reveal>
                <h2 className="eventos-x-section-title">Próximos</h2>
                <div className="eventos-x-grid">
                  {upcoming.map((e) => (
                    <EventoCard key={e.id} event={e} past={false} />
                  ))}
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <p className="bolsa-x-empty">
                  No hay encuentros próximos publicados en Luma. Seguinos en{" "}
                  <a href="/eventos" className="shell-link">
                    el histórico
                  </a>{" "}
                  o unite al grupo de WhatsApp para enterarte primero.
                </p>
              </Reveal>
            )}

            {pastCommunity.length > 0 && (
              <Reveal delay={120}>
                <h2 className="eventos-x-section-title eventos-x-section-title--muted">
                  Histórico — comunidad
                </h2>
                <div className="eventos-x-grid">
                  {pastCommunity.map((e) => (
                    <EventoCard key={e.id} event={e} past={true} />
                  ))}
                </div>
              </Reveal>
            )}

            {pastCity.length > 0 && (
              <Reveal delay={180}>
                <h2 className="eventos-x-section-title eventos-x-section-title--muted">
                  En la ciudad
                </h2>
                <p className="shell-lead eventos-x-city-lead">
                  Encuentros del ecosistema tech local que sumamos a la agenda.
                </p>
                <div className="eventos-x-grid">
                  {pastCity.map((e) => (
                    <EventoCard key={e.id} event={e} past={true} cityTone />
                  ))}
                </div>
              </Reveal>
            )}

            {upcoming.length === 0 && !hasPast && (
              <p className="bolsa-x-empty">
                Todavía no hay eventos publicados. Volvé pronto.
              </p>
            )}
          </div>
        </section>
      </main>
    </AppShell>
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
  const time = formatEventTime(event.date);
  const tag = getTagFlavor(event.tags);
  const isMystery = event.is_mystery;
  const hostsLine = event.hosts.length > 0 ? event.hosts.join(" · ") : null;

  const inner = (
    <>
      <div className="event-card-date">
        <span className="event-card-day">{day}</span>
        <span className="event-card-month">{month}</span>
      </div>
      <div className="event-card-body">
        <h3 className="event-card-title">
          {isMystery ? event.codename ?? event.title : event.title}
        </h3>
        {(event.subtitle || event.description || event.teaser) && (
          <p className="event-card-desc">
            {isMystery
              ? event.teaser ?? ""
              : event.subtitle ?? event.description ?? ""}
          </p>
        )}
        {hostsLine && <p className="event-card-hosts">{hostsLine}</p>}
        <p className="event-card-meta">
          {time}
          {event.location && (
            <>
              <span className="event-card-meta-sep">·</span>
              {event.location}
            </>
          )}
          {event.city && (
            <>
              <span className="event-card-meta-sep">·</span>
              {event.city}
            </>
          )}
        </p>
        <div className="event-card-footer">
          <span className={`shell-tag shell-tag--${tag.flavor}`}>{tag.label}</span>
          {event.registration_url && (
            <span className="event-card-luma">Ver en Luma ↗</span>
          )}
        </div>
      </div>
    </>
  );

  const className = [
    "event-card",
    "eventos-x-card",
    past ? "eventos-x-card--past" : "",
    cityTone ? "eventos-x-card--city" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (event.registration_url) {
    return (
      <a
        href={event.registration_url}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {inner}
      </a>
    );
  }
  return <article className={className}>{inner}</article>;
}
