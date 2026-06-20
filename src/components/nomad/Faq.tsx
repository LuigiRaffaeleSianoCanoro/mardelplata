// Acordeón de preguntas frecuentes con afordancia visible (chevron que rota).
// Reemplaza los <details><summary> sueltos que ocultaban el marcador (audit A1).
// Server component. El JSON-LD FAQPage se sigue emitiendo aparte en cada página.

import type { FaqEntry } from "@/content/nomad";

interface FaqProps {
  items: FaqEntry[];
}

function ChevronIcon() {
  return (
    <svg
      className="faq-chevron"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function Faq({ items }: FaqProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      {items.map((f) => (
        <details key={f.question} className="shell-card faq-item">
          <summary className="faq-summary">
            <span className="shell-card__title" style={{ margin: 0 }}>
              {f.question}
            </span>
            <ChevronIcon />
          </summary>
          <p className="shell-card__desc" style={{ marginTop: "0.6rem" }}>
            {f.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
