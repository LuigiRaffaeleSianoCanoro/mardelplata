import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collaborators from "@/components/Collaborators";
import CommunityPlatforms from "@/components/CommunityPlatforms";
import Events from "@/components/Events";
import Team from "@/components/Team";
import CodeOfConduct from "@/components/CodeOfConduct";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

/** Co-founder rows in `profiles`: Franco by auth user id, Luigi by stable `qr_code`. */
const COFOUNDER_FRANCO_PROFILE_ID = "98049008-8218-48a5-84e0-a3764a904de8";
const COFOUNDER_LUIGI_QR_CODE = "MDP-3762970D9EBF";

const FOUNDER_FIELDS =
  "id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url" as const;

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

  const [{ data: luigiRow }, { data: francoRow }] = await Promise.all([
    supabase.from("profiles").select(FOUNDER_FIELDS).eq("qr_code", COFOUNDER_LUIGI_QR_CODE).maybeSingle(),
    supabase.from("profiles").select(FOUNDER_FIELDS).eq("id", COFOUNDER_FRANCO_PROFILE_ID).maybeSingle(),
  ]);

  const orderedFounders = [luigiRow, francoRow].filter((p): p is NonNullable<typeof p> => p != null);

  const { data: communityMembers } = await supabase
    .from("profiles")
    .select("id, full_name, bio, avatar_url, github_url, linkedin_url, twitter_url")
    .not("full_name", "is", null)
    .order("created_at", { ascending: false })
    .limit(30);

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
