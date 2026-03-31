import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { insertClassifiedListing } from "@/lib/classifieds/insertClassifiedListing";
import {
  validateClassifiedPublishPayload,
  type ClassifiedPublishInput,
} from "@/lib/classifieds/validateClassifiedPublishPayload";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { JobPosition } from "@/lib/types/classifieds";

const LOG_PREFIX = "[api/jobs]";

function safeEqualStrings(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ba = enc.encode(a);
  const bb = enc.encode(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function parseBearerToken(request: NextRequest): string | null {
  const raw = request.headers.get("authorization");
  if (!raw?.startsWith("Bearer ")) return null;
  return raw.slice(7).trim();
}

function parsePositions(v: unknown): JobPosition[] {
  if (!Array.isArray(v)) return [];
  return v.map((p) => {
    if (typeof p !== "object" || p === null) return { title: "", description: "", link: "" };
    const o = p as Record<string, unknown>;
    return {
      title: typeof o.title === "string" ? o.title : "",
      description: typeof o.description === "string" ? o.description : "",
      link: typeof o.link === "string" ? o.link : "",
    };
  });
}

function parseTags(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function bodyToPublishInput(body: unknown): ClassifiedPublishInput | null {
  if (body === null || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title : "";
  const description = typeof o.description === "string" ? o.description : "";
  const external_url =
    o.external_url === null
      ? null
      : typeof o.external_url === "string"
        ? o.external_url
        : null;
  return {
    kind: "job",
    title,
    description,
    external_url,
    positions: parsePositions(o.positions),
    tags: parseTags(o.tags),
  };
}

export async function POST(request: NextRequest) {
  console.info(`${LOG_PREFIX} incoming POST`);

  const expectedKey = process.env.BOT_API_KEY;
  if (!expectedKey) {
    console.error(`${LOG_PREFIX} BOT_API_KEY is not set`);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const token = parseBearerToken(request);
  if (!token || !safeEqualStrings(token, expectedKey)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authorId = process.env.BOT_AUTHOR_ID;
  if (!authorId) {
    console.error(`${LOG_PREFIX} BOT_AUTHOR_ID is not set`);
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    console.error(`${LOG_PREFIX} invalid JSON body`);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = bodyToPublishInput(body);
  if (!input) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const validated = validateClassifiedPublishPayload(input, { forceKind: "job" });
  if (!validated.ok) {
    console.error(`${LOG_PREFIX} validation failed: ${validated.error}`);
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await insertClassifiedListing(supabase, authorId, validated.payload);
    if (error) {
      console.error(`${LOG_PREFIX} insert failed: ${error.message}`);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.info(`${LOG_PREFIX} job listing created`);
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error(`${LOG_PREFIX} error`, e);
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
