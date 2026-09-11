import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  isExcludedEvent,
  type CuratedEvent,
} from "@/content/events";

const ITEMS_DIR = path.join(process.cwd(), "src/content/events/items");

/** Carga todos los JSON de items/ en runtime (solo server). */
export function loadCuratedEvents(): CuratedEvent[] {
  if (!fs.existsSync(ITEMS_DIR)) return [];

  return fs
    .readdirSync(ITEMS_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(ITEMS_DIR, file), "utf8");
      return JSON.parse(raw) as CuratedEvent;
    })
    .filter((event) => !isExcludedEvent(event))
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
}
