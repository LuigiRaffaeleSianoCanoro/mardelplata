import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Código de Conducta — MdPDev",
  description:
    "Reglamento y código de conducta de la comunidad de desarrolladores de Mar del Plata.",
};

const sections = [
  {
    emoji: "🤝",
    title: "Respeto mutuo",
    body: "Tratá a todos los integrantes de la comunidad con respeto y consideración, independientemente de su nivel de experiencia, género, edad, nacionalidad, religión u orientación sexual. Las críticas constructivas son bienvenidas; los ataques personales, no.",
  },
  {
    emoji: "🌊",
    title: "Inclusión y diversidad",
    body: "MdPDev es un espacio abierto para toda persona interesada en tecnología. Valoramos la diversidad de perspectivas y experiencias. Cualquier forma de discriminación o exclusión está prohibida.",
  },
  {
    emoji: "💬",
    title: "Comunicación constructiva",
    body: "Expresá tus ideas con claridad y buena fe. Escuchá activamente antes de responder. El desacuerdo técnico es natural y enriquecedor; la hostilidad y los insultos no tienen lugar aquí.",
  },
  {
    emoji: "🚫",
    title: "Sin acoso",
    body: "No se tolerará ningún tipo de acoso, ya sea en eventos presenciales, en los grupos de mensajería o en cualquier canal oficial de la comunidad. Esto incluye comentarios ofensivos, persecución, contacto no deseado y cualquier otra conducta que haga sentir incómodo a un integrante.",
  },
  {
    emoji: "🔒",
    title: "Privacidad",
    body: "Respetá la privacidad de los demás miembros. No compartas información personal de otros sin su consentimiento explícito. Las conversaciones privadas dentro de la comunidad no deben difundirse sin permiso.",
  },
  {
    emoji: "⭐",
    title: "Espíritu de colaboración",
    body: "Esta comunidad crece cuando sus miembros comparten conocimiento, ayudan a quienes están aprendiendo y celebran los logros colectivos. Te invitamos a participar con generosidad: compartí recursos, respondé dudas y contribuí a hacer de MdPDev un espacio que nos represente a todos.",
  },
  {
    emoji: "⚖️",
    title: "Consecuencias",
    body: "El incumplimiento de este código puede derivar en una advertencia, la suspensión temporal o la expulsión definitiva de los espacios de la comunidad, según la gravedad del caso. Las decisiones las toman los fundadores o administradores designados.",
  },
];

export default function ReglamentoPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-24 pb-20">
        {/* Header */}
        <div className="hero-bg relative overflow-hidden py-16 px-6 mb-16">
          <div className="absolute inset-0 opacity-[0.04] dots-bg pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-ocean-800/70 border border-ocean-500/30 backdrop-blur-sm rounded-full px-5 py-2 text-ocean-200 text-sm font-medium mb-6">
              📋 Código de Conducta
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Reglamento de la Comunidad
            </h1>
            <p className="text-ocean-200 text-lg leading-relaxed">
              En MdPDev creemos que la comunidad crece cuando sus miembros se sienten seguros,
              respetados e incluidos. Este código define las expectativas de conducta para todos.
            </p>
          </div>
          {/* Wave bottom */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: 40 }}>
            <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,20 C360,38 1080,5 1440,20 L1440,40 L0,40 Z" fill="white" />
            </svg>
          </div>
        </div>

        {/* Sections */}
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          {sections.map((s) => (
            <div
              key={s.title}
              className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md hover:border-ocean-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0 mt-0.5">{s.emoji}</span>
                <div>
                  <h2 className="font-display font-bold text-xl text-ocean-900 mb-2">{s.title}</h2>
                  <p className="text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Contact note */}
          <div className="bg-ocean-800 rounded-2xl p-7 text-center mt-8">
            <p className="text-ocean-200 text-sm leading-relaxed mb-4">
              Si presenciás o experimentás una situación que no cumpla con este código, ponete en contacto con los fundadores a través del grupo de WhatsApp.
            </p>
            <a
              href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all"
            >
              Contactar a los fundadores →
            </a>
          </div>

          <p className="text-center text-slate-400 text-sm pt-4">
            Última actualización: Marzo 2026 · MdPDev
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
