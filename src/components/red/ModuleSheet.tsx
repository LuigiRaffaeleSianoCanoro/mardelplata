"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Boxes, GitBranch, ExternalLink, FileText } from "lucide-react";
import BottomSheet from "./BottomSheet";
import {
  SheetHeaderSkeleton,
  SheetToolbarSkeleton,
  SheetBodySkeleton,
} from "./SheetSkeleton";
import {
  getModuleBySlug,
  listModuleUsagesByModule,
  type ModuleUsageWithProject,
} from "@/lib/red/queries";
import type { ModuleCardData, ModuleKind } from "@/lib/red/types";

type TabId = "overview" | "proyectos";

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "proyectos", label: "Proyectos", icon: GitBranch },
];

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

interface ModuleSheetProps {
  slug: string | null;
  onClose: () => void;
}

export default function ModuleSheet({ slug, onClose }: ModuleSheetProps) {
  const [mod, setMod] = useState<ModuleCardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabId>("overview");
  const [usages, setUsages] = useState<ModuleUsageWithProject[]>([]);
  const open = slug !== null;

  useEffect(() => {
    if (slug) setTab("overview");
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setMod(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getModuleBySlug(slug).then((m) => {
      if (cancelled) return;
      setMod(m);
      setLoading(false);
      if (!m) return;
      listModuleUsagesByModule(m.id).then((rows) => {
        if (!cancelled) setUsages(rows);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const showSkeleton = loading && !mod;

  const header = !mod ? (
    showSkeleton ? <SheetHeaderSkeleton /> : null
  ) : (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: KIND_ACCENT[mod.kind], boxShadow: `0 0 8px ${KIND_ACCENT[mod.kind]}` }}
        />
        <span className="kicker text-white/55">{KIND_LABEL[mod.kind]}</span>
        <span className="text-white/25">·</span>
        <span className="kicker text-white/45">red / módulo</span>
      </div>
      <div className="flex items-end gap-3 flex-wrap">
        <h2 className="display-thin text-white text-3xl sm:text-4xl leading-tight tracking-[-0.01em]">
          {mod.name}
        </h2>
        {mod.version && (
          <span className="text-white/65 font-mono text-[0.78rem] mb-1">v{mod.version}</span>
        )}
        {mod.source_url && (
          <a
            href={mod.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-white/65 hover:text-white text-[0.78rem] mb-1 transition-colors"
          >
            source <ExternalLink size={10} />
          </a>
        )}
      </div>
      <div className="flex items-center gap-5 text-white/55 text-[0.78rem]">
        <span className="inline-flex items-center gap-1.5">
          <GitBranch size={12} /> {mod.usages_count} {mod.usages_count === 1 ? "proyecto lo usa" : "proyectos lo usan"}
        </span>
        {mod.license && (
          <span className="inline-flex items-center gap-1.5">
            <Boxes size={12} /> {mod.license}
          </span>
        )}
      </div>
    </div>
  );

  const toolbar = !mod ? (
    showSkeleton ? <SheetToolbarSkeleton count={2} /> : null
  ) : (
    <div className="flex items-center gap-1 px-1">
      {TABS.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            type="button"
            className={`sheet-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <Icon size={13} className="opacity-80" />
            {t.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      header={header}
      toolbar={toolbar}
      ariaLabel={mod ? `Módulo ${mod.name}` : "Módulo"}
    >
      {showSkeleton && <SheetBodySkeleton />}
      {!loading && !mod && open && (
        <div className="p-10 text-center text-white/55 font-light">Módulo no encontrado.</div>
      )}
      {mod && tab === "overview" && (
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <p className="kicker text-white/45">Sobre el módulo</p>
            <p className="text-white/80 font-light leading-relaxed whitespace-pre-wrap">
              {mod.description ?? "Sin descripción."}
            </p>
          </div>
          <aside className="space-y-4">
            <Field label="Tipo" value={KIND_LABEL[mod.kind]} />
            <Field label="Versión" value={mod.version ?? "—"} />
            <Field label="Licencia" value={mod.license ?? "—"} />
            <Field
              label="Creado"
              value={new Date(mod.created_at).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
          </aside>
        </div>
      )}
      {mod && tab === "proyectos" && (
        <div className="p-6 sm:p-8 space-y-2">
          {usages.length === 0 ? (
            <div className="py-10 text-center">
              <GitBranch size={24} className="text-white/35 mx-auto mb-3" />
              <p className="text-white/55 font-light">Ningún proyecto declaró que lo usa todavía.</p>
            </div>
          ) : (
            usages.map((u) => (
              <div
                key={u.project.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              >
                <GitBranch size={14} className="text-white/55" />
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 text-sm font-light truncate">{u.project.name}</p>
                  {u.usage.note && (
                    <p className="text-white/45 text-[0.72rem] truncate">“{u.usage.note}”</p>
                  )}
                </div>
                <span className="kicker text-white/45">
                  {new Date(u.usage.declared_at).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </BottomSheet>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="kicker text-white/40 mb-1">{label}</p>
      <p className="text-white/80 text-sm font-light">{value}</p>
    </div>
  );
}
