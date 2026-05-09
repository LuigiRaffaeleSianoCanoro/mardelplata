"use client";

import { Boxes, GitBranch, ExternalLink } from "lucide-react";
import type { ModuleCardData, ModuleKind } from "@/lib/red/types";

const KIND_LABEL: Record<ModuleKind, string> = {
  component: "componente",
  helper: "helper",
  hook: "hook",
  pattern: "pattern",
  integration: "integración",
  snippet: "snippet",
};

const KIND_ACCENT: Record<ModuleKind, string> = {
  component: "rgb(59, 130, 246)",
  helper: "rgb(255, 176, 112)",
  hook: "rgb(255, 45, 170)",
  pattern: "rgba(255, 255, 255, 0.55)",
  integration: "rgb(120, 220, 200)",
  snippet: "rgba(255, 255, 255, 0.45)",
};

interface ModuleCardProps {
  module: ModuleCardData;
  onOpen?: (slug: string) => void;
}

export default function ModuleCard({ module: mod, onOpen }: ModuleCardProps) {
  const handleActivate = () => {
    if (onOpen) onOpen(mod.slug);
  };

  return (
    <article
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : -1}
      onClick={onOpen ? handleActivate : undefined}
      onKeyDown={(e) => {
        if (!onOpen) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      className={`glass-night p-5 block group transition-transform ${
        onOpen ? "cursor-pointer hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[rgba(59,130,246,0.45)]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="kicker text-white/45 flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: KIND_ACCENT[mod.kind], boxShadow: `0 0 8px ${KIND_ACCENT[mod.kind]}` }}
          />
          {KIND_LABEL[mod.kind]}
        </p>
        {mod.source_url && (
          <a
            href={mod.source_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-white/45 hover:text-white transition-colors"
            aria-label="Source"
          >
            <ExternalLink size={13} />
          </a>
        )}
      </div>

      <h3 className="display-thin text-white text-xl mb-1 leading-tight">{mod.name}</h3>
      {mod.description && (
        <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-3 mb-4">
          {mod.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-white/45 text-[0.72rem]">
        <span className="flex items-center gap-1.5">
          <GitBranch size={12} /> {mod.usages_count} {mod.usages_count === 1 ? "proyecto" : "proyectos"}
        </span>
        {mod.version && (
          <span className="text-white/55 font-mono text-[0.68rem]">v{mod.version}</span>
        )}
        {mod.license && <span className="ml-auto text-white/45">{mod.license}</span>}
        {!mod.license && (
          <Boxes size={12} className="ml-auto text-white/35" />
        )}
      </div>
    </article>
  );
}
