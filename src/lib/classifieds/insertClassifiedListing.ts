import type { SupabaseClient } from "@supabase/supabase-js";
import type { ClassifiedPublishPayload } from "./validateClassifiedPublishPayload";

export async function insertClassifiedListing(
  supabase: SupabaseClient,
  authorId: string,
  payload: ClassifiedPublishPayload,
): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase.from("classified_listings").insert({
    author_id: authorId,
    kind: payload.kind,
    title: payload.title,
    description: payload.description,
    external_url: payload.external_url,
    positions: payload.positions,
    tags: payload.tags,
  });
  return { error: error ? { message: error.message } : null };
}
