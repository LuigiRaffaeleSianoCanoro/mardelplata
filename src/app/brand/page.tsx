import type { Metadata } from "next";
import { PageFrame, PageHero } from "@/components/v3/Page";
import { BRAND } from "@/lib/v3/brand";

export const metadata: Metadata = {
  title: "Brand Book",
  description: "Guía de identidad visual y tono de mardelplata.dev.ar.",
};

// ── Sea Lion icon (same as Navbar/Footer) ──────────────────────────────────
function SeaLionIcon({ size = 22, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="8" cy="7.5" rx="4" ry="3.5" stroke={color} strokeWidth="1.8" />
      <circle cx="7" cy="6.5" r="0.8" fill={color} />
      <path d="M11.5 8.5 C13 8 14 8.5 13.5 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 8 L14.5 7" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M11.5 9 L14.5 9.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" />
      <path d="M6 11 C5.5 13 6 15 7 16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 16 C9 17.5 13 18 17 16.5 C19 15.5 20 13.5 18.5 12 C17 10.5 14 10.5 11 11" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 14.5 C3.5 15.5 3 17.5 5 18.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17.5 17 C19.5 16 21 17.5 19.5 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 17.5 C17 19.5 19 20.5 18 21.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Section label (pill above headings) ───────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center justify-center gap-2 font-mono text-[11px] font-medium tracking-[0.08em] text-muted-foreground uppercase">
      <span className="v3-dot" aria-hidden />
      {children}
    </p>
  );
}

