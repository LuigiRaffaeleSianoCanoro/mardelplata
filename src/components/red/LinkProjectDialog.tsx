"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, GitBranch } from "lucide-react";
import {
  listPublicProjects,
  linkIdeaToProject,
} from "@/lib/red/queries";
import type { ProjectCardData, IdeaLinkType } from "@/lib/red/types";

interface LinkProjectDialogProps {
  open: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  userId: string;
  alreadyLinkedProjectIds: string[];
  onLinked: (projectId: string, linkType: IdeaLinkType) => void;
}

export default function LinkProjectDialog({
  open,
  onClose,
  ideaId,
  ideaTitle,
  userId,
  alreadyLinkedProjectIds,
  onLinked,
}: LinkProjectDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [linkType, setLinkType] = useState<IdeaLinkType>("related");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    listPublicProjects().then(setProjects);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected("");
      setLinkType("related");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) => !alreadyLinkedProjectIds.includes(p.id))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.slug.includes(q));
  }, [projects, query, alreadyLinkedProjectIds]);

  if (!mounted || !open) return null;

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    const ok = await linkIdeaToProject({ ideaId, projectId: selected, linkType, userId });
    setSubmitting(false);
    if (ok) {
      onLinked(selected, linkType);
      onClose();
    }
  };

  return createPortal(
    <div className="red-dialog-root">
      <button type="button" onClick={onClose} aria-label="Cerrar" className="red-dialog-backdrop" />
      <div className="red-dialog-panel" role="dialog" aria-modal="true" aria-label="Linkear proyecto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="kicker text-white/45 mb-1">red · linkear</p>
            <h3 className="display-thin text-white text-2xl leading-tight">Conectar con un proyecto</h3>
            <p className="text-white/55 text-[0.78rem] mt-1 font-light">
              <span className="text-white/75">{ideaTitle}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-white/55 hover:text-white p-1 rounded-md hover:bg-white/[0.05] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="kicker text-white/45 block mb-2">Tipo de link</label>
            <div className="flex items-center gap-1.5">
              {(["related", "implements"] as IdeaLinkType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setLinkType(t)}
                  className={`px-3 py-1.5 rounded-full text-[0.74rem] border transition-colors ${
                    linkType === t
                      ? "text-white/95 border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.18)]"
                      : "text-white/65 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-white/40 text-[0.7rem] mt-2 font-light">
              <span className="text-white/55">implements</span> marca la idea como en construcción.{" "}
              <span className="text-white/55">related</span> es una conexión temática.
            </p>
          </div>

          <div>
            <label className="kicker text-white/45 block mb-2">Buscar proyecto</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre o slug…"
              className="red-input"
              autoFocus
            />
            <div className="mt-3 max-h-[260px] overflow-y-auto space-y-1.5 pr-1">
              {filtered.length === 0 ? (
                <p className="text-white/45 text-[0.78rem] font-light text-center py-6">
                  Sin proyectos que coincidan.
                </p>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-colors flex items-center gap-3 ${
                      selected === p.id
                        ? "border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.10)]"
                        : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.05]"
                    }`}
                  >
                    <GitBranch size={13} className="text-white/55" />
                    <div className="min-w-0">
                      <p className="text-white/90 text-sm font-light truncate">{p.name}</p>
                      <p className="text-white/40 text-[0.7rem] truncate">{p.slug}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-[0.78rem] text-white/65 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected || submitting || !userId}
            className="px-4 py-1.5 rounded-full text-[0.78rem] text-white/95 border border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.18)] hover:bg-[rgba(59,130,246,0.28)] disabled:opacity-50 inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} /> Linkear
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
