import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collaborators from "@/components/Collaborators";
import CommunityPlatforms from "@/components/CommunityPlatforms";
import Events from "@/components/Events";
import Team from "@/components/Team";
import CodeOfConduct from "@/components/CodeOfConduct";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

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
    .order("date", { ascending: true });

  const { data: founders } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url")
    .or("full_name.ilike.%Luigi%,full_name.ilike.%Franco%");

  const { data: communityMembers } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url")
    .not("full_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(30);

  const orderedFounders =
    founders
      ?.slice()
      .sort((a, b) => {
        const aName = (a.full_name || "").toLowerCase();
        const bName = (b.full_name || "").toLowerCase();
        const score = (name: string) => {
          if (name.includes("luigi")) return 0;
          if (name.includes("franco")) return 1;
          return 2;
        };
        return score(aName) - score(bName);
      }) ?? [];

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