// ── Section wrapper ────────────────────────────────────────────────────────
function Section({
  id,
  children,
  className = "bg-transparent",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 border-t border-border py-12 lg:py-14 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

// ── Code snippet ──────────────────────────────────────────────────────────
function Code({ children }: { children: string }) {
  return (
    <code className="mt-3 block whitespace-pre-wrap rounded-xl border border-border bg-card/60 px-4 py-3 font-mono text-[12px] leading-relaxed text-muted-foreground">
      {children}
    </code>
  );
}

// ── Do / Don't card ───────────────────────────────────────────────────────
function RuleCard({
  type,
  items,
}: {
  type: "do" | "dont";
  items: string[];
}) {
  const isDo = type === "do";
  return (
    <div
      className={`rounded-xl border p-6 ${
        isDo
          ? "border-border bg-card/70"
          : "border-border bg-card/40"
      }`}
    >
      <p
        className={`font-sans font-bold text-lg mb-4 ${
          isDo ? "text-emerald-300" : "text-rose-300"
        }`}
      >
        {isDo ? "✓ Do" : "✕ Don't"}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-start gap-2 text-sm ${
              isDo ? "text-emerald-200" : "text-rose-200"
            }`}
          >
            <span className="mt-0.5 flex-shrink-0">{isDo ? "✓" : "✕"}</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Color swatch ──────────────────────────────────────────────────────────
function Swatch({
  hex,
  token,
  label,
  dark = false,
}: {
  hex: string;
  token: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="h-14 rounded-xl shadow-sm border border-border"
        style={{ backgroundColor: hex }}
      />
      <p className={`text-xs font-semibold ${dark ? "text-foreground" : "text-foreground"}`}>
        {token}
      </p>
      <p className="text-xs text-muted-foreground font-mono">{hex}</p>
      <p className="text-xs text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function BrandPage() {
  return (
    <PageFrame>
      
      <div>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <PageHero
          eyebrow="Identidad visual"
          title={<>Brand Book {BRAND}</>}
          description="Guía de identidad: logo, colores, tipografía, voz y componentes UI de la comunidad tech de Mar del Plata."
        />

        {/* ── Índice ───────────────────────────────────────────────── */}
        <Section id="indice" className="bg-transparent border-b border-border">
          <div className="flex flex-wrap gap-3">
            {[
              ["#logo",        "1. Logo"],
              ["#colores",     "2. Colores"],
              ["#tipografia",  "3. Tipografía"],
              ["#voz",         "4. Voz y tono"],
              ["#componentes", "5. Componentes"],
              ["#reglas",      "6. Do's & Don'ts"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="inline-flex h-8 items-center rounded-full border border-border bg-card/70 px-3 font-mono text-[11px] tracking-[0.04em] text-foreground hover:bg-card"
              >
                {label}
              </a>
            ))}
          </div>
        </Section>

        {/* ── 1. Logo ──────────────────────────────────────────────── */}
        <Section id="logo">
          <div className="text-center mb-12">
            <SectionLabel>01 — Logo</SectionLabel>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-foreground">
              Logo y variantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Sobre oscuro */}
            <div className="rounded-xl overflow-hidden border border-border">
              <div className="bg-transparent p-10 flex flex-col items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center ">
                    <SeaLionIcon size={30} />
                  </div>
                  <span className="font-sans font-bold text-3xl text-foreground tracking-tight">MdPDev</span>
                </div>
                <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center ">
                  <SeaLionIcon size={30} />
                </div>
              </div>
              <div className="bg-card/70 px-6 py-4 border-t border-border">
                <p className="text-sm font-semibold text-foreground">Sobre fondo oscuro</p>
                <p className="text-xs text-muted-foreground mt-0.5">Hero, Navbar, Footer</p>
              </div>
            </div>

            {/* Sobre claro */}
            <div className="rounded-xl overflow-hidden border border-border">
              <div className="bg-transparent p-10 flex flex-col items-center justify-center gap-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center ">
                    <SeaLionIcon size={30} />
                  </div>
                  <span className="font-sans font-bold text-3xl text-foreground tracking-tight">MdPDev</span>
                </div>
                <div className="w-14 h-14 rounded-xl bg-muted border border-border flex items-center justify-center ">
                  <SeaLionIcon size={30} />
                </div>
              </div>
              <div className="bg-card/70 px-6 py-4">
                <p className="text-sm font-semibold text-foreground">Sobre fondo claro</p>
                <p className="text-xs text-muted-foreground mt-0.5">Secciones internas, documentos</p>
              </div>
            </div>
          </div>

          {/* Tamaños */}
          <div className="bg-card/70 rounded-xl p-8 mb-8">
            <h3 className="font-sans font-bold text-lg text-foreground mb-6">Escala de tamaños</h3>
            <div className="flex items-end gap-8 flex-wrap">
              {[
                { size: 48, label: "48px — Normal" },
                { size: 40, label: "40px — Compacto (navbar)" },
                { size: 32, label: "32px — Mínimo" },
              ].map(({ size, label }) => (
                <div key={size} className="flex flex-col items-center gap-3">
                  <div
                    style={{ width: size, height: size }}
                    className="rounded-xl bg-muted border border-border flex items-center justify-center shadow-md"
                  >
                    <SeaLionIcon size={Math.round(size * 0.55)} />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Anatomía */}
          <div className="bg-card/60 rounded-xl p-8">
            <h3 className="font-sans font-bold text-lg text-foreground mb-4">Anatomía del ícono SVG</h3>
            <Code>{`viewBox="0 0 24 24"  fill="none"  stroke="white"

Cabeza     ellipse  cx="8"   cy="7.5"  rx="4"  ry="3.5"
Ojo        circle   cx="7"   cy="6.5"  r="0.8"
Hocico     path     M11.5 8.5 C13 8 14 8.5 13.5 9.5
Bigotes    path     M11.5 8 L14.5 7   (superior)
           path     M11.5 9 L14.5 9.5 (inferior)
Cuello     path     M6 11 C5.5 13 6 15 7 16
Cuerpo     path     M7 16 C9 17.5 13 18 17 16.5 …
Aleta frt  path     M5.5 14.5 C3.5 15.5 3 17.5 5 18.5
Aletas tr  path     M17.5 17 C19.5 16 21 17.5 19.5 19
           path     M16 17.5 C17 19.5 19 20.5 18 21.5`}</Code>
          </div>
        </Section>

        {/* ── 2. Colores ───────────────────────────────────────────── */}
        <Section id="colores" className="bg-transparent">
          <div className="text-center mb-12">
            <SectionLabel>02 — Colores</SectionLabel>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-foreground">
              Paleta de colores
            </h2>
          </div>

          {/* Ocean */}
          <div className="bg-card/60 rounded-xl p-8 mb-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans font-bold text-xl text-foreground">Ocean — Primaria</h3>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1 font-semibold">Principal</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <Swatch hex="#020030" token="ocean-900" label="Hero, footer" />
              <Swatch hex="#03045E" token="ocean-800" label="Navbar scrolled" />
              <Swatch hex="#023E8A" token="ocean-700" label="Gradientes" />
              <Swatch hex="#0077B6" token="ocean-600" label="Ocean (legacy)" />
              <Swatch hex="#0096C7" token="ocean-500" label="Íconos, bordes" />
              <Swatch hex="#00B4D8" token="ocean-400" label="CTA primario" />
              <Swatch hex="#48CAE4" token="ocean-300" label="Gradient-text" />
              <Swatch hex="#90E0EF" token="ocean-200" label="Texto sobre oscuro" />
              <Swatch hex="#ADE8F4" token="ocean-100" label="Badges light" dark />
              <Swatch hex="#CAF0F8" token="ocean-50"  label="Fondos suaves" dark />
            </div>
          </div>

          {/* Sand */}
          <div className="bg-card/60 rounded-xl p-8 mb-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-sans font-bold text-xl text-foreground">Sand — Acento cálido</h3>
              <span className="text-xs bg-sand-200 text-sand-500 rounded-full px-3 py-1 font-semibold border border-sand-300">Solo acento</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <Swatch hex="#D4B483" token="sand-500" label="Acento fuerte" />
              <Swatch hex="#E9D5A0" token="sand-400" label="Acento medio" dark />
              <Swatch hex="#F4E4C1" token="sand-300" label="Acento suave" dark />
              <Swatch hex="#F8EDD8" token="sand-200" label="Fondos cálidos" dark />
              <Swatch hex="#FEF9EE" token="sand-100" label="Casi blanco" dark />
            </div>
          </div>

          {/* Usos especiales */}
          <div className="bg-card/60 rounded-xl p-8 border border-border">
            <h3 className="font-sans font-bold text-xl text-foreground mb-6">Gradientes y efectos especiales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl overflow-hidden">
                <div className="bg-transparent h-20" />
                <div className="bg-card/70 p-3 border border-border border-t-0 rounded-b-xl">
                  <p className="text-xs font-semibold text-foreground">.bg-transparent</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">145deg: #020030 → #0077B6</p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden">
                <div className=" h-20" />
                <div className="bg-card/70 p-3 border border-border border-t-0 rounded-b-xl">
                  <p className="text-xs font-semibold text-foreground">.bg-transparent</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">180deg: #f0f9ff → #e0f4fb</p>
                </div>
              </div>
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="h-20 bg-transparent flex items-center justify-center">
                  <span className="text-foreground font-sans font-bold text-3xl">MdPDev</span>
                </div>
                <div className="bg-card/70 p-3 border-t border-border rounded-b-xl">
                  <p className="text-xs font-semibold text-foreground">.text-foreground</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">135deg: #48CAE4 → #023E8A</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 3. Tipografía ────────────────────────────────────────── */}
        <Section id="tipografia">
          <div className="text-center mb-12">
            <SectionLabel>03 — Tipografía</SectionLabel>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-foreground">
              Sistema tipográfico
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Space Grotesk */}
            <div className="bg-card/70 rounded-xl p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">Display</p>
                  <h3 className="font-sans font-bold text-2xl text-foreground">Space Grotesk</h3>
                </div>
                <span className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1 font-semibold">Títulos</span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-sans font-bold text-5xl text-foreground leading-[1.1]">H1 — 5xl</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">font-sans font-bold text-5xl</p>
                </div>
                <div>
                  <p className="font-sans font-bold text-4xl text-foreground">H2 — 4xl</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">font-sans font-bold text-4xl</p>
                </div>
                <div>
                  <p className="font-sans font-bold text-2xl text-foreground">H3 — 2xl</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">font-sans font-bold text-2xl</p>
                </div>
                <div>
                  <p className="font-sans font-semibold text-lg text-foreground">H4 — lg</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">font-sans font-semibold text-lg</p>
                </div>
                <div>
                  <p className="font-sans font-semibold text-xs uppercase tracking-widest text-muted-foreground">Label uppercase</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">font-sans text-xs tracking-widest uppercase</p>
                </div>
              </div>
            </div>

            {/* Inter */}
            <div className="bg-card/70 rounded-xl p-8 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">Body</p>
                  <h3 className="font-sans font-bold text-2xl text-foreground">Inter</h3>
                </div>
                <span className="text-xs bg-muted text-muted-foreground rounded-full px-3 py-1 font-semibold">Cuerpo</span>
              </div>
              <div className="space-y-5">
                <div>
                  <p className="text-2xl text-foreground leading-relaxed">Subtítulo — 2xl</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">text-2xl leading-relaxed</p>
                </div>
                <div>
                  <p className="text-lg text-muted-foreground leading-relaxed">Copy de sección — lg. Conectamos desarrolladores, diseñadores y emprendedores.</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">text-lg leading-relaxed</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Texto de card y nav — sm medium</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">text-sm font-medium</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Texto secundario y metadatos — xs</p>
                  <p className="text-xs text-muted-foreground mt-1 font-mono">text-xs text-muted-foreground</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card/60 rounded-xl p-8">
            <h3 className="font-sans font-bold text-lg text-foreground mb-4">Variables CSS de fuente</h3>
            <Code>{`--font-sans:    var(--font-inter), ui-sans-serif, system-ui, sans-serif;
--font-sans: var(--font-space-grotesk), ui-sans-serif, system-ui, sans-serif;

/* Aplicación en Tailwind */
font-sans     → Inter    (body por defecto)
font-sans  → Space Grotesk (headings, wordmark)`}</Code>
          </div>
        </Section>

        {/* ── 4. Voz y tono ────────────────────────────────────────── */}
        <Section id="voz" className="bg-transparent">
          <div className="text-center mb-12">
            <SectionLabel>04 — Voz y tono</SectionLabel>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-foreground">
              Cómo habla MdPDev
            </h2>
          </div>

          {/* Principios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {[
              {
                icon: "💬",
                title: "Directo y cercano",
                desc: 'Tuteo, primera persona del plural. "Conectamos", "Impulsamos", "Hablemos".',
              },
              {
                icon: "🌊",
                title: "Local con orgullo",
                desc: 'Identidad costera y marplatense. "La costa atlántica", "Ecosistema tech de Mar del Plata".',
              },
              {
                icon: "🤝",
                title: "Accesible",
                desc: "Sin jerga excesiva, sin tecnicismos innecesarios. Inclusivo para devs de todos los niveles.",
              },
              {
                icon: "⚡",
                title: "Orientado a la acción",
                desc: 'CTAs en imperativo, siempre con destino claro. "Unirse", "Ver Eventos", "Hablemos".',
              },
              {
                icon: "🚀",
                title: "Optimista",
                desc: "Futuro posible y concreto. No promesas vacías, sino construcción real.",
              },
              {
                icon: "🚫",
                title: "Lo que NO somos",
                desc: "No somos corporativos, no somos fríos, no somos genéricos ni excluyentes.",
              },
            ].map((p) => (
              <div key={p.title} className="bg-card/60 rounded-xl p-6 border border-border shadow-sm">
                <span className="text-2xl mb-3 block">{p.icon}</span>
                <h3 className="font-sans font-bold text-base text-foreground mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>

          {/* Ejemplos */}
          <div className="bg-card/60 rounded-xl border border-border overflow-hidden">
            <div className="px-8 py-5 border-b border-border">
              <h3 className="font-sans font-bold text-lg text-foreground">Ejemplos de copy</h3>
            </div>
            <div className="divide-y divide-white/10">
              {[
                {
                  context: "CTA principal",
                  good: "Unirse a la comunidad",
                  bad: "Register Now / Sign Up",
                },
                {
                  context: "Subtítulo hero",
                  good: "Conectamos desarrolladores, diseñadores y emprendedores en Mar del Plata",
                  bad: "La plataforma líder de networking tech",
                },
                {
                  context: "Call para colaboradores",
                  good: "¿Tu organización quiere impulsar el tech de la costa?",
                  bad: "Oportunidades de patrocinio disponibles",
                },
                {
                  context: "Evento",
                  good: "Un encuentro para conectar y compartir",
                  bad: "Networking event for professionals",
                },
              ].map((row) => (
                <div key={row.context} className="grid grid-cols-1 sm:grid-cols-3 gap-0">
                  <div className="px-8 py-4 bg-card/70 flex items-center border-b sm:border-b-0 sm:border-r border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{row.context}</p>
                  </div>
                  <div className="px-8 py-4 border-b sm:border-b-0 sm:border-r border-border flex items-center gap-2">
                    <span className="text-emerald-500 flex-shrink-0">✓</span>
                    <p className="text-sm text-foreground">{row.good}</p>
                  </div>
                  <div className="px-8 py-4 flex items-center gap-2">
                    <span className="text-red-400 flex-shrink-0">✕</span>
                    <p className="text-sm text-muted-foreground line-through">{row.bad}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 5. Componentes ───────────────────────────────────────── */}
        <Section id="componentes">
          <div className="text-center mb-12">
            <SectionLabel>05 — Componentes</SectionLabel>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-foreground">
              Componentes UI
            </h2>
          </div>

          {/* Botones */}
          <div className="mb-10">
            <h3 className="font-sans font-bold text-xl text-foreground mb-6">Botones</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primario */}
              <div className="bg-card/70 rounded-xl border border-border overflow-hidden">
                <div className="bg-transparent p-8 flex items-center justify-center">
                  <a className="inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-[10px] border border-border-strong bg-transparent px-5 text-[14px] font-medium text-foreground">
                    Unirse a la comunidad
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Primario — CTA principal</p>
                  <Code>{`bg-ocean-400 hover:bg-ocean-300
text-foreground px-8 py-4 rounded-full
font-semibold text-lg
 
`}</Code>
                </div>
              </div>

              {/* Secundario */}
              <div className="bg-card/70 rounded-xl border border-border overflow-hidden">
                <div className="bg-transparent p-8 flex items-center justify-center">
                  <a className="inline-flex items-center gap-2.5 border border-border text-muted-foreground hover:bg-card/70 hover:text-foreground hover:border-border-strong px-8 py-4 rounded-full font-semibold text-lg transition-[background-color,border-color,color,translate]  backdrop-blur-sm cursor-pointer">
                    Ver Eventos
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </a>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Secundario — outline (sobre oscuro)</p>
                  <Code>{`border border-border text-muted-foreground
hover:bg-card/70 hover:text-foreground
hover:border-border-strong
px-8 py-4 rounded-full font-semibold
backdrop-blur-sm `}</Code>
                </div>
              </div>

              {/* CTA primario */}
              <div className="bg-card/70 rounded-xl border border-border overflow-hidden">
                <div className="bg-transparent p-8 flex items-center justify-center border-b border-border">
                  <a className="inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-[10px] bg-foreground px-5 text-[14px] font-medium text-background">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                    </svg>
                    Sumate a la comunidad
                  </a>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">CTA primario — botón de contacto</p>
                  <Code>{`bg-foreground text-background
h-11 px-5 rounded-[10px] font-medium text-sm
(CTA primario Piedra)`}</Code>
                </div>
              </div>

              {/* Navbar compacto */}
              <div className="bg-card/70 rounded-xl border border-border overflow-hidden">
                <div className="bg-transparent p-8 flex items-center justify-center">
                  <a className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border-strong bg-transparent px-4 text-[13px] font-medium text-foreground">
                    Unirse a la comunidad
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Compacto — Navbar</p>
                  <Code>{`bg-foreground text-background
px-5 py-2.5 rounded-lg
text-sm font-semibold`}</Code>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="mb-10">
            <h3 className="font-sans font-bold text-xl text-foreground mb-6">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card oscura */}
              <div className="bg-card/70 rounded-xl border border-border overflow-hidden">
                <div className="bg-transparent p-8 flex justify-center">
                  <div className="bg-card/70 backdrop-blur-sm border border-ocean-600/30 rounded-xl p-5 text-center w-full max-w-[180px]">
                    <div className="w-12 h-12 bg-ocean-600/40 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#48CAE4" strokeWidth="2" strokeLinecap="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" />
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      </svg>
                    </div>
                    <p className="text-muted-foreground text-xs font-semibold uppercase tracking-widest mb-1">EMPLEOS</p>
                    <p className="text-foreground font-medium text-sm">Compartimos ofertas laborales</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Card oscura (hero features)</p>
                  <Code>{`bg-card/70 backdrop-blur-sm
border border-ocean-600/30
rounded-xl p-5`}</Code>
                </div>
              </div>

              {/* Card clara */}
              <div className="bg-card/70 rounded-xl border border-border overflow-hidden">
                <div className="bg-transparent p-8 flex justify-center border-b border-border">
                  <div className="bg-card/70 border border-border rounded-xl p-7 text-center w-full max-w-[180px]  transition-[translate,box-shadow]  ">
                    <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0096C7" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <h3 className="font-sans font-bold text-base text-foreground mb-1">Visibilidad</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">Tu org frente a la comunidad</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Card clara (colaboradores)</p>
                  <Code>{`bg-card/70 border border-border
rounded-xl p-7

 
transition-all duration-300`}</Code>
                </div>
              </div>

              {/* Card team */}
              <div className="bg-card/70 rounded-xl border border-border overflow-hidden">
                <div className=" p-8 flex justify-center border-b border-border">
                  <div className="bg-transparent rounded-xl border border-border shadow-sm p-7 text-center w-full max-w-[180px] .5 transition-[translate,box-shadow]  ">
                    <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-3 text-foreground text-xl font-bold font-sans ">
                      FP
                    </div>
                    <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-semibold mb-2">
                      ⭐ Co-fundador
                    </span>
                    <h3 className="font-sans font-bold text-sm text-foreground">Franco Petruccelli</h3>
                    <p className="text-muted-foreground text-xs">QA Engineer</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">Card de equipo</p>
                  <Code>{`bg-transparent rounded-xl
border border-border shadow-sm p-7
.5
 
transition-all duration-300`}</Code>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <h3 className="font-sans font-bold text-xl text-foreground mb-6">Badges</h3>
            <div className="bg-card/70 rounded-xl border border-border p-8">
              <div className="flex flex-wrap gap-6 items-start">
                <div className="flex flex-col gap-2 items-start">
                  <div className="inline-flex items-center gap-2 bg-card/70 text-muted-foreground rounded-full px-4 py-2 text-sm font-semibold">
                    🤝 Colaboradores
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">Badge de sección (sobre H2)</p>
                  <Code>{`bg-card/70 text-muted-foreground
rounded-full px-4 py-2
text-sm font-semibold`}</Code>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <div className="inline-flex items-center gap-2.5 bg-card/70 border border-border backdrop-blur-sm rounded-full px-5 py-2 text-muted-foreground text-sm font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-ocean-300 pulse-dot flex-shrink-0" />
                    Comunidad marplatense
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">Badge hero (sobre oscuro)</p>
                  <Code>{`bg-card/70 border border-border
backdrop-blur-sm rounded-full
px-5 py-2 text-muted-foreground text-sm`}</Code>
                </div>
                <div className="flex flex-col gap-2 items-start">
                  <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-semibold">
                    ⭐ Co-fundador
                  </span>
                  <p className="text-xs text-muted-foreground font-mono">Badge inline (en card)</p>
                  <Code>{`bg-muted text-muted-foreground
rounded-full px-3 py-1
text-xs font-semibold`}</Code>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── 6. Do's & Don'ts ─────────────────────────────────────── */}
        <Section id="reglas" className="bg-transparent">
          <div className="text-center mb-12">
            <SectionLabel>06 — Reglas</SectionLabel>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-foreground">
              {"Do's & Don'ts"}
            </h2>
          </div>

          <div className="space-y-8">
            {[
              {
                title: "Logo",
                dos: [
                  'Escribir siempre "MdPDev" (M, P y D en mayúsculas)',
                  "Mantener el ratio cuadrado del contenedor (mínimo 32×32 px)",
                  "Respetar 8px de espacio libre alrededor del logo",
                  "Usar el faro únicamente como decoración de fondo del hero",
                ],
                donts: [
                  '"mdpdev", "MDP Dev" o "Mdp dev" son incorrectos',
                  "No estirar ni aplanar el contenedor del ícono",
                  "No superponer otros elementos sobre el logo",
                  "No usar el faro como ícono de la marca",
                ],
              },
              {
                title: "Color",
                dos: [
                  "Texto blanco sobre ocean-700 o más oscuro",
                  ".text-foreground solo sobre fondos blancos o muy claros",
                  ".bg-transparent únicamente en la sección hero y navbar",
                  "Sand como acento puntual, nunca como color principal",
                ],
                donts: [
                  "No usar texto blanco sobre ocean-400 o más claro",
                  "No aplicar .text-foreground sobre fondos oscuros",
                  "No reutilizar .bg-transparent en secciones internas",
                  "No usar sand como fondo de una sección completa",
                ],
              },
              {
                title: "Tipografía",
                dos: [
                  "Space Grotesk para headings, wordmark y labels de sección",
                  "Inter para párrafos, nav links y texto de footer",
                  "tracking-widest en labels uppercase",
                  "leading-[1.1] en títulos grandes",
                ],
                donts: [
                  "No mezclar ambas fuentes en el mismo bloque de texto",
                  "No usar labels uppercase sin tracking extra",
                  "No usar leading-normal en títulos grandes (queda muy espaciado)",
                  "No usar font-sans en párrafos de texto corrido",
                ],
              },
              {
                title: "Voz",
                dos: [
                  '"Unirse a la comunidad" como CTA principal',
                  '"La costa atlántica" para identidad regional',
                  "Tuteo o primera persona del plural",
                  "Copy en español siempre",
                ],
                donts: [
                  'No usar "Join our community" ni inglés para CTAs',
                  'No usar "la región" (demasiado genérico)',
                  "No usar tercera persona formal ni lenguaje corporativo",
                  "No traducir el nombre de la comunidad",
                ],
              },
            ].map((group) => (
              <div key={group.title}>
                <h3 className="font-sans font-bold text-xl text-foreground mb-4">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RuleCard type="do" items={group.dos} />
                  <RuleCard type="dont" items={group.donts} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── 7. Brand Book v2 (jun 2026) ──────────────────────────── */}
        <Section id="identidad-v2" className="bg-transparent">
          <div className="text-center mb-12">
            <SectionLabel>07 — Identidad v2</SectionLabel>
            <h2 className="font-sans font-bold text-4xl md:text-5xl text-foreground mb-4">
              Dos capas, una comunidad
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Brand Core (ocean) para comunicación externa. Editorial Shell para la
              experiencia web inmersiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="bg-card/70 rounded-xl border border-border p-6">
              <h3 className="font-sans font-bold text-lg text-foreground mb-3">
                Capa 1 — Brand Core
              </h3>
              <ul className="text-sm text-white/70 space-y-2 list-disc pl-5">
                <li>Paleta ocean + sand</li>
                <li>Space Grotesk + Inter</li>
                <li>Mascota león marino</li>
                <li>Posts, press, sponsors, marketing kit</li>
              </ul>
            </div>
            <div className="bg-card/70 rounded-xl border border-border p-6">
              <h3 className="font-sans font-bold text-lg text-foreground mb-3">
                Capa 2 — Editorial Shell
              </h3>
              <ul className="text-sm text-white/70 space-y-2 list-disc pl-5">
                <li>Fondo <code className="text-muted-foreground">#06070d</code></li>
                <li>Fraunces + JetBrains Mono</li>
                <li>Wordmark <code className="text-muted-foreground">mardelplata.dev.ar</code></li>
                <li>Home y secciones editoriales</li>
              </ul>
            </div>
          </div>

          <div className="bg-card/70 rounded-xl border border-border p-6 mb-6">
            <h3 className="font-sans font-bold text-lg text-foreground mb-3">
              Posicionamiento
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Comunidad independiente y grassroots de Mar del Plata y la costa
              atlántica. Aliados estratégicos de ATICMA — no competidores.
              Comunidad, bolsa de trabajo, Primer Trabajo OS y Red OSS.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <a
              href="https://github.com/LuigiRaffaeleSianoCanoro/mardelplata/blob/main/BRAND.md"
              className="text-muted-foreground hover:text-sky-200 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              BRAND.md
            </a>
            <span className="text-white/30">·</span>
            <a href="/marketing-kit" className="text-muted-foreground hover:text-sky-200 underline">
              Marketing Kit
            </a>
            <span className="text-white/30">·</span>
            <span className="text-white/50">#MdPDev #MarDelPlata</span>
          </div>
        </Section>

      </div>
      
    </PageFrame>
  );

}
