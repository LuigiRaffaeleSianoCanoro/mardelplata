import type { ClassifiedKind, JobPosition } from "@/lib/types/classifieds";
import { CLASSIFIED_DESC_MAX, CLASSIFIED_TITLE_MAX } from "@/lib/types/classifieds";

export type ClassifiedPublishPayload = {
  kind: ClassifiedKind;
  title: string;
  description: string;
  external_url: string | null;
  positions: JobPosition[];
  tags: string[];
};

export type ClassifiedPublishInput = {
  kind: ClassifiedKind;
  title: string;
  description: string;
  external_url: string | null;
  positions: JobPosition[];
  tags: string[];
};

export function validateClassifiedPublishPayload(
  input: ClassifiedPublishInput,
  options?: { forceKind?: ClassifiedKind },
):
  | { ok: true; payload: ClassifiedPublishPayload }
  | { ok: false; error: string } {
  const kind = options?.forceKind ?? input.kind;
  const t = input.title.trim();
  const d = input.description.trim();
  const ext =
    typeof input.external_url === "string" ? input.external_url.trim() || null : input.external_url;

  if (!t) {
    return { ok: false, error: "El título es obligatorio." };
  }
  if (t.length > CLASSIFIED_TITLE_MAX) {
    return { ok: false, error: `El título no puede superar ${CLASSIFIED_TITLE_MAX} caracteres.` };
  }
  if (!d) {
    return { ok: false, error: "La descripción es obligatoria." };
  }
  if (d.length > CLASSIFIED_DESC_MAX) {
    return { ok: false, error: `La descripción no puede superar ${CLASSIFIED_DESC_MAX} caracteres.` };
  }

  let posPayload: JobPosition[] = [];
  if (kind === "job") {
    posPayload = input.positions
      .map((p) => ({
        title: p.title.trim(),
        description: p.description.trim(),
        link: p.link.trim(),
      }))
      .filter((p) => p.title || p.description || p.link);
    if (posPayload.length === 0) {
      return { ok: false, error: "Agregá al menos una posición con datos." };
    }
  }

  return {
    ok: true,
    payload: {
      kind,
      title: t,
      description: d,
      external_url: ext,
      positions: posPayload,
      tags: input.tags,
    },
  };
}
