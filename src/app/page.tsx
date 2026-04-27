import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collaborators from "@/components/Collaborators";
import CommunityPlatforms from "@/components/CommunityPlatforms";
import Events from "@/components/Events";
import Team from "@/components/Team";
import CodeOfConduct from "@/components/CodeOfConduct";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

/** Full names that may appear in "Quiénes Somos" as co-founders (normalized). */
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

function WaveDown({ from, to, d = "M0,30 C360,55 1080,5 1440,30 L1440,60 L0,60 Z" }: { from: string; to: string; d?: string }) {
  return (
    <div className={`relative overflow-hidden ${from}`} style={{ height: 60 }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
        <path d={d} className={to} />
      </svg>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("date", { ascending: false });

  const { data: foundersRaw } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url")
    .or(
      "and(full_name.ilike.%luigi%,full_name.ilike.%canoro%),and(full_name.ilike.%franco%,full_name.ilike.%petruccelli%)",
    );

  const founders = foundersRaw?.filter((p) => isCofounderProfile(p.full_name)) ?? [];

  const { data: communityMembers } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url")
    .not("full_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(30);

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
      <Navbar />
      <main>
        <Hero />

        <Collaborators members={communityMembers ?? []} />

        <WaveDown from="bg-white" to="fill-[#f0f9ff]" d="M0,30 C360,55 1080,5 1440,30 L1440,60 L0,60 Z" />

        <CommunityPlatforms />

        <WaveDown from="[background:linear-gradient(180deg,#f0f9ff_0%,#e0f4fb_100%)]" to="fill-white" d="M0,20 C480,55 960,0 1440,30 L1440,60 L0,60 Z" />

        <Events events={events ?? []} />

        <WaveDown from="bg-white" to="fill-[#f0f9ff]" d="M0,40 C360,10 1080,55 1440,20 L1440,60 L0,60 Z" />

        <Team members={orderedFounders} />

        <WaveDown from="[background:linear-gradient(180deg,#f0f9ff_0%,#e0f4fb_100%)]" to="fill-white" d="M0,20 C720,55 1080,5 1440,35 L1440,60 L0,60 Z" />

        <CodeOfConduct />
      </main>
      <Footer />
    </>
  );
}
