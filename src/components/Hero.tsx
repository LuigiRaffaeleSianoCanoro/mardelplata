import Link from "next/link";
import LowPolyWave from "./LowPolyWave";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-28 pb-32 bg-[#0A0A0F]"
    >
      {/* Sky overlay — black at start, dawn slides in from above as user scrolls.
          Driven by the same `--sun-rise` curve so sky descent and sun ascent
          stay perfectly in sync. */}
      <div
        className="absolute inset-x-0 pointer-events-none z-0"
        style={{
          top: "-100vh",
          height: "100vh",
          background:
            "linear-gradient(180deg, #F4F8FF 0%, #C8DCFF 10%, #FFD8B0 24%, #FFB070 38%, #C84B6E 55%, #5B2A52 75%, #1A1230 90%, #0A0A0F 100%)",
          translate: "0 calc(var(--sun-rise, 0) * 100vh)",
        }}
      />

      {/* Atmosphere — sapphire aurora + magenta accent + grid floor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 right-0 w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] rounded-full bg-[rgba(59,130,246,0.10)] blur-[160px] aurora parallax-deep-back" />
        <div className="absolute -bottom-20 left-0 w-[40vw] h-[40vw] max-w-[700px] max-h-[700px] rounded-full bg-[rgba(255,45,170,0.06)] blur-[140px] parallax-back" />
        <div className="absolute inset-0 tx-grid opacity-25 [mask-image:radial-gradient(ellipse_72%_55%_at_50%_42%,#000_30%,transparent_92%)]" />
        <div className="absolute left-0 right-0 top-[64%] h-px bg-gradient-to-r from-transparent via-[rgba(59,130,246,0.4)] to-transparent parallax-mid" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 w-full">
        {/* Coord strip */}
        <p className="reveal-up coord-line mb-5 text-white/55" style={{ animationDelay: "1500ms" }}>
          BEARING 270° <span className="sep">·</span>
          <span className="num">38°00&apos;S 057°33&apos;W</span> <span className="sep">·</span>
          ATLÁNTICO SUR
        </p>

        {/* Eyebrow */}
        <div
          className="reveal-up mb-12 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "1580ms" }}
        >
          <span className="kicker text-white/70 flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02]">
            <span className="dot-amber" />
            comunidad tech · mar del plata
          </span>
          <a
            href="#eventos"
            className="kicker inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-[rgba(59,130,246,0.45)] hover:bg-white/[0.04] transition-colors text-white/65"
          >
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#3B82F6] opacity-75 animate-ping" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            </span>
            próximo evento
            <span className="text-white/85">ver agenda</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Heading */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-end">
          <div className="col-span-12 lg:col-span-9">
            <h1
              className="display-thin text-white text-[clamp(2.6rem,9vw,8rem)] leading-[1.0] reveal-up"
              style={{ animationDelay: "1680ms" }}
            >
              El club tech
              <br />
              <span className="text-white/45">de la costa</span>{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-white/95 to-[#FF2DAA]">
                atlántica.
              </span>
            </h1>
          </div>

          <div
            className="col-span-12 lg:col-span-3 reveal-up"
            style={{ animationDelay: "1820ms" }}
          >
            <p className="text-white/60 text-base sm:text-lg leading-relaxed font-light max-w-md lg:max-w-none">
              Conectamos developers, diseñadores y emprendedores que ya están construyendo el ecosistema
              digital de Mar del Plata.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div
          className="mt-14 flex flex-wrap gap-3 reveal-up"
          style={{ animationDelay: "1960ms" }}
        >
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-app-primary"
          >
            Unirse a la comunidad
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <Link href="/primer-trabajo" className="btn-app-ghost">
            Primer Trabajo OS
          </Link>
          <Link href="/bolsa" className="btn-app-ghost">
            Bolsa de trabajo
          </Link>
        </div>

        {/* KPI strip */}
        <div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 reveal-up"
          style={{ animationDelay: "2120ms" }}
        >
          {[
            { kicker: "01", label: "Empleos", desc: "Ofertas y freelance local" },
            { kicker: "02", label: "Eventos", desc: "Meetups en La Feliz" },
            { kicker: "03", label: "Recursos", desc: "Cursos y guías curadas" },
            { kicker: "04", label: "Networking", desc: "Devs, founders y diseño" },
          ].map((p) => (
            <div key={p.label} className="border-l border-white/[0.08] pl-4">
              <p className="kicker text-white/40 mb-2">/ {p.kicker}</p>
              <p className="text-white display-thin text-xl">{p.label}</p>
              <p className="text-white/55 text-sm mt-1 font-light">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Low-poly ocean — atmosphere + 4 layers with depth parallax + bob + foam */}
      <div className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none">
        {/* Sun — emerges from behind the waves as user scrolls */}
        <div
          className="absolute right-[14%] bottom-[-90px] pointer-events-none z-0"
          style={{ translate: "0 calc(var(--sun-rise, 0) * -420px)" }}
        >
          <div className="relative">
            {/* outer halo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,_rgba(255,200,140,0.22)_0%,_rgba(255,160,80,0.08)_30%,_transparent_65%)] blur-2xl" />
            {/* mid corona */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,_rgba(255,238,200,0.55)_0%,_rgba(255,180,90,0.30)_45%,_transparent_72%)]" />
            {/* core disk */}
            <div className="relative w-[130px] h-[130px] rounded-full bg-gradient-to-b from-[#FFF6E0] via-[#FFD89A] to-[#FF9C4A] shadow-[0_0_70px_15px_rgba(255,200,120,0.30)]" />
          </div>
        </div>

        {/* Horizon haze — soft sapphire glow on the horizon line */}
        <div
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(59,130,246,0.10)] via-transparent to-transparent"
          style={{ translate: "0 calc(var(--scroll-y, 0px) * 0.45)" }}
        />

        {/* Distant horizon — moves DOWN with scroll (far away, slow) */}
        <div
          className="absolute inset-0 boat-bob-deep-1 opacity-70"
          style={{ translate: "0 calc(var(--scroll-y, 0px) * 0.35)" }}
        >
          <LowPolyWave
            className="wave-layer-deep"
            stroke="rgba(59, 130, 246, 0.32)"
            fill="rgba(59, 130, 246, 0.04)"
            rows={3}
            cols={72}
            amp={8}
            baseY={70}
            phase={0}
            crests={5}
            height={420}
          />
        </div>

        {/* Deep mid ocean — moderate downward parallax */}
        <div
          className="absolute inset-0 boat-bob-deep-2"
          style={{ translate: "0 calc(var(--scroll-y, 0px) * 0.20)" }}
        >
          <LowPolyWave
            className="wave-layer-deep"
            stroke="rgba(59, 130, 246, 0.42)"
            fill="rgba(2, 16, 38, 0.55)"
            rows={6}
            cols={60}
            amp={26}
            baseY={150}
            phase={0.8}
            crests={4}
            height={420}
          />
        </div>

        {/* Middle swell — barely shifts with scroll */}
        <div
          className="absolute inset-0 boat-bob-deep-3"
          style={{ translate: "0 calc(var(--scroll-y, 0px) * 0.05)" }}
        >
          <LowPolyWave
            className="wave-layer-mid"
            stroke="rgba(59, 130, 246, 0.55)"
            fill="rgba(2, 8, 24, 0.78)"
            rows={5}
            cols={48}
            amp={36}
            baseY={220}
            phase={1.7}
            crests={4}
            height={420}
            foam
            foamColor="rgba(173, 216, 255, 0.55)"
          />
        </div>

        {/* Front cresting wave — moves UP with scroll (super close, fast) */}
        <div
          className="absolute inset-0 boat-bob-deep-1"
          style={{ translate: "0 calc(var(--scroll-y, 0px) * -0.18)" }}
        >
          <LowPolyWave
            className="wave-layer-fore"
            stroke="rgba(255, 255, 255, 0.45)"
            fill="rgba(2, 4, 18, 0.92)"
            rows={4}
            cols={36}
            amp={48}
            baseY={290}
            phase={2.6}
            crests={4}
            height={420}
            foam
            foamColor="rgba(255, 255, 255, 0.95)"
          />
          {/* Solid extension below — keeps the hero dark when parallax lifts the wave */}
          <div className="absolute inset-x-0 top-full h-[320px] bg-[rgba(2,4,18,0.92)]" />
        </div>

        {/* Bottom fade — black at top of scroll, slides to white as user scrolls */}
        <div
          className="absolute inset-x-0 bottom-0 h-[160px] pointer-events-none z-[5]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(10,10,15,0.55) 55%, rgba(10,10,15,0.92) 85%, #0A0A0F 100%)",
            opacity: "var(--reveal-progress, 1)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[160px] pointer-events-none z-[5]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0.92) 85%, #ffffff 100%)",
            opacity: "var(--reveal-inv-progress, 0)",
          }}
        />
      </div>
    </section>
  );
}
