import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CafesClient from "@/components/cafes/CafesClient";
import { createClient } from "@/lib/supabase/server";
import { EMPTY_SCORE, type Cafe, type CafeScore, type CafeWithScore } from "@/lib/types/cafes";

export const dynamic = "force-dynamic";

export default async function CafesPage() {
  const supabase = await createClient();

  const { data: cafesRaw } = await supabase
    .from("cafes")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: scoresRaw } = await supabase.from("cafe_scores").select("*");

  const scoreMap = new Map<string, Omit<CafeScore, "cafe_id">>();
  for (const s of (scoresRaw ?? []) as CafeScore[]) {
    const { cafe_id, ...rest } = s;
    scoreMap.set(cafe_id, rest);
  }

  const cafes: CafeWithScore[] = ((cafesRaw ?? []) as Cafe[])
    .map((c) => ({ ...c, score: scoreMap.get(c.id) ?? EMPTY_SCORE }))
    .sort(
      (a, b) =>
        b.score.net_votes - a.score.net_votes ||
        b.score.votes_count - a.score.votes_count,
    );

  return (
    <>
      <Navbar />
      <main className="cafes-x">
        <CafesClient initialCafes={cafes} />
      </main>
      <Footer />
    </>
  );
}
