import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";
import JsonLd from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  eventSchema,
  type JsonLdObject,
} from "@/lib/seo/jsonLd";

interface Event {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  end_date: string | null;
  location: string | null;
  tags: string[];
  registration_url: string | null;
  is_mystery: boolean;
  codename: string | null;
  teaser: string | null;
  is_published: boolean;
}

function formatDay(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit" });
}
function formatMonth(d: string) {
  return new Date(d)
    .toLocaleDateString("es-AR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}
function getTagFlavor(tags: string[]): { label: string; flavor: "violet" | "cyan" | "amber" | "rose" } {
  const t = (tags?.[0] ?? "meetup").toLowerCase();
  if (t.includes("taller") || t.includes("workshop")) return { label: "TALLER", flavor: "cyan" };
  if (t.includes("charla") || t.includes("talk")) return { label: "CHARLA", flavor: "violet" };
  if (t.includes("hackat")) return { label: "HACKATÓN", flavor: "rose" };
  if (t.includes("meetup")) return { label: "MEETUP", flavor: "violet" };
  return { label: t.toUpperCase(), flavor: "amber" };
}

export const metadata = {
  title: "Eventos",
  description:
    "Meetups, workshops, charlas y hackatones de la comunidad IT de Mar del Plata.",
  alternates: { canonical: "/eventos" },
};

function isOnlineEvent(e: Event): boolean {
  const haystack = `${e.location ?? ""} ${e.tags?.join(" ") ?? ""}`.toLowerCase();
  return /online|virtual|remoto|zoom|meet|stream/.test(haystack);
}

export default async function EventosPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false });

  const now = Date.now();
  const all = (events ?? []) as Event[];
  const upcoming = all
    .filter((e) => new Date(e.date).getTime() >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = all
    .filter((e) => new Date(e.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // JSON-LD: sólo eventos próximos (los pasados no aportan rich results).
  // Excluimos misteriosos sin fecha de valor SEO real.
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
        isOnline: isOnlineEvent(e),
      }),
    );
  const schemas: JsonLdObject[] = [
    breadcrumbSchema([
      { name: "Inicio", path: "/" },
      { name: "Eventos", path: "/eventos" },
    ]),
    ...eventSchemas,
  ];

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
              en persona.
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            {upcoming.length > 0 && (
              <Reveal>
                <h2 className="eventos-x-section-title">Próximos</h2>
                <div className="eventos-x-grid">
                  {upcoming.map((e) => (
                    <EventoCard key={e.id} event={e} past={false} />
                  ))}
                </div>
              </Reveal>
            )}

            {past.length > 0 && (
              <Reveal delay={120}>
                <h2 className="eventos-x-section-title eventos-x-section-title--muted">Pasados</h2>
                <div className="eventos-x-grid">
                  {past.map((e) => (
                    <EventoCard key={e.id} event={e} past={true} />
                  ))}
                </div>
              </Reveal>
            )}

            {upcoming.length === 0 && past.length === 0 && (
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

function EventoCard({ event, past }: { event: Event; past: boolean }) {
  const day = formatDay(event.date);
  const month = formatMonth(event.date);
  const time = formatTime(event.date);
  const tag = getTagFlavor(event.tags);
  const isMystery = event.is_mystery;

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
        <p className="event-card-meta">
          {time}
          {event.location && (
            <>
              <span className="event-card-meta-sep">·</span>
              {event.location}
            </>
          )}
        </p>
        <span className={`shell-tag shell-tag--${tag.flavor}`}>{tag.label}</span>
      </div>
    </>
  );

  if (event.registration_url && !past) {
    return (
      <a
        href={event.registration_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`event-card eventos-x-card ${past ? "eventos-x-card--past" : ""}`}
      >
        {inner}
      </a>
    );
  }
  return (
    <article className={`event-card eventos-x-card ${past ? "eventos-x-card--past" : ""}`}>
      {inner}
    </article>
  );
}
