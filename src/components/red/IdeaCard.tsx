"use client";

import { Lightbulb, GitBranch, Eye } from "lucide-react";
import type { IdeaCardData } from "@/lib/red/types";

const STATUS_LABEL: Record<IdeaCardData["status"], string> = {
  open: "Abierta",
  active: "En construcción",
  archived: "Archivada",
};

const STATUS_DOT: Record<IdeaCardData["status"], string> = {
  open: "rgb(255, 176, 112)",
  active: "rgb(59, 130, 246)",
  archived: "rgba(255, 255, 255, 0.35)",
};

interface IdeaCardProps {
  idea: IdeaCardData;
  onOpen?: (slug: string) => void;
}

export default function IdeaCard({ idea, onOpen }: IdeaCardProps) {
  const handleActivate = () => {
    if (onOpen) onOpen(idea.slug);
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
            style={{ background: STATUS_DOT[idea.status], boxShadow: `0 0 8px ${STATUS_DOT[idea.status]}` }}
          />
          {STATUS_LABEL[idea.status]}
        </p>
        <Lightbulb size={14} className="text-white/45" />
      </div>

      <h3 className="display-thin text-white text-xl mb-1 leading-tight">{idea.title}</h3>
      {idea.description && (
        <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-3 mb-4">
          {idea.description}
        </p>
      )}

      {idea.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {idea.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="text-[0.65rem] tracking-wide uppercase text-white/55 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-white/45 text-[0.72rem]">
        <span className="flex items-center gap-1.5">
          <GitBranch size={12} /> {idea.projects_count} {idea.projects_count === 1 ? "proyecto" : "proyectos"}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={12} /> {idea.followers_count}
        </span>
      </div>
    </article>
  );
}
