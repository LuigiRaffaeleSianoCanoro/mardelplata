import fs from "node:fs";
import path from "node:path";
import { pressItems } from "./items";
import type { PressEventTag, PressItem } from "./types";
import { PRESS_EVENT_LABELS } from "./types";

export { pressItems } from "./items";
export type { PressEventTag, PressItem, PressType } from "./types";
export { PRESS_EVENT_LABELS, PRESS_TYPE_LABELS } from "./types";

const ARCHIVES_DIR = path.join(process.cwd(), "src/content/prensa/archives");

export function getAllPressItems(): PressItem[] {
  return [...pressItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPressItemById(id: string): PressItem | undefined {
  return pressItems.find((item) => item.id === id);
}

export function getPressEventTags(): { tag: PressEventTag; label: string; count: number }[] {
  const counts = new Map<PressEventTag, number>();
  for (const item of pressItems) {
    for (const tag of item.events) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return (Object.keys(PRESS_EVENT_LABELS) as PressEventTag[])
    .filter((tag) => counts.has(tag))
    .map((tag) => ({
      tag,
      label: PRESS_EVENT_LABELS[tag],
      count: counts.get(tag) ?? 0,
    }));
}

export function hasArchive(item: PressItem): boolean {
  if (!item.archivePath) return false;
  return fs.existsSync(path.join(ARCHIVES_DIR, item.archivePath));
}

export function readArchive(item: PressItem): string | null {
  if (!item.archivePath) return null;
  const filePath = path.join(ARCHIVES_DIR, item.archivePath);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

export function parseArchiveMeta(raw: string): {
  body: string;
  capturedAt?: string;
  source?: string;
} {
  const lines = raw.split("\n");
  let capturedAt: string | undefined;
  let source: string | undefined;
  const bodyStart = lines.findIndex((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("<!-- capturedAt:")) {
      capturedAt = trimmed.replace("<!-- capturedAt:", "").replace("-->", "").trim();
    }
    if (trimmed.startsWith("<!-- source:")) {
      source = trimmed.replace("<!-- source:", "").replace("-->", "").trim();
    }
    if (trimmed.startsWith("<!-- archiveStatus:") || trimmed.startsWith("<!-- archive")) {
      return false;
    }
    return i > 0 && trimmed.startsWith("#");
  });
  const body = bodyStart >= 0 ? lines.slice(bodyStart).join("\n").trim() : raw.trim();
  return { body, capturedAt, source };
}
