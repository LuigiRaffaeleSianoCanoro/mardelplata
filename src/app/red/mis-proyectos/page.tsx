"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RedHeader from "@/components/red/RedHeader";
import ProjectCard from "@/components/red/ProjectCard";
import { listMyProjects } from "@/lib/red/queries";
import type { ProjectCardData } from "@/lib/red/types";
import { createClient } from "@/lib/supabase/client";
import { IS_MOCK, mockUser } from "@/lib/devMock";

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      let userId = mockUser.id;
      if (!IS_MOCK) {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        userId = data?.user?.id ?? "";
      }
      if (!userId) {
        setProjects([]);
        setLoading(false);
        return;
      }
      const rows = await listMyProjects(userId);
      if (!cancelled) {
        setProjects(rows);
        setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-2 sm:px-4 py-10">
      <RedHeader
        eyebrow="red · mis proyectos"
        title="Lo que sigo y construyo."
        description="Proyectos donde sos contributor o que estás siguiendo. Un solo lugar para tu actividad."
        action={
          <button
            type="button"
            className="btn-app-primary !text-[0.78rem] !py-2 !px-4 inline-flex items-center gap-2"
            disabled
            title="Próximamente — etapa 2"
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
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </main>
  );
}
