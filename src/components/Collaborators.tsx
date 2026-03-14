"use client";

import { useState } from "react";

const ALL_COLLABS = [
  { emoji: "🏛️", name: "UTN Mar del Plata",  href: "#" },
  { emoji: "🎓", name: "UNMDP",               href: "#" },
  { emoji: "🌊", name: "CoastalCode",          href: "#" },
  { emoji: "⚡", name: "TechMar",             href: "#" },
  { emoji: "🚀", name: "StartupMDP",           href: "#" },
  { emoji: "💻", name: "ORT Argentina",        href: "#" },
  { emoji: "🔒", name: "CiberMDP",             href: "#" },
  { emoji: "🎮", name: "GameDevMDP",           href: "#" },
  { emoji: "📊", name: "DataCoast",            href: "#" },
  { emoji: "🌐", name: "WebSur",               href: "#" },
  { emoji: "☁️", name: "CloudMar",             href: "#" },
  { emoji: "🤖", name: "AI Atlantic",          href: "#" },
  { emoji: "💡", name: "InnovaPort",           href: "#" },
  { emoji: "🐟", name: "Pescador Labs",        href: "#" },
  { emoji: "🏖️", name: "BuenosDev",           href: "#" },
];

const INITIAL_SHOW = 9;

export default function Collaborators() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? ALL_COLLABS : ALL_COLLABS.slice(0, INITIAL_SHOW);

  return (
    <section id="colaboradores" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-ocean-50 text-ocean-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            🤝 Colaboradores
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ocean-900 mb-4">
            Quiénes confían en<br />
            <span className="gradient-text">nuestra comunidad</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Más de 15 organizaciones y empresas marplatenses impulsan el talento tech de la costa.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {visible.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className="group bg-slate-50 border border-slate-200 text-slate-700 font-medium px-5 py-3 rounded-full text-sm transition-all duration-300 hover:bg-linear-to-br hover:from-ocean-800 hover:to-ocean-600 hover:text-white hover:border-transparent hover:scale-105"
            >
              {c.emoji} {c.name}
            </a>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => setExpanded((e) => !e)}
            className="inline-flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-semibold transition-colors text-sm"
          >
            {expanded ? "Ver menos colaboradores" : "Ver todos los colaboradores"}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
