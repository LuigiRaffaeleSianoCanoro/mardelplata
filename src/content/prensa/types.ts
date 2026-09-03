export type PressType = "reportaje" | "gacetilla" | "institucional";

export type PressEventTag =
  | "cafe-cursor"
  | "aticma"
  | "bit-beat"
  | "aleph"
  | "cursor-hackathon"
  | "municipio-neme";

export interface PressItem {
  id: string;
  title: string;
  /** Título original del medio, si difiere del canónico (ej. "Bit a Bit"). */
  outletTitle?: string;
  outlet: string;
  date: string;
  url: string;
  excerpt: string;
  events: PressEventTag[];
  type: PressType;
  archivePath?: string;
  capturedAt?: string;
  /** Sin URL periodística verificada (stub). */
  pendingSource?: boolean;
  /** Fuente primaria del evento, no cobertura de prensa. */
  primarySource?: boolean;
  /** Archivo parcial (ej. LinkedIn con login). */
  archivePartial?: boolean;
}

export const PRESS_EVENT_LABELS: Record<PressEventTag, string> = {
  "cafe-cursor": "Café Cursor",
  aticma: "Alianza ATICMA",
  "bit-beat": "Bit & Beat",
  aleph: "Aleph Hackathon",
  "cursor-hackathon": "Cursor Hackathon",
  "municipio-neme": "Municipio / Neme",
};

export const PRESS_TYPE_LABELS: Record<PressType, string> = {
  reportaje: "Reportaje",
  gacetilla: "Gacetilla",
  institucional: "Institucional",
};
