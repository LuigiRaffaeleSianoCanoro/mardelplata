"use client";

import { GitBranch, ExternalLink, Users, Eye } from "lucide-react";
import type { ProjectCardData } from "@/lib/red/types";

const STATUS_LABEL: Record<ProjectCardData["status"], string> = {
  active: "Activo",
  paused: "Pausado",
  archived: "Archivado",
};

const STATUS_DOT: Record<ProjectCardData["status"], string> = {
  active: "rgb(59, 130, 246)",
  paused: "rgb(255, 176, 112)",
  archived: "rgba(255, 255, 255, 0.35)",
};

interface ProjectCardProps {
  project: ProjectCardData;
  /** Open the project sheet — the sheet itself is wired in a parent. */
  onOpen?: (slug: string) => void;
}

// The card itself acts like a button (opens the sheet), but the inner
// repo/demo affordances need to remain real <a> tags. <a> inside <a> is
// invalid HTML and triggers a hydration error in Next 15, so the outer
// element is an <article role="button"> instead of a Link.

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const handleActivate = () => {
    if (onOpen) onOpen(project.slug);
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
            style={{ background: STATUS_DOT[project.status], boxShadow: `0 0 8px ${STATUS_DOT[project.status]}` }}
          />
          {STATUS_LABEL[project.status]}
        </p>
        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-white/45 hover:text-white transition-colors"
            aria-label="Repo"
          >
            <GitBranch size={14} />
          </a>
        )}
      </div>

      <h3 className="display-thin text-white text-xl mb-1 leading-tight">{project.name}</h3>
      {project.description && (
        <p className="text-white/60 text-sm font-light leading-relaxed line-clamp-3 mb-4">
          {project.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-white/45 text-[0.72rem]">
        <span className="flex items-center gap-1.5">
          <Users size={12} /> {project.contributors_count}
        </span>
        <span className="flex items-center gap-1.5">
          <Eye size={12} /> {project.followers_count}
        </span>
        {project.demo_url && (
          <a
            href={project.demo_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto flex items-center gap-1 text-white/55 hover:text-white transition-colors"
          >
            demo <ExternalLink size={11} />
          </a>
        )}
      </div>
    </article>
  );
}
