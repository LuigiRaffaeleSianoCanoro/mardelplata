import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Marketing Kit — mardelplata.dev.ar",
  description:
    "Recursos de comunicación, templates de copy y materiales de difusión de la comunidad mardelplata.dev.ar.",
};

// ── Helpers ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="kicker text-white/45 mb-3 flex items-center justify-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB070]" />
      {children}
    </p>
  );
}

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
    <section id={id} className={`py-20 px-6 ${className}`}>
      <div className="max-w-5xl mx-auto">{children}</div>
    </section>
  );
}

function SectionHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12">
      <SectionLabel>{label}</SectionLabel>
      <h2 className="font-display font-bold text-4xl md:text-5xl text-white/90 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/65 text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}

// Copy card: shows a ready-to-use text block with a copy-friendly layout
function CopyCard({
  platform,
  context,
  text,
  tags,
}: {
  platform: string;
  context: string;
  text: string;
  tags?: string[];
}) {
  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/12 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between px-5 py-3 bg-white/5 border-b border-white/12">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-sky-300 bg-sky-500/15 rounded-full px-2.5 py-1">
            {platform}
          </span>
          <span className="text-xs text-white/60">{context}</span>
        </div>
        <span className="text-xs text-white/65 font-mono">{text.length} chars</span>
      </div>
      <div className="p-5">
        <p className="text-sm text-white/85 leading-relaxed whitespace-pre-line">{text}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {tags.map((t) => (
              <span key={t} className="text-xs text-sky-300 font-medium">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Stat card for the press kit
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-6 text-center shadow-sm">
      <p className="font-display font-bold text-3xl text-sky-300 mb-1">{value}</p>
      <p className="text-sm text-white/65">{label}</p>
    </div>
  );
}

// Pitch feature row
function PitchFeature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-display font-semibold text-white/90 text-sm">{title}</p>
        <p className="text-white/65 text-sm leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MarketingKitPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-32 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <p className="kicker text-white/65 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB070]" />
              comunicación y difusión
            </p>
            <h1 className="display-thin text-white text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.01em] mb-4">
              Marketing Kit{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-white/95 to-[#FF2DAA]">
                mardelplata.dev.ar
              </span>
              .
            </h1>
            <p className="text-white/60 font-light leading-relaxed text-lg max-w-2xl mb-8">
              Templates de copy, recursos para redes sociales, materiales para prensa
              y pitch para colaboradores. Todo listo para usar y adaptar.
            </p>
            {/* Índice rápido */}
            <div className="flex flex-wrap gap-3">
              {[
                ["#press",  "Press Kit"],
                ["#social", "Redes sociales"],
                ["#eventos","Eventos"],
                ["#pitch",  "Colaboradores"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex items-center border border-white/12 text-white/65 hover:bg-white/[0.05] hover:text-white hover:border-white/30 px-5 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 1. Press Kit ─────────────────────────────────────────── */}
        <Section id="press">
          <SectionHeading
            label="01 — Press Kit"
            title="Sobre mardelplata.dev.ar"
            subtitle="Información oficial para medios, blogs, podcasts y cualquier cobertura de la comunidad."
          />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatCard value="2026" label="Año de fundación" />
            <StatCard value="MdP" label="Ciudad base" />
            <StatCard value="2" label="Co-fundadores" />
            <StatCard value="100%" label="Open community" />
          </div>

          {/* Descripción oficial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white/[0.04] rounded-2xl p-8 text-white">
              <p className="text-xs text-white/55 font-semibold uppercase tracking-widest mb-3">
                Descripción corta (tweet / bio)
              </p>
              <p className="text-white/85 leading-relaxed text-lg">
                mardelplata.dev.ar es la comunidad tech de Mar del Plata. Conectamos desarrolladores,
                diseñadores y emprendedores de la costa atlántica.
              </p>
              <p className="text-xs text-sky-300 font-mono mt-4">136 caracteres</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <p className="text-xs text-sky-300 font-semibold uppercase tracking-widest mb-3">
                Descripción larga (artículos / presentaciones)
              </p>
              <p className="text-white/85 leading-relaxed text-sm">
                mardelplata.dev.ar es la comunidad de tecnología y desarrollo de Mar del Plata, Argentina.
                Fundada en 2026 por Franco Petruccelli y Luigi Canoro, dos QA Engineers marplatenses,
                la comunidad nació con el objetivo de conectar el talento tech local y construir
                un ecosistema digital sostenible en la costa atlántica.
                <br /><br />
                A través de eventos presenciales, recursos compartidos y un grupo activo de WhatsApp,
                mardelplata.dev.ar impulsa la colaboración entre desarrolladores, diseñadores y emprendedores
                de todos los niveles.
              </p>
            </div>
          </div>

          {/* Fundadores */}
          <div>
            <h3 className="font-display font-bold text-xl text-white/90 mb-6">Co-fundadores</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  initials: "FP",
                  name: "Franco Petruccelli",
                  role: "Co-fundador · QA Engineer",
                  bio: "QA Engineer marplatense, co-creador de mardelplata.dev.ar. Apasionado por la calidad del software y el crecimiento del ecosistema tech local.",
                  from: "from-ocean-400",
                  to: "to-ocean-800",
                },
                {
                  initials: "LC",
                  name: "Luigi Canoro",
                  role: "Co-fundador · QA Engineer",
                  bio: "QA Engineer marplatense, co-creador de mardelplata.dev.ar. Enfocado en comunidad, tecnología y en impulsar el talento de la costa atlántica.",
                  from: "from-teal-400",
                  to: "to-ocean-700",
                },
              ].map((f) => (
                <div
                  key={f.name}
                  className="flex items-start gap-4 bg-white/[0.03] rounded-2xl border border-white/10 p-6 shadow-sm"
                >
                  <div
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${f.from} ${f.to} flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0 shadow-lg`}
                  >
                    {f.initials}
                  </div>
                  <div>
                    <p className="font-display font-bold text-white/90">{f.name}</p>
                    <p className="text-sky-300 text-xs font-medium mb-2">{f.role}</p>
                    <p className="text-white/65 text-sm leading-relaxed">{f.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 2. Redes sociales ────────────────────────────────────── */}
        <Section id="social" className="bg-transparent">
          <SectionHeading
            label="02 — Redes sociales"
            title={<>Templates para<br /><span className="gradient-text">redes sociales</span></>}
            subtitle="Copy listo para adaptar en LinkedIn, Instagram y WhatsApp. Ajustá el tono a cada plataforma."
          />

          {/* LinkedIn */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#0A66C2] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-white/90">LinkedIn</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CopyCard
                platform="LinkedIn"
                context="Lanzamiento / presentación"
                text={`Estamos construyendo el hub tech de la costa atlántica. 🌊

mardelplata.dev.ar es la comunidad de desarrolladores, diseñadores y emprendedores de Mar del Plata. Un espacio para conectar, aprender y crecer juntos.

Si estás en MdP y trabajás en tecnología, este es tu lugar.

👉 Sumate al grupo: [link]`}
                tags={["#MarDelPlataDev", "#MarDelPlata", "#TechCommunity", "#Desarrollo"]}
              />
              <CopyCard
                platform="LinkedIn"
                context="Búsqueda de colaboradores"
                text={`¿Tu empresa o institución quiere estar en el radar de la escena tech de Mar del Plata?

En mardelplata.dev.ar conectamos organizaciones con desarrolladores, diseñadores y emprendedores de la costa atlántica.

Estamos abiertos a colaboraciones, sponsors y co-creadores. Hablemos. 👇`}
                tags={["#MarDelPlataDev", "#Colaboración", "#TechMarDelPlata"]}
              />
              <CopyCard
                platform="LinkedIn"
                context="Difusión de evento"
                text={`El próximo [FECHA] nos encontramos en [LUGAR] para el [NOMBRE DEL EVENTO].

Un encuentro presencial para conectar con la comunidad tech de Mar del Plata. Sin slides, sin formalidades — solo devs, buenas charlas y café.

Lugar: [DIRECCIÓN]
Hora: [HORA]
Entrada: libre y gratuita

Sumate 👉 [link RSVP o WhatsApp]`}
                tags={["#MarDelPlataDev", "#Evento", "#MarDelPlata", "#Dev"]}
              />
              <CopyCard
                platform="LinkedIn"
                context="Post de comunidad / milestone"
                text={`[NÚMERO] personas ya forman parte de mardelplata.dev.ar, la comunidad tech de Mar del Plata.

Cada semana compartimos oportunidades laborales, recursos de aprendizaje y noticias del ecosistema local.

Si todavía no estás, ¿qué esperás?

👉 [link]`}
                tags={["#MarDelPlataDev", "#Comunidad", "#Tech", "#MarDelPlata"]}
              />
            </div>
          </div>

          {/* Instagram */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-white/90">Instagram</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CopyCard
                platform="Instagram"
                context="Post / carrusel de presentación"
                text={`Devs, diseñadores y emprendedores de Mar del Plata: esto es para ustedes. 🌊

mardelplata.dev.ar es el hub tech de la costa atlántica. Empleos, cursos, eventos y comunidad — todo en un solo lugar.

Link en bio para unirse al grupo de WhatsApp.`}
                tags={["#MarDelPlataDev", "#MarDelPlata", "#Dev", "#Tech", "#ComunidadTech", "#CostaAtlantica"]}
              />
              <CopyCard
                platform="Instagram"
                context="Story — CTA a WhatsApp"
                text={`¿Trabajás en tech en Mar del Plata?

Tenemos un grupo para vos 👇

mardelplata.dev.ar — la comunidad tech de la costa

[Sticker de link al WhatsApp]`}
              />
              <CopyCard
                platform="Instagram"
                context="Post de evento"
                text={`Nos vemos en [NOMBRE DEL EVENTO] 📍

[FECHA] · [HORA] · [LUGAR]

Un encuentro para conectar con la comunidad tech de Mar del Plata. Entrada libre.

Más info en bio (o avisanos por WhatsApp).`}
                tags={["#MarDelPlataDev", "#EventoTech", "#MarDelPlata", "#Networking"]}
              />
              <CopyCard
                platform="Instagram"
                context="Quote / contenido de valor"
                text={`"El talento tech de Mar del Plata existe. Solo faltaba un lugar donde encontrarse."

mardelplata.dev.ar · El hub tech de la costa atlántica 🌊`}
                tags={["#MarDelPlataDev", "#TechCommunity", "#MarDelPlata"]}
              />
            </div>
          </div>

          {/* WhatsApp */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl text-white/90">WhatsApp</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CopyCard
                platform="WhatsApp"
                context="Invitación a nuevo miembro"
                text={`Hola [NOMBRE] 👋

Te mando el link a mardelplata.dev.ar, la comunidad tech de Mar del Plata. Compartimos empleos, cursos y eventos de la escena local.

👉 [link al grupo]

¡Cualquier cosa, avisame!`}
              />
              <CopyCard
                platform="WhatsApp"
                context="Bienvenida en el grupo"
                text={`Bienvenido/a a mardelplata.dev.ar 🌊

Somos la comunidad tech de Mar del Plata. Acá compartimos:

💼 Ofertas laborales
📚 Recursos y cursos
📅 Eventos y meetups
🤝 Networking

Presentate cuando quieras — contanos en qué trabajás y qué te trajo por acá. ¡Nos alegra tenerte!`}
              />
              <CopyCard
                platform="WhatsApp"
                context="Difusión de evento (al grupo)"
                text={`📅 *[NOMBRE DEL EVENTO]*

Nos juntamos el *[DÍA] a las [HORA]* en *[LUGAR]*.

[1-2 líneas describiendo de qué trata el evento]

Entrada: *libre y gratuita*
Cupos: [si aplica]

¿Quién se suma? 🙋`}
              />
              <CopyCard
                platform="WhatsApp"
                context="Compartir oferta laboral"
                text={`💼 *[PUESTO]*

Empresa: [EMPRESA]
Modalidad: [Remoto / Híbrido / Presencial]
Ubicación: [si aplica]
Seniority: [Junior / Semi / Senior]

[1-2 líneas sobre el rol o empresa]

📩 Postulaciones: [link o email]

_Compartí si conocés a alguien que le sirva 🙌_`}
              />
            </div>
          </div>
        </Section>

        {/* ── 3. Templates de eventos ──────────────────────────────── */}
        <Section id="eventos">
          <SectionHeading
            label="03 — Eventos"
            title={<>Templates para<br /><span className="gradient-text">difusión de eventos</span></>}
            subtitle="Copy adaptable para anunciar, recordar y agradecer cada evento de la comunidad."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CopyCard
              platform="Anuncio"
              context="Primera comunicación"
              text={`📣 Próximo evento mardelplata.dev.ar

*[NOMBRE DEL EVENTO]*
📅 [DÍA, FECHA]
🕐 [HORA]
📍 [LUGAR COMPLETO]

[2-3 líneas sobre de qué trata el evento y por qué vale la pena ir]

Entrada libre y gratuita. Cupos limitados.

Confirmá tu asistencia por acá 👇 o mandanos un mensaje.`}
            />
            <CopyCard
              platform="Recordatorio"
              context="48h antes del evento"
              text={`⏰ Recordatorio: *[NOMBRE DEL EVENTO]* es en dos días

📅 [FECHA] · 🕐 [HORA]
📍 [LUGAR]

Si todavía no confirmaste tu lugar, ¡todavía estás a tiempo!

Nos vemos ahí 🌊`}
            />
            <CopyCard
              platform="On the day"
              context="Día del evento (story / status)"
              text={`Hoy es el día 🙌

[NOMBRE DEL EVENTO] — [HORA] — [LUGAR]

Si vas, nos vemos ahí. Si no pudiste sumarte esta vez, estate atento: vienen más eventos de mardelplata.dev.ar.`}
            />
            <CopyCard
              platform="Post-evento"
              context="Agradecimiento y resumen"
              text={`Gracias a todos los que se animaron al [NOMBRE DEL EVENTO] 🌊

[1-2 líneas sobre cómo salió: cantidad de asistentes, lo que se habló, el clima, etc.]

Fue un encuentro increíble y motivador. El ecosistema tech de Mar del Plata está vivo.

El próximo evento ya está en camino — seguinos para enterarte primero.`}
            />
          </div>

          {/* Checklist pre-evento */}
          <div className="bg-white/[0.04] rounded-2xl p-8">
            <h3 className="font-display font-bold text-lg text-white mb-6">
              Checklist de comunicación pre-evento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
              {[
                ["2 semanas antes", "Anuncio en LinkedIn + Instagram + WhatsApp"],
                ["1 semana antes", "Recordatorio en redes + story con countdown"],
                ["48 hs antes", "Recordatorio final en WhatsApp del grupo"],
                ["Día del evento", "Story / status 'hoy es el día'"],
                ["Mismo día / siguiente", "Fotos + agradecimiento en todas las redes"],
                ["1 semana después", "Post de resumen con aprendizajes o highlights"],
              ].map(([tiempo, accion]) => (
                <div key={tiempo} className="flex items-start gap-3">
                  <span className="text-ocean-400 flex-shrink-0 mt-0.5">✓</span>
                  <div>
                    <p className="text-white/55 text-xs font-semibold">{tiempo}</p>
                    <p className="text-white/65 text-sm">{accion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── 4. Pitch para colaboradores ──────────────────────────── */}
        <Section id="pitch" className="bg-transparent">
          <SectionHeading
            label="04 — Colaboradores"
            title={<>Pitch para<br /><span className="gradient-text">colaboradores y sponsors</span></>}
            subtitle="Materiales para presentar mardelplata.dev.ar a empresas, instituciones y organizaciones que quieran sumarse."
          />

          {/* One-pager de la propuesta */}
          <div className="bg-white/[0.03] rounded-2xl border border-white/10 overflow-hidden shadow-sm mb-8">
            <div className="bg-transparent px-8 py-10">
              <p className="text-xs text-white/55 font-semibold uppercase tracking-widest mb-2">
                Propuesta de colaboración
              </p>
              <h3 className="font-display font-bold text-2xl text-white mb-3">
                Impulsá el tech de la costa atlántica
              </h3>
              <p className="text-white/65 text-base leading-relaxed max-w-2xl">
                mardelplata.dev.ar es la comunidad de referencia tech en Mar del Plata. Ser parte
                de nuestra red significa visibilidad directa frente al talento local,
                conexión con el ecosistema digital de la ciudad y un impacto real
                en el crecimiento de la industria.
              </p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <PitchFeature
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0096C7" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  }
                  title="Visibilidad"
                  desc="Tu organización aparece frente a cientos de desarrolladores y empresas de la región atlántica."
                />
                <PitchFeature
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0096C7" strokeWidth="2" strokeLinecap="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  }
                  title="Networking"
                  desc="Conectá con el talento tech de Mar del Plata en eventos, meetups y actividades de la comunidad."
                />
                <PitchFeature
                  icon={
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0096C7" strokeWidth="2" strokeLinecap="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  }
                  title="Impacto"
                  desc="Contribuí al crecimiento del ecosistema tech local e impulsá el talento de la costa atlántica."
                />
              </div>

              {/* Formas de colaborar */}
              <h4 className="font-display font-semibold text-white/90 mb-4">¿Cómo podemos colaborar?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {[
                  ["🎤", "Ser sponsor de un evento mardelplata.dev.ar"],
                  ["📢", "Difundir ofertas laborales a la comunidad"],
                  ["🎓", "Ofrecer recursos educativos o workshops"],
                  ["🤝", "Co-organizar meetups y actividades"],
                  ["🌐", "Aparecer como colaborador en el sitio web"],
                  ["💬", "Compartir expertise con la comunidad"],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                    <span className="text-xl">{icon}</span>
                    <p className="text-sm text-white/85">{text}</p>
                  </div>
                ))}
              </div>

              <a
                href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-ocean-600 hover:bg-ocean-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:shadow-xl hover:shadow-ocean-600/30 hover:-translate-y-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
                Hablemos por WhatsApp
              </a>
            </div>
          </div>

          {/* Email de pitch */}
          <div>
            <h3 className="font-display font-bold text-xl text-white/90 mb-5">Template de email / DM</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <CopyCard
                platform="Email / DM"
                context="Primer contacto con empresa o institución"
                text={`Hola [NOMBRE],

Te escribo de mardelplata.dev.ar, la comunidad tech de Mar del Plata. Somos un grupo activo de desarrolladores, diseñadores y emprendedores de la ciudad, y estamos construyendo el ecosistema digital de la costa atlántica.

Nos gustaría explorar una posible colaboración con [EMPRESA/INSTITUCIÓN]. Podría ser algo tan simple como difundir sus oportunidades laborales a la comunidad, co-organizar un evento, o aparecer como colaborador en nuestro sitio.

¿Tienen 15 minutos para una charla esta semana?

Saludos,
[Tu nombre]
mardelplata.dev.ar`}
              />
              <CopyCard
                platform="Email / DM"
                context="Follow-up después de un evento"
                text={`Hola [NOMBRE],

Fue un placer cruzarnos en [EVENTO/CONTEXTO]. Tal como te comenté, somos mardelplata.dev.ar — la comunidad tech de Mar del Plata.

Me gustaría retomar la conversación sobre [TEMA ESPECÍFICO QUE HABLARON]. Creo que hay una linda oportunidad de colaborar.

¿Les parece bien juntarnos la semana que viene?

Saludos,
[Tu nombre]
mardelplata.dev.ar`}
              />
            </div>
          </div>
        </Section>

      </main>
      <Footer />
    </>
  );
}
