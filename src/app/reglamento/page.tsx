import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Código de Conducta — mardelplata.dev.ar",
  description:
    "Reglamento y código de conducta de la comunidad de desarrolladores de Mar del Plata.",
};

const sections = [
  {
    title: "Respeto mutuo",
    body: "Tratá a todos los integrantes de la comunidad con respeto y consideración, independientemente de su nivel de experiencia, género, edad, nacionalidad, religión u orientación sexual. Las críticas constructivas son bienvenidas; los ataques personales, no.",
    glow: "violet" as const,
  },
  {
    title: "Inclusión y diversidad",
    body: "mardelplata.dev.ar es un espacio abierto para toda persona interesada en tecnología. Valoramos la diversidad de perspectivas y experiencias. Cualquier forma de discriminación o exclusión está prohibida.",
    glow: "cyan" as const,
  },
  {
    title: "Comunicación constructiva",
    body: "Expresá tus ideas con claridad y buena fe. Escuchá activamente antes de responder. El desacuerdo técnico es natural y enriquecedor; la hostilidad y los insultos no tienen lugar aquí.",
    glow: "emerald" as const,
  },
  {
    title: "Sin acoso",
    body: "No se tolerará ningún tipo de acoso, ya sea en eventos presenciales, en los grupos de mensajería o en cualquier canal oficial de la comunidad. Esto incluye comentarios ofensivos, persecución, contacto no deseado y cualquier otra conducta que haga sentir incómodo a un integrante.",
    glow: "rose" as const,
  },
  {
    title: "Privacidad",
    body: "Respetá la privacidad de los demás miembros. No compartas información personal de otros sin su consentimiento explícito. Las conversaciones privadas dentro de la comunidad no deben difundirse sin permiso.",
    glow: "sky" as const,
  },
  {
    title: "Espíritu de colaboración",
    body: "Esta comunidad crece cuando sus miembros comparten conocimiento, ayudan a quienes están aprendiendo y celebran los logros colectivos. Te invitamos a participar con generosidad: compartí recursos, respondé dudas y contribuí a hacer de mardelplata.dev.ar un espacio que nos represente a todos.",
    glow: "amber" as const,
  },
  {
    title: "Consecuencias",
    body: "El incumplimiento de este código puede derivar en una advertencia, la suspensión temporal o la expulsión definitiva de los espacios de la comunidad, según la gravedad del caso. Las decisiones las toman los fundadores o administradores designados.",
    glow: "violet" as const,
  },
];

export default function ReglamentoPage() {
  return (
    <>
      <Navbar />
      <main className="reglamento-x">
        <header className="reglamento-x-header shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow" style={{ textAlign: "center" }}>
            <p className="shell-eyebrow">CÓDIGO DE CONDUCTA</p>
            <h1 className="shell-title shell-title--xl">
              Reglamento de la <em>comunidad.</em>
            </h1>
            <p className="shell-lead" style={{ marginInline: "auto" }}>
              En mardelplata.dev.ar creemos que la comunidad crece cuando sus miembros se sienten
              seguros, respetados e incluidos. Este código define las expectativas de conducta
              para todos.
            </p>
          </div>
        </header>

        <section className="shell-section shell-section--soft">
          <div className="shell-inner shell-inner--narrow">
            <div className="reglamento-x-list">
              {sections.map((s, i) => (
                <article key={s.title} className="shell-card reglamento-card">
                  <span className="reglamento-card-num shell-card__meta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="reglamento-card-title">{s.title}</h2>
                  <p className="reglamento-card-body">{s.body}</p>
                  <span className={`reglamento-card-bar reglamento-card-bar--${s.glow}`} />
                </article>
              ))}
            </div>

            <div className="shell-card shell-card--cta reglamento-cta">
              <p className="reglamento-cta-text">
                Si presenciás o experimentás una situación que no cumpla con este código, ponete
                en contacto con los fundadores a través del grupo de WhatsApp.
              </p>
              <a
                href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
                target="_blank"
                rel="noopener noreferrer"
                className="shell-btn-primary"
              >
                Contactar a los fundadores <span aria-hidden>→</span>
              </a>
            </div>

            <p className="reglamento-x-update">
              Última actualización: mayo 2026 · mardelplata.dev.ar
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
