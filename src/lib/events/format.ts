export function formatEventDay(d: string) {
  return new Date(d).toLocaleDateString("es-AR", { day: "2-digit" });
}

export function formatEventMonth(d: string) {
  return new Date(d)
    .toLocaleDateString("es-AR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
}

export function formatEventTime(d: string) {
  return new Date(d).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
