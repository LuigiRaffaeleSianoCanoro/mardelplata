import Navbar from "@/components/Navbar";
// IntroSplashWaves desactivada momentáneamente — testers reportaron
// que se siente atascada (pantalla negra prolongada). Cuando se ajuste
// la duracion + crossfade vuelve a habilitarse.
// import IntroSplashWaves from "@/components/IntroSplashWaves";
import AssetsGate from "@/components/AssetsGate";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import Channels from "@/components/Channels";
import Manifesto from "@/components/Manifesto";
import Community from "@/components/Community";
import Pillars from "@/components/Pillars";
import Events from "@/components/Events";
import Opportunities from "@/components/Opportunities";
import Footer from "@/components/Footer";
import ScrollDriver from "@/components/ScrollDriver";
import { createClient } from "@/lib/supabase/server";

const COFOUNDER_FULL_NAMES = new Set(["luigi canoro", "franco petruccelli"]);

function normalizeFullName(name: string | null): string | null {
  if (!name) return null;
  const n = name.trim().toLowerCase().replace(/\s+/g, " ");
  return n.length > 0 ? n : null;
}

function isCofounderProfile(fullName: string | null): boolean {
  const n = normalizeFullName(fullName);
  return n != null && COFOUNDER_FULL_NAMES.has(n);
}

export default async function Home() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false });

  const { data: foundersRaw } = await supabase
    .from("profiles_public")
    .select("id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url")
    .or(
      "and(full_name.ilike.%luigi%,full_name.ilike.%canoro%),and(full_name.ilike.%franco%,full_name.ilike.%petruccelli%)",
    );

  const founders = foundersRaw?.filter((p) => isCofounderProfile(p.full_name)) ?? [];

  const { data: communityMembers } = await supabase
    .from("profiles_public")
    .select("id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url")
    .not("full_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(30);

  // Métricas reales para las cards del Hero (review Luigi PR #26 punto 6).
  const { count: membersCount } = await supabase
    .from("profiles_public")
    .select("*", { count: "exact", head: true })
    .not("full_name", "is", null);

  const nowIso = new Date().toISOString();
  const { data: nextEventRows } = await supabase
    .from("events")
    .select("id, title, date")
    .eq("is_published", true)
    .gt("date", nowIso)
    .order("date", { ascending: true })
    .limit(1);
  const nextEvent = nextEventRows?.[0] ?? null;

  const { data: jobsRaw } = await supabase
    .from("classified_listings")
    .select("id, kind, title, description, external_url, tags, created_at, author:profiles_public!author_id(full_name, avatar_url)")
    .eq("kind", "job")
    .gt("expires_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(4);
  // El embed devuelve author como objeto unico — Supabase lo tipa como array
  // por defecto, asi que normalizamos para Opportunities.tsx.
  const jobs = (jobsRaw ?? []).map((j) => ({
    ...j,
    author: Array.isArray(j.author) ? j.author[0] ?? null : j.author ?? null,
  }));

  const orderedFounders = founders.slice().sort((a, b) => {
    const aName = normalizeFullName(a.full_name) ?? "";
    const bName = normalizeFullName(b.full_name) ?? "";
    const score = (name: string) => {
      if (name === "luigi canoro") return 0;
      if (name === "franco petruccelli") return 1;
      return 2;
    };
    return score(aName) - score(bName);
  });

  return (
    <>
      <AssetsGate />
      <div className="page-after-intro">
        <ScrollDriver />
        <Navbar />
        <main>
          <Hero
            nextEvent={nextEvent}
            membersCount={membersCount ?? 0}
            jobsCount={jobs.length}
          />
          <Reveal delay={0}><Pillars /></Reveal>
          <Reveal delay={120}><Events events={events ?? []} /></Reveal>
          <Reveal delay={120}><Community members={communityMembers ?? []} /></Reveal>
          <Reveal delay={120}><Channels /></Reveal>
          <Reveal delay={120}><Manifesto /></Reveal>
          <Reveal delay={120}><Opportunities jobs={jobs} /></Reveal>
        </main>
        <Footer />
      </div>
    </>
  );
}
