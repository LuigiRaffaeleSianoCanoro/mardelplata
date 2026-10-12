/** Shape de un evento curado desde Luma (archivo JSON en `items/`). */

export type EventTier = "community" | "city";

export interface CuratedEvent {
  /** Slug estable — nombre del archivo sin extensión. */
  id: string;
  title: string;
  /** Resumen corto para la card (1–2 oraciones). */
  excerpt: string;
  /** ISO 8601 con offset Argentina (ej. `-03:00`). */
  date: string;
  endDate?: string;
  venue: string;
  city: string;
  hosts: string[];
  lumaUrl: string;
  tags: string[];
  /** `community` = MdPDev / Luigi / Franco; `city` = ecosistema local tercero. */
  tier: EventTier;
  /** Fecha en que se verificó la página pública de Luma (YYYY-MM-DD). */
  verifiedAt: string;
  /** Opcional (v3): precio tal cual figura en Luma, ej. «Gratis». */
  price?: string;
  /** Opcional (v3): cupo publicado en Luma. */
  capacity?: number;
  /** Opcional (v3): puntos de agenda confirmados (sin horarios inventados). */
  agenda?: string[];
}
