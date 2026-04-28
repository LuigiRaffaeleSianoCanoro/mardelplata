"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import RedHeader from "@/components/red/RedHeader";
import ModuleCard from "@/components/red/ModuleCard";
import ModuleSheet from "@/components/red/ModuleSheet";
import NewModuleDialog from "@/components/red/NewModuleDialog";
import { listModules } from "@/lib/red/queries";
import { useCurrentUserId } from "@/lib/red/useCurrentUserId";
import { useSheetUrlSync } from "@/lib/red/useSheetUrlSync";
import type { ModuleCardData, ModuleKind } from "@/lib/red/types";

const KIND_FILTERS: { id: ModuleKind | "all"; label: string }[] = [
  { id: "all", label: "Todos" },
  { id: "component", label: "Componentes" },
  { id: "hook", label: "Hooks" },
  { id: "helper", label: "Helpers" },
  { id: "integration", label: "Integraciones" },
  { id: "pattern", label: "Patterns" },
  { id: "snippet", label: "Snippets" },
];

export default function ModulesPage() {
  const userId = useCurrentUserId();
  const [modules, setModules] = useState<ModuleCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [creatingOpen, setCreatingOpen] = useState(false);
  const [filter, setFilter] = useState<ModuleKind | "all">("all");

  useEffect(() => {
    let cancelled = false;
    listModules().then((rows) => {
      if (!cancelled) {
        setModules(rows);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = new URL(window.location.href).searchParams.get("m");
    if (slug) setOpenSlug(slug);
  }, []);

  useSheetUrlSync("m", openSlug);

  const visible = filter === "all" ? modules : modules.filter((m) => m.kind === filter);

  return (
    <main className="max-w-6xl mx-auto px-2 sm:px-4 py-10">
      <RedHeader
        eyebrow="red · módulos"
        title={
          <>
            Piezas que <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-white/95 to-[#FF2DAA]">se reutilizan</span>.
          </>
        }
        description="Componentes, helpers y patterns que la red empaqueta para que cualquier proyecto los use. Sumá los tuyos."
        action={
          <button
            type="button"
            onClick={() => setCreatingOpen(true)}
            disabled={!userId}
            className="btn-app-primary !text-[0.78rem] !py-2 !px-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Plus size={14} /> Nuevo módulo
          </button>
        }
      />

      <div className="flex items-center gap-1 mb-6 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] w-fit overflow-x-auto max-w-full">
        {KIND_FILTERS.map((k) => (
          <button
            key={k.id}
            type="button"
            onClick={() => setFilter(k.id)}
            className={`px-3.5 py-1.5 rounded-full text-[0.78rem] transition-colors whitespace-nowrap ${
              filter === k.id
                ? "bg-white/[0.08] text-white"
                : "text-white/55 hover:text-white/85"
            }`}
          >
            {k.label}
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
          <p className="text-white/65 font-light">Sin módulos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.map((m) => (
            <ModuleCard key={m.id} module={m} onOpen={setOpenSlug} />
          ))}
        </div>
      )}

      <ModuleSheet slug={openSlug} onClose={() => setOpenSlug(null)} />
      <NewModuleDialog
        open={creatingOpen}
        onClose={() => setCreatingOpen(false)}
        userId={userId}
        onCreated={(m) => {
          setModules((prev) => [m, ...prev]);
          setOpenSlug(m.slug);
        }}
      />
    </main>
  );
}
