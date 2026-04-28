"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RedHeader from "@/components/red/RedHeader";
import IdeaCard from "@/components/red/IdeaCard";
import IdeaSheet from "@/components/red/IdeaSheet";
import NewIdeaDialog from "@/components/red/NewIdeaDialog";
import { listIdeas } from "@/lib/red/queries";
import { useCurrentUserId } from "@/lib/red/useCurrentUserId";
import { useSheetUrlSync } from "@/lib/red/useSheetUrlSync";
import type { IdeaCardData } from "@/lib/red/types";

type FilterMode = "all" | "following" | "mine";

export default function IdeasPage() {
  const userId = useCurrentUserId();
  const [ideas, setIdeas] = useState<IdeaCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<FilterMode>("all");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listIdeas().then((rows) => {
      if (!cancelled) {
        setIdeas(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = new URL(window.location.href).searchParams.get("i");
    if (slug) setOpenSlug(slug);
  }, []);

  useSheetUrlSync("i", openSlug);

  // Filtering by following / mine is a noop until we wire up auth & follower
  // tables (etapa 2). For now the toggle only updates the chosen visual.
  const visible = ideas;

  return (
    <main className="max-w-6xl mx-auto px-2 sm:px-4 py-10">
      <RedHeader
        eyebrow="red · ideas"
        title={
          <>
            Posibles <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FFB070] via-white/95 to-[#FF2DAA]">próximos pasos</span>.
          </>
        }
        description="Tablero de ideas que la comunidad puede transformar en proyectos. Seguí las que te llaman, linkealas si ya las estás construyendo."
        action={
          <button
            type="button"
            onClick={() => setCreatingOpen(true)}
            disabled={!userId}
            className="btn-app-primary !text-[0.78rem] !py-2 !px-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} /> Nueva idea
          </button>
        }
      />

      <div className="flex items-center gap-1 mb-6 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] w-fit">
        {(["all", "following", "mine"] as FilterMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3.5 py-1.5 rounded-full text-[0.78rem] transition-colors ${
              mode === m
                ? "bg-white/[0.08] text-white"
                : "text-white/55 hover:text-white/85"
            }`}
          >
            {m === "all" ? "Todas" : m === "following" ? "Sigo" : "Mías"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-night p-5 h-[200px] animate-pulse opacity-50" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="glass-night p-10 text-center">
          <p className="text-white/65 font-light">Sin ideas todavía. Tirá la primera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((i) => (
            <IdeaCard key={i.id} idea={i} onOpen={setOpenSlug} />
          ))}
        </div>
      )}

      <IdeaSheet slug={openSlug} onClose={() => setOpenSlug(null)} />
      <NewIdeaDialog
        open={creatingOpen}
        onClose={() => setCreatingOpen(false)}
        userId={userId}
        onCreated={(i) => {
          setIdeas((prev) => [i, ...prev]);
          setOpenSlug(i.slug);
        }}
      />
    </main>
  );
}
