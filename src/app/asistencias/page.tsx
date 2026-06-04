import Link from "next/link";
import AppShell from "@/components/app/AppShell";
import Reveal from "@/components/Reveal";
import { createClient } from "@/lib/supabase/server";

interface AttendanceEvent {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  date: string;
  location: string | null;
  tags: string[];
  is_mystery: boolean;
  codename: string | null;
  teaser: string | null;
}

interface AttendanceRow {
  id: string;
  scanned_at: string;
  event: AttendanceEvent | AttendanceEvent[] | null;
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
  title: "Mis asistencias — mardelplata.dev.ar",
  description: "Eventos a los que asististe en la comunidad IT de Mar del Plata.",
};

export default async function AsistenciasPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth?.user ?? null;

  if (!user) {
    return (
      <AppShell>
        <main className="eventos-x">
          <header className="shell-section shell-section--lg">
            <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
              <p className="shell-eyebrow">MIS ASISTENCIAS</p>
              <h1 className="shell-title shell-title--xl">
                Tu <em>bitácora</em> de eventos.
              </h1>
              <p className="shell-lead" style={{ marginInline: "auto" }}>
                Iniciá sesión para ver los eventos a los que asististe.
              </p>
              <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "0.75rem" }}>
                <Link href="/auth/login" className="hero-x-cta-primary">
                  Ingresar <span aria-hidden>→</span>
                </Link>
                <Link href="/eventos" className="hero-x-cta-ghost">
                  Ver eventos abiertos
                </Link>
              </div>
            </div>
          </header>
        </main>
      </AppShell>
    );
  }

  const { data: rowsRaw } = await supabase
    .from("event_attendance")
    .select(
      "id, scanned_at, event:events!event_id(id, title, subtitle, description, date, location, tags, is_mystery, codename, teaser)",
    )
    .eq("user_id", user.id)
    .order("scanned_at", { ascending: false });

  const rows = ((rowsRaw ?? []) as AttendanceRow[])
    .map((r) => ({
      ...r,
      event: Array.isArray(r.event) ? r.event[0] ?? null : r.event,
    }))
    .filter((r): r is AttendanceRow & { event: AttendanceEvent } => r.event != null);

  const total = rows.length;

  return (
    <AppShell>
      <main className="eventos-x">
        <header className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">MIS ASISTENCIAS</p>
            <h1 className="shell-title shell-title--xl">
              Tu <em>bitácora</em> de eventos.
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              {total === 0
                ? "Todavía no registramos asistencia tuya. Cuando te escaneen el QR en un evento, aparece acá."
                : total === 1
                  ? "Estuviste en 1 evento de la red."
                  : `Estuviste en ${total} eventos de la red.`}
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner">
            {rows.length === 0 ? (
              <p className="bolsa-x-empty">
                Aún no asististe a ningún evento. <Link href="/eventos" className="text-white underline-offset-4 hover:underline">Mirá la agenda</Link> y sumate al próximo.
              </p>
            ) : (
              <Reveal>
                <h2 className="eventos-x-section-title">Eventos a los que asististe</h2>
                <div className="eventos-x-grid">
                  {rows.map((r) => (
                    <AttendanceCard
                      key={r.id}
                      event={r.event}
                      scannedAt={r.scanned_at}
                    />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </section>
      </main>
    </AppShell>
  );
}

function AttendanceCard({
  event,
  scannedAt,
}: {
  event: AttendanceEvent;
  scannedAt: string;
}) {
  const day = formatDay(event.date);
  const month = formatMonth(event.date);
  const time = formatTime(event.date);
  const tag = getTagFlavor(event.tags);
  const isMystery = event.is_mystery;
  const scannedDate = new Date(scannedAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="event-card eventos-x-card eventos-x-card--past">
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
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <span className={`shell-tag shell-tag--${tag.flavor}`}>{tag.label}</span>
          <span className="event-card-meta" style={{ marginTop: 0 }}>
            Escaneado · {scannedDate}
          </span>
        </div>
      </div>
    </article>
  );
}
