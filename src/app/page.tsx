import Navbar from "@/components/Navbar";
// IntroSplashWaves desactivada momentáneamente — testers reportaron
// que se siente atascada (pantalla negra prolongada). Cuando se ajuste
// la duracion + crossfade vuelve a habilitarse.
// import IntroSplashWaves from "@/components/IntroSplashWaves";
import AssetsGate from "@/components/AssetsGate";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import AudienceSwitchboard from "@/components/AudienceSwitchboard";
import CityHubStrip from "@/components/CityHubStrip";
import Channels from "@/components/Channels";
import Manifesto from "@/components/Manifesto";
import Community from "@/components/Community";
import Huevsites from "@/components/Huevsites";
import Pillars from "@/components/Pillars";
import Events from "@/components/Events";
import Opportunities from "@/components/Opportunities";
import Footer from "@/components/Footer";
import ScrollDriver from "@/components/ScrollDriver";
import Faq from "@/components/nomad/Faq";
import Testimonials from "@/components/Testimonials";
import { createPublicClient } from "@/lib/supabase/public";
import { IS_MOCK, mockProfiles } from "@/lib/devMock";
import { cityStats } from "@/content/nomad";

// ISR: la home consulta Supabase en RSC. Revalidar cada 5 min evita pegarle a
// Supabase en cada request y mejora TTFB/LCP (audit P1). Los datos no necesitan
// ser en tiempo real al segundo.
export const revalidate = 300;

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
  const supabase = createPublicClient();
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

  // Miembros que conectaron su huevsite (huevsite.io). Card custom + perfil
  // embebido — ver src/components/Huevsites.tsx.
  const { data: huevsiteMembersRaw } = await supabase
    .from("profiles_public")
    .select("id, full_name, avatar_url, huevsite_username")
    .not("huevsite_username", "is", null)
    .order("created_at", { ascending: false })
    .limit(12);
  const huevsiteMembers =
    IS_MOCK && (!huevsiteMembersRaw || huevsiteMembersRaw.length === 0)
      ? mockProfiles
          .filter((p) => p.huevsite_username)
          .map((p) => ({
            id: p.id,
            full_name: p.full_name,
            avatar_url: p.avatar_url,
            huevsite_username: p.huevsite_username,
          }))
      : huevsiteMembersRaw;

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
          <Reveal delay={120}><AudienceSwitchboard /></Reveal>
          <Reveal delay={120}><Events events={events ?? []} /></Reveal>
          <Reveal delay={120}><Community members={communityMembers ?? []} /></Reveal>
          <Reveal delay={120}><Huevsites members={huevsiteMembers ?? []} /></Reveal>
          <Reveal delay={120}><CityHubStrip /></Reveal>
          <Reveal delay={120}><Channels /></Reveal>
          <Reveal delay={120}><Manifesto /></Reveal>
          <Reveal delay={120}>
            <section className="shell-section shell-section--soft" aria-label="Preguntas frecuentes">
              <div className="shell-inner">
                <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
                  <p className="shell-eyebrow">¿DUDAS?</p>
                  <h2 className="shell-title">Preguntas frecuentes</h2>
                </div>
                <Faq items={cityStats.faq} />
              </div>
            </section>
          </Reveal>
          <Reveal delay={120}><Testimonials /></Reveal>
          <Reveal delay={120}><Opportunities jobs={jobs} /></Reveal>
        </main>
        <Footer />
      </div>
    </>
  );
}
