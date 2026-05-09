import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const raw = (body as { email?: unknown })?.email;
  const email = typeof raw === "string" ? raw.trim() : "";
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const source = (body as { source?: unknown })?.source;
  const sourceStr =
    typeof source === "string" && source.length <= 64 ? source : "footer";

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source: sourceStr });

  if (error) {
    // 23505 unique_violation → ya estaba suscripto. UX-wise lo tratamos
    // como exito para no filtrar quien ya esta en la lista.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    console.error("newsletter insert failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
