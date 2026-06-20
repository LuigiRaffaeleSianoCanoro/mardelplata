import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Sugerencias de la comunidad de cafés/coworkings work-friendly. Mismo patrón
// que /api/newsletter: INSERT público a una tabla con RLS insert-only; la
// moderación la hace el admin. Ver scripts/014_work_spot_submissions.sql.

const KINDS = new Set(["cafe", "coworking", "biblioteca", "hotel", "otro"]);

function str(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  if (!t || t.length > max) return null;
  return t;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;

  const name = str(b.name, 120);
  if (!name) {
    return NextResponse.json({ error: "invalid_name" }, { status: 400 });
  }

  const kindRaw = typeof b.kind === "string" ? b.kind : "cafe";
  const kind = KINDS.has(kindRaw) ? kindRaw : "cafe";

  const record = {
    name,
    kind,
    address: str(b.address, 200),
    zona: str(b.zona, 80),
    wifi: typeof b.wifi === "boolean" ? b.wifi : null,
    outlets: typeof b.outlets === "boolean" ? b.outlets : null,
    notes: str(b.notes, 1000),
    submitter: str(b.submitter, 160),
  };

  const supabase = await createClient();
  const { error } = await supabase.from("work_spot_submissions").insert(record);

  if (error) {
    console.error("work_spot submission failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
