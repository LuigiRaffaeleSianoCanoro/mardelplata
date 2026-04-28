"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, GitBranch, Lightbulb, Boxes, X, CornerDownLeft } from "lucide-react";
import { listPublicProjects, listIdeas, listModules } from "@/lib/red/queries";
import type { ProjectCardData, IdeaCardData, ModuleCardData } from "@/lib/red/types";

type ResultKind = "project" | "idea" | "module";

interface Result {
  kind: ResultKind;
  id: string;
  slug: string;
  title: string;
  hint: string;
  href: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [ideas, setIdeas] = useState<IdeaCardData[]>([]);
  const [modules, setModules] = useState<ModuleCardData[]>([]);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    // Lazy-load the catalog the first time the palette opens — keeps the
    // initial bundle for / and other pages clean.
    if (projects.length === 0) listPublicProjects().then(setProjects);
    if (ideas.length === 0) listIdeas().then(setIdeas);
    if (modules.length === 0) listModules().then(setModules);
    setQuery("");
    setActiveIdx(0);
    // Focus input after the panel mounts (createPortal renders sync).
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [open, projects.length, ideas.length, modules.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const all: Result[] = [
      ...projects.map<Result>((p) => ({
        kind: "project",
        id: p.id,
        slug: p.slug,
        title: p.name,
        hint: `proyecto · ${p.status}`,
        href: `/red?p=${p.slug}`,
      })),
      ...ideas.map<Result>((i) => ({
        kind: "idea",
        id: i.id,
        slug: i.slug,
        title: i.title,
        hint: `idea · ${i.status}${i.tags.length ? " · " + i.tags.slice(0, 2).join(", ") : ""}`,
        href: `/red/ideas?i=${i.slug}`,
      })),
      ...modules.map<Result>((m) => ({
        kind: "module",
        id: m.id,
        slug: m.slug,
        title: m.name,
        hint: `módulo · ${m.kind}${m.version ? " · v" + m.version : ""}`,
        href: `/red/modulos?m=${m.slug}`,
      })),
    ];
    if (!q) return all.slice(0, 12);
    return all
      .filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.slug.toLowerCase().includes(q) ||
          r.hint.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [projects, ideas, modules, query]);

  useEffect(() => {
    if (activeIdx >= results.length) setActiveIdx(0);
  }, [results.length, activeIdx]);

  // Scroll active item into view when navigating with arrows.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!mounted || !open) return null;

  const handleNavigate = (r: Result) => {
    router.push(r.href);
    onClose();
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIdx];
      if (target) handleNavigate(target);
    }
  };

  // Group results by kind for a clearer visual hierarchy.
  const grouped: Array<[ResultKind, Result[]]> = [
    ["project", results.filter((r) => r.kind === "project")],
    ["idea", results.filter((r) => r.kind === "idea")],
    ["module", results.filter((r) => r.kind === "module")],
  ];

  // Compute a flat index → group/result map so arrow nav still works across
  // groups (we render groups in flat order; the filter result already
  // includes everything).
  const flatOrder: Result[] = grouped.flatMap(([, rs]) => rs);

  return createPortal(
    <div className="cmdk-root" role="dialog" aria-modal="true" aria-label="Búsqueda global">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="cmdk-backdrop"
      />
      <div className="cmdk-panel">
        <div className="cmdk-input-row">
          <Search size={16} className="text-white/45 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIdx(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Buscar proyectos, ideas, módulos…"
            className="cmdk-input"
          />
          <kbd className="cmdk-kbd hidden sm:inline-flex">esc</kbd>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-white/55 hover:text-white p-1 rounded-md hover:bg-white/[0.05] transition-colors sm:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <div ref={listRef} className="cmdk-list">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-white/45 font-light text-sm">
              Sin resultados.
            </div>
          ) : (
            grouped.map(([kind, rs]) => {
              if (rs.length === 0) return null;
              return (
                <div key={kind}>
                  <p className="cmdk-group-label">
                    {kind === "project"
                      ? "Proyectos"
                      : kind === "idea"
                        ? "Ideas"
                        : "Módulos"}
                  </p>
                  {rs.map((r) => {
                    const idx = flatOrder.indexOf(r);
                    const Icon = ICONS[r.kind];
                    const active = idx === activeIdx;
                    return (
                      <button
                        key={`${r.kind}:${r.id}`}
                        type="button"
                        data-idx={idx}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => handleNavigate(r)}
                        className={`cmdk-item ${active ? "is-active" : ""}`}
                      >
                        <Icon size={14} className="shrink-0 opacity-80" />
                        <span className="text-white/90 text-sm font-light truncate flex-1 text-left">
                          {r.title}
                        </span>
                        <span className="text-white/40 text-[0.72rem] truncate hidden sm:inline">
                          {r.hint}
                        </span>
                        {active && (
                          <CornerDownLeft size={11} className="text-white/55 shrink-0 hidden sm:inline" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="cmdk-footer">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <kbd className="cmdk-kbd">↑</kbd>
              <kbd className="cmdk-kbd">↓</kbd>
              navegá
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="cmdk-kbd">↵</kbd>
              abrir
            </span>
          </div>
          <span className="text-white/35">red · mar del plata</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

const ICONS: Record<ResultKind, typeof GitBranch> = {
  project: GitBranch,
  idea: Lightbulb,
  module: Boxes,
};
