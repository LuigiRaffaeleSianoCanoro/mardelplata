import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Collaborators from "@/components/Collaborators";
import CommunityPlatforms from "@/components/CommunityPlatforms";
import Events from "@/components/Events";
import Team from "@/components/Team";
import CodeOfConduct from "@/components/CodeOfConduct";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

// Wave dividers as inline SVG helpers
function WaveDown({ from, to, d = "M0,30 C360,55 1080,5 1440,30 L1440,60 L0,60 Z" }: { from: string; to: string; d?: string }) {
  return (
    <div className={`relative overflow-hidden ${from}`} style={{ height: 60 }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
        <path d={d} className={to} />
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        <Collaborators />

        <WaveDown from="bg-white" to="fill-[#f0f9ff]" d="M0,30 C360,55 1080,5 1440,30 L1440,60 L0,60 Z" />

        <CommunityPlatforms />

        <WaveDown from="[background:linear-gradient(180deg,#f0f9ff_0%,#e0f4fb_100%)]" to="fill-white" d="M0,20 C480,55 960,0 1440,30 L1440,60 L0,60 Z" />

        <Events />

        <WaveDown from="bg-white" to="fill-[#f0f9ff]" d="M0,40 C360,10 1080,55 1440,20 L1440,60 L0,60 Z" />

        <Team />

        <WaveDown from="[background:linear-gradient(180deg,#f0f9ff_0%,#e0f4fb_100%)]" to="fill-white" d="M0,20 C720,55 1080,5 1440,35 L1440,60 L0,60 Z" />

        <CodeOfConduct />

        <WaveDown from="bg-white" to="fill-[#03045E]" d="M0,15 C360,50 1080,5 1440,30 L1440,60 L0,60 Z" />

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
