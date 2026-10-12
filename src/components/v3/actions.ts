"use client";

import type { EventVM } from "@/lib/v3/types";
import { BRAND } from "@/lib/v3/brand";

function icsDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/\r\n?|\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

/** RFC 5545: líneas de máx. 75 octetos, continuación con CRLF + espacio. */
function icsFold(line: string) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let cur = "";
  for (const ch of line) {
    if (enc.encode(cur + ch).length > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = "";
    }
    cur += ch;
  }
  out.push(cur);
  return out.join("\r\n ");
}

/** Descarga un .ics del evento (funciona en iOS, Android y desktop). */
export async function addToCalendar(e: EventVM) {
  const end = e.endISO ?? new Date(new Date(e.startISO).getTime() + 2 * 3600_000).toISOString();
  const location = [e.venueName, e.venueAddress, e.city].filter(Boolean).join(", ");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${BRAND}//eventos//ES`,
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${e.slug}@${BRAND}`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(e.startISO)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(e.title)}`,
    location ? `LOCATION:${icsEscape(location)}` : "",
    `DESCRIPTION:${icsEscape([e.excerpt, e.registrationUrl].filter(Boolean).join("\n\n"))}`,
    e.registrationUrl && /^https?:\/\//.test(e.registrationUrl) ? `URL:${e.registrationUrl}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  const blob = new Blob([lines.map(icsFold).join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  const { toast } = await import("sonner");
  toast("Agregado al calendario", { description: e.title });
}

/** Web Share si existe; si no, copia el link. */
export async function shareLink(opts: { url?: string; title?: string; text?: string } = {}) {
  const url = opts.url ?? window.location.href;
  const title = opts.title ?? BRAND;
  if (typeof navigator !== "undefined" && "share" in navigator && window.matchMedia("(pointer: coarse)").matches) {
    try {
      await navigator.share({ url, title, text: opts.text });
      return;
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return;
    }
  }
  const { toast } = await import("sonner");
  try {
    await navigator.clipboard.writeText(url);
    toast("Link copiado", { description: url.replace(/^https?:\/\//, "") });
  } catch {
    toast("No pudimos copiar el link");
  }
}
