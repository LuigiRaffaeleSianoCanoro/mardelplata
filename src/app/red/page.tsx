"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RedHeader from "@/components/red/RedHeader";
import ProjectCard from "@/components/red/ProjectCard";
import ProjectSheet from "@/components/red/ProjectSheet";
import NewProjectDialog from "@/components/red/NewProjectDialog";
import { listPublicProjects } from "@/lib/red/queries";
import { useCurrentUserId } from "@/lib/red/useCurrentUserId";
import { useSheetUrlSync } from "@/lib/red/useSheetUrlSync";
import type { ProjectCardData } from "@/lib/red/types";

export default function RedDirectoryPage() {
  const userId = useCurrentUserId();
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listPublicProjects().then((rows) => {
      if (!cancelled) {
        setProjects(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Read the deep-link query param on mount so /red?p=<slug> opens the sheet.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = new URL(window.location.href).searchParams.get("p");
    if (slug) setOpenSlug(slug);
  }, []);

  useSheetUrlSync("p", openSlug);

  return (
    <main className="max-w-6xl mx-auto px-2 sm:px-4 py-10">
      <RedHeader
        eyebrow="red · open source"
        title={
          <>
            Lo que <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-white/95 to-[#FF2DAA]">construye</span> la comunidad.
          </>
        }
        description="Proyectos open-source que viven en la red de Mar del Plata. Sumate a uno, seguilo, o creá el tuyo."
        action={
          <button
            type="button"
            onClick={() => setCreatingOpen(true)}
            disabled={!userId}
            className="btn-app-primary !text-[0.78rem] !py-2 !px-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} /> Nuevo proyecto
          </button>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-night p-5 h-[200px] animate-pulse opacity-50" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-night p-10 text-center">
          <p className="text-white/65 font-light">Todavía no hay proyectos. Sé el primero en arrancar uno.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={setOpenSlug} />
          ))}
        </div>
      )}

      <ProjectSheet slug={openSlug} onClose={() => setOpenSlug(null)} />
      <NewProjectDialog
        open={creatingOpen}
        onClose={() => setCreatingOpen(false)}
        userId={userId}
        onCreated={(p) => {
          setProjects((prev) => [p, ...prev]);
          setOpenSlug(p.slug);
        }}
      />
    </main>
  );
}
