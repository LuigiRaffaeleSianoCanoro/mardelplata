const TZ = "America/Argentina/Buenos_Aires";

const dateOpts = { timeZone: TZ } as const;

export function formatEventDay(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { ...dateOpts, day: "2-digit" });
}

export function formatEventMonth(d: string) {
  return new Date(d)
    .toLocaleDateString("es-AR", { ...dateOpts, month: "short" })
    .replace(".", "")
    .toUpperCase();
}

/** Hora suelta en ART (ej. «17:00»). */
export function formatEventTime(d: string) {
  return new Date(d).toLocaleTimeString("es-AR", {
    ...dateOpts,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Rango corto tipo home: «17–20 ART». Sin end → «17:00 ART». */
export function formatEventTimeRange(start: string, end?: string | null) {
  // hour only when minutes are :00; otherwise HH:mm
  const compact = (iso: string) => {
    const parts = new Intl.DateTimeFormat("es-AR", {
      timeZone: TZ,
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(new Date(iso));
    const hour = parts.find((p) => p.type === "hour")?.value ?? "";
    const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
    return minute === "00" ? hour : `${hour}:${minute}`;
  };
  if (end) return `${compact(start)}–${compact(end)} ART`;
  return `${compact(start)} ART`;
}

export function getTagFlavor(
  tags: string[],
): { label: string; flavor: "violet" | "cyan" | "amber" | "rose" } {
  const t = (tags?.[0] ?? "meetup").toLowerCase();
  if (t.includes("taller") || t.includes("workshop")) return { label: "TALLER", flavor: "cyan" };
  if (t.includes("charla") || t.includes("talk")) return { label: "CHARLA", flavor: "violet" };
  if (t.includes("hackat")) return { label: "HACKATÓN", flavor: "rose" };
  if (t.includes("meetup")) return { label: "MEETUP", flavor: "violet" };
  return { label: t.toUpperCase(), flavor: "amber" };
}

export function isOnlineEvent(location: string | null, tags: string[]): boolean {
  const haystack = `${location ?? ""} ${tags?.join(" ") ?? ""}`.toLowerCase();
  return /online|virtual|remoto|zoom|meet|stream/.test(haystack);
}
