import Link from "next/link";

// ── Mono — Vercel / Basehub aesthetic ─────────────────────────────────────
//
// Pure black canvas, monospaced accents, geometric layout, thin borders,
// generous white-space, hover states reveal "→". No gradients on text,
// no glassmorphism — utilitarian and dense like a builder's homepage.

export default function MonoHomePreview() {
  return (
    <>
      <MonoNav />
      <MonoHero />
      <MonoStats />
      <MonoFeatures />
      <MonoCommunityList />
      <MonoTeam />
      <MonoCTA />
      <MonoFooter />
    </>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────
function MonoNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#09090B]/85 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto h-14 px-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="w-5 h-5 rounded-sm bg-white grid place-items-center text-black text-[0.6rem] font-bold">
            M
          </span>
          <span className="font-display font-semibold text-[0.95rem] tracking-tight">
            mardelplata<span className="text-zinc-500">.dev</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm text-zinc-400">
          {[
            ["Bolsa", "/bolsa"],
            ["Primer Trabajo OS", "/primer-trabajo"],
            ["Eventos", "#events"],
            ["Reglamento", "/reglamento"],
          ].map(([l, h]) => (
            <a
              key={l}
              href={h}
              className="px-3 py-1.5 rounded-md hover:bg-white/5 hover:text-white transition-colors"
            >
              {l}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden sm:inline-flex text-zinc-400 hover:text-white text-sm px-3 py-1.5"
          >
            Ingresar
          </Link>
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-white text-black text-sm font-semibold px-3.5 py-1.5 rounded-md hover:bg-zinc-200 transition-colors"
          >
            Unirse
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function MonoHero() {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 mono-grid opacity-60 pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px overflow-hidden">
        <div className="absolute inset-y-0 w-2/5 scan-line bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pt-28 pb-32">
        {/* status pill */}
        <div className="inline-flex items-center gap-2 font-mono text-[0.7rem] text-zinc-400 mb-10">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>STATUS</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-200">SHIPPING — v0.1</span>
        </div>

        {/* big title */}
        <h1
          className="font-display font-semibold text-white text-[clamp(3rem,9vw,8rem)] leading-[0.92]"
          style={{ letterSpacing: "-0.055em" }}
        >
          Build the
          <br />
          coast.
          <span className="text-zinc-700 ml-1 terminal-cursor">_</span>
        </h1>

        <p className="mt-10 max-w-xl text-lg text-zinc-400 leading-relaxed">
          La comunidad tech de Mar del Plata. Un grupo de devs, diseñadores y founders construyendo en
          paralelo desde la costa atlántica.
        </p>

        {/* CTAs — Vercel-style outline + filled */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-md font-semibold text-sm hover:bg-zinc-200 transition-colors"
          >
            Sumarme al grupo
            <span aria-hidden>→</span>
          </a>
          <Link
            href="/primer-trabajo"
            className="inline-flex items-center gap-2 border border-white/15 text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <span className="font-mono text-zinc-500">→</span>
            ./primer-trabajo
          </Link>
          <Link
            href="/bolsa"
            className="inline-flex items-center gap-2 border border-white/15 text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-white/5 transition-colors"
          >
            <span className="font-mono text-zinc-500">→</span>
            ./bolsa
          </Link>
        </div>

        {/* thin wave outline (no fill — line art) */}
        <div className="mt-24 -mx-5">
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-20">
            <path
              d="M0,40 C150,10 300,70 450,40 C600,10 750,70 900,40 C1050,10 1200,70 1200,40"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="6 8"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ── Stats grid ────────────────────────────────────────────────────────────
function MonoStats() {
  const stats = [
    { kicker: "01", label: "Año fundación", value: "2026" },
    { kicker: "02", label: "Co-founders", value: "02" },
    { kicker: "03", label: "Ciudad", value: "Mar del Plata" },
    { kicker: "04", label: "Open source", value: "100%" },
  ];
  return (
    <section className="border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        {stats.map((s) => (
          <div key={s.kicker} className="px-6 py-10">
            <p className="font-mono text-[0.65rem] text-zinc-500 tracking-[0.25em] mb-3">
              / {s.kicker}
            </p>
            <p className="font-display text-3xl text-white tracking-tight mb-1">{s.value}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────
function MonoFeatures() {
  const features = [
    {
      kicker: "01",
      title: "Bolsa de trabajo",
      desc: "Clasificados de empleo y freelance publicados por la propia comunidad. Visible solo para miembros activos.",
      href: "/bolsa",
    },
    {
      kicker: "02",
      title: "Primer Trabajo OS",
      desc: "Diagnóstico, plan de acción, simulador HR y guía de mercado. Sin cursos vacíos — un sistema operativo para tu primera búsqueda.",
      href: "/primer-trabajo",
    },
    {
      kicker: "03",
      title: "Eventos en vivo",
      desc: "Meetups y hackathons en La Feliz. QR único por miembro, registro de asistencia automático.",
      href: "#events",
    },
  ];

  return (
    <section className="border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-24">
        <div className="flex items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-mono text-[0.7rem] text-zinc-500 tracking-[0.25em] mb-3">/ FEATURES</p>
            <h2
              className="font-display font-semibold text-white text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Tres herramientas. <br />
              <span className="text-zinc-500">Una comunidad.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {features.map((f) => (
            <Link
              key={f.kicker}
              href={f.href}
              className="group relative bg-[#09090B] p-8 hover:bg-white/[0.025] transition-colors"
            >
              <p className="font-mono text-[0.65rem] text-zinc-600 tracking-[0.25em] mb-6">
                / {f.kicker}
              </p>
              <h3 className="font-display font-semibold text-white text-2xl mb-3">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              <span className="absolute top-8 right-8 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Community list ────────────────────────────────────────────────────────
function MonoCommunityList() {
  const platforms = [
    {
      handle: "WhatsApp",
      desc: "Día a día, anuncios y ayuda entre devs.",
      href: "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs",
      slot: "/primary",
    },
    {
      handle: "Instagram",
      desc: "Cobertura visual de eventos y novedades.",
      href: "https://www.instagram.com/mardelplata.dev.ar/",
      slot: "/visual",
    },
    {
      handle: "X (Twitter)",
      desc: "Pulso del ecosistema en tiempo real.",
      href: "https://x.com/Mardeldev",
      slot: "/pulse",
    },
  ];

  return (
    <section className="border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-24">
        <div className="grid grid-cols-12 gap-6 mb-10">
          <div className="col-span-12 md:col-span-4">
            <p className="font-mono text-[0.7rem] text-zinc-500 tracking-[0.25em] mb-3">/ NETWORK</p>
            <h2
              className="font-display font-semibold text-white text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
              style={{ letterSpacing: "-0.04em" }}
            >
              Where it lives.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 flex md:items-end">
            <p className="text-zinc-400 text-base leading-relaxed max-w-md">
              Tres canales — distintas vibras, misma comunidad. Elegí el que ya tengas abierto y enganchate
              desde ahí.
            </p>
          </div>
        </div>

        <div className="border-y border-white/5 divide-y divide-white/5">
          {platforms.map((p) => (
            <a
              key={p.handle}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-row-hover group flex items-center gap-6 py-6 px-2"
              style={{ ["--row-padding" as string]: "0.5rem" }}
            >
              <span className="font-mono text-xs text-zinc-600 w-16">{p.slot}</span>
              <span className="font-display font-semibold text-white text-xl md:text-2xl flex-shrink-0 w-44">
                {p.handle}
              </span>
              <span className="text-sm text-zinc-400 hidden md:block flex-1 truncate">{p.desc}</span>
              <span className="ml-auto text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Team ──────────────────────────────────────────────────────────────────
function MonoTeam() {
  const team = [
    { name: "Luigi Canoro", role: "Co-founder · QA", id: "01" },
    { name: "Franco Petruccelli", role: "Co-founder · QA", id: "02" },
  ];
  return (
    <section className="border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-24">
        <p className="font-mono text-[0.7rem] text-zinc-500 tracking-[0.25em] mb-3">/ TEAM</p>
        <h2
          className="font-display font-semibold text-white text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] mb-12"
          style={{ letterSpacing: "-0.04em" }}
        >
          Built by two QAs <br />
          <span className="text-zinc-500">from the coast.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {team.map((t) => (
            <div key={t.id} className="bg-[#09090B] p-8 flex items-center gap-6">
              <div className="w-16 h-16 rounded-md bg-white/[0.04] border border-white/10 grid place-items-center font-mono text-zinc-500">
                {t.id}
              </div>
              <div>
                <p className="font-display font-semibold text-white text-xl">{t.name}</p>
                <p className="text-sm text-zinc-400">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────
function MonoCTA() {
  return (
    <section className="border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-24 grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 md:col-span-8">
          <p className="font-mono text-[0.7rem] text-zinc-500 tracking-[0.25em] mb-3">/ JOIN</p>
          <h2
            className="font-display font-semibold text-white text-[clamp(2rem,5vw,3.5rem)] leading-[0.95]"
            style={{ letterSpacing: "-0.04em" }}
          >
            Ready to ship from <br />
            <span className="text-zinc-500">the coast?</span>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-4 md:text-right">
          <a
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-md font-semibold text-sm hover:bg-zinc-200 transition-colors"
          >
            Sumarme al grupo →
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function MonoFooter() {
  return (
    <footer className="bg-[#09090B]">
      <div className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 text-white">
              <span className="w-5 h-5 rounded-sm bg-white grid place-items-center text-black text-[0.6rem] font-bold">
                M
              </span>
              <span className="font-display font-semibold text-base">
                mardelplata<span className="text-zinc-500">.dev</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 mt-4 max-w-xs leading-relaxed">
              Open community. Hecho en La Feliz.
            </p>
          </div>

          {[
            { title: "Product", links: [
              ["Bolsa", "/bolsa"],
              ["Primer Trabajo OS", "/primer-trabajo"],
              ["Brand", "/brand"],
              ["Marketing kit", "/marketing-kit"],
            ]},
            { title: "Network", links: [
              ["WhatsApp", "https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"],
              ["Instagram", "https://www.instagram.com/mardelplata.dev.ar/"],
              ["X", "https://x.com/Mardeldev"],
            ]},
            { title: "Comunidad", links: [
              ["Reglamento", "/reglamento"],
              ["Quiénes somos", "/#staff"],
            ]},
          ].map((col) => (
            <div key={col.title} className="col-span-6 md:col-span-2">
              <p className="font-mono text-[0.65rem] text-zinc-600 tracking-[0.25em] mb-4">
                / {col.title.toUpperCase()}
              </p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map(([l, h]) => (
                  <li key={l}>
                    <a
                      href={h}
                      target={h.startsWith("http") ? "_blank" : undefined}
                      rel={h.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© 2026 MdPDev — All rights reserved.</p>
          <p className="font-mono">v0.1.0 — preview/mono</p>
        </div>
      </div>
    </footer>
  );
}
