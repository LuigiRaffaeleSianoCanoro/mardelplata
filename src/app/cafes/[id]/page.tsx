import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CafeDetail from "@/components/cafes/CafeDetail";
import { createClient } from "@/lib/supabase/server";
import {
  EMPTY_SCORE,
  type Cafe,
  type CafeComment,
  type CafeScore,
} from "@/lib/types/cafes";

export const dynamic = "force-dynamic";

export default async function CafeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cafe } = await supabase
    .from("cafes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!cafe) notFound();

  const { data: scoreRow } = await supabase
    .from("cafe_scores")
    .select("*")
    .eq("cafe_id", id)
    .maybeSingle();

  // cafe_votes.user_id referencia auth.users (no profiles), así que NO se puede
  // embeber profiles_public por FK como hace la bolsa con author_id. Dos queries + merge.
  const { data: voteRows } = await supabase
    .from("cafe_votes")
    .select("user_id, vote, comment")
    .eq("cafe_id", id)
    .not("comment", "is", null);

  const withComment = ((voteRows ?? []) as {
    user_id: string;
    vote: number;
    comment: string | null;
  }[]).filter((r) => typeof r.comment === "string" && r.comment.trim().length > 0);

  const authorIds = Array.from(new Set(withComment.map((r) => r.user_id)));
  const nameById = new Map<string, string | null>();
  if (authorIds.length > 0) {
    const { data: authors } = await supabase
      .from("profiles_public")
      .select("id, full_name")
      .in("id", authorIds);
    for (const a of (authors ?? []) as { id: string; full_name: string | null }[]) {
      nameById.set(a.id, a.full_name);
    }
  }

  const comments: CafeComment[] = withComment.map((r) => ({
    user_id: r.user_id,
    vote: r.vote === 1 ? 1 : (-1 as 1 | -1),
    comment: r.comment as string,
    author_name: nameById.get(r.user_id) ?? null,
  }));

  let score = EMPTY_SCORE;
  if (scoreRow) {
    const { cafe_id, ...rest } = scoreRow as CafeScore;
    void cafe_id;
    score = rest;
  }

  return (
    <>
      <Navbar />
      <main className="cafes-x">
        <CafeDetail cafe={cafe as Cafe} score={score} comments={comments} />
      </main>
      <Footer />
    </>
  );
}
