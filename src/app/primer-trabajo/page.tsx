import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TOOLS = [
  {
    href: "/primer-trabajo/diagnostico",
    title: "Diagnóstico",
    desc: "Preguntas con misiones (Silver Dev, EF SET, GitHub, certificados, portfolio, contacto a reclutadores, LeetCode), reglas duras y modo reclutador simulado.",
    icon: "🔍",
    glow: "violet" as const,
    featured: true,
  },
  {
    href: "/primer-trabajo/entrevista-hr",
    title: "Simulador Recursos Humanos",
    desc: "Preguntas tipo screening con feedback; el puntaje actualiza la señal de entrevista en el diagnóstico.",
    icon: "🎤",
    glow: "cyan" as const,
  },
  {
    href: "/primer-trabajo/plan",
    title: "Plan de acción",
    desc: "Checklist con mal/bien, rewrites y foco semanal. Progreso guardado en el navegador.",
    icon: "✅",
    glow: "emerald" as const,
  },
  {
    href: "/primer-trabajo/guia/cv",
    title: "Guía CV",
    desc: "Patrones mal/bien, mirada de quien selecciona y pasos de mejora enlazados al diagnóstico.",
    icon: "📄",
    glow: "amber" as const,
  },
  {
    href: "/primer-trabajo/guia/linkedin",
    title: "Guía LinkedIn",
    desc: "Titular, resumen del perfil, experiencia y coherencia con el CV — sin humo motivacional.",
    icon: "💼",
    glow: "sky" as const,
  },
  {
    href: "/primer-trabajo/empresas",
    title: "Empresas (directorio)",
    desc: "Referencias de Mar del Plata y remotas en Argentina.",
    icon: "📍",
    glow: "rose" as const,
    wide: true,
  },
];

export default function PrimerTrabajoPage() {
  return (
    <>
      <Navbar />
      <main className="primer-trabajo-x">
        <div className="shell-section shell-section--lg">
          <div className="shell-inner shell-inner--narrow">
            <p className="shell-eyebrow">HERRAMIENTA · MARDELPLATA.DEV</p>
            <h1 className="shell-title shell-title--xl">
              Primer Trabajo <em>OS.</em>
            </h1>
            <p className="shell-lead">
              No es un curso: es un sistema para evaluar cómo te ven quienes seleccionan
              candidatos en Argentina y qué corregir primero. Tono directo, foco en CV,
              LinkedIn, portfolio, búsqueda y mercado local.
            </p>

            <div className="primer-trabajo-grid">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className={`shell-card primer-trabajo-card ${t.featured ? "primer-trabajo-card--featured" : ""} ${t.wide ? "primer-trabajo-card--wide" : ""}`}
                  data-glow={t.glow}
                >
                  <span className="primer-trabajo-card-icon" aria-hidden>{t.icon}</span>
                  <h2 className="primer-trabajo-card-title">{t.title}</h2>
                  <p className="primer-trabajo-card-desc">{t.desc}</p>
                  <span className="primer-trabajo-card-arrow" aria-hidden>→</span>
                </Link>
              ))}
            </div>

            <p className="primer-trabajo-back">
              <Link href="/" className="shell-link">
                <span aria-hidden>←</span> Volver al inicio
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
