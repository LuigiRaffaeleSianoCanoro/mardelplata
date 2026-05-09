"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RedHeader from "@/components/red/RedHeader";
import ProjectCard from "@/components/red/ProjectCard";
import ProjectSheet from "@/components/red/ProjectSheet";
import NewProjectDialog from "@/components/red/NewProjectDialog";
import { listMyProjects } from "@/lib/red/queries";
import { useCurrentUser } from "@/lib/red/useCurrentUserId";
import { useSheetSlugParam } from "@/lib/red/useSheetUrlSync";
import type { ProjectCardData } from "@/lib/red/types";

export default function MyProjectsPage() {
  const { id: userId, ready: authReady } = useCurrentUser();
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSlug, setOpenSlug] = useSheetSlugParam("p");
  const [creatingOpen, setCreatingOpen] = useState(false);

  useEffect(() => {
    // Mientras auth resuelve, mantenemos loading=true para evitar el
    // flash de empty state antes de que sepamos si hay sesion.
    if (!authReady) return;
    if (!userId) {
      setProjects([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    listMyProjects(userId).then((rows) => {
      if (!cancelled) {
        setProjects(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [authReady, userId]);

  return (
    <main className="max-w-6xl mx-auto px-2 sm:px-4 py-10">
      <RedHeader
        eyebrow="red · mis proyectos"
        title="Lo que sigo y construyo."
        description="Proyectos donde sos contributor o que estás siguiendo. Un solo lugar para tu actividad."
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
          {[0, 1].map((i) => (
            <div key={i} className="glass-night p-5 h-[200px] animate-pulse opacity-50" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-night p-10 text-center">
          <p className="text-white/65 font-light mb-2">Todavía no estás siguiendo ni construyendo nada.</p>
          <p className="text-white/45 text-sm font-light">
            Pasate por <span className="text-white/75">Open source</span> y sumate a un proyecto, o arrancá el tuyo.
          </p>
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
