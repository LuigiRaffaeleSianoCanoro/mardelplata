import Navbar from "@/components/Navbar";
import IntroSplashWaves from "@/components/IntroSplashWaves";
import Hero from "@/components/Hero";
import TransmissionBar from "@/components/TransmissionBar";
import Manifesto from "@/components/Manifesto";
import Collaborators from "@/components/Collaborators";
import CommunityPlatforms from "@/components/CommunityPlatforms";
import Events from "@/components/Events";
import CodeOfConduct from "@/components/CodeOfConduct";
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
      <IntroSplashWaves />
      <div className="page-after-intro">
        <ScrollDriver />
        <Navbar />
        <main>
          <Hero />
          <TransmissionBar />
          <Manifesto />
          <CommunityPlatforms />
          <Events events={events ?? []} />
          <Collaborators members={communityMembers ?? []} />
          <CodeOfConduct />
        </main>
        <Footer />
      </div>
    </>
  );
}
