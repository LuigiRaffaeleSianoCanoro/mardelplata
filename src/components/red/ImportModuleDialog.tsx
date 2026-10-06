"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, Boxes } from "lucide-react";
import { listModules, declareModuleUsage } from "@/lib/red/queries";
import type { ModuleCardData } from "@/lib/red/types";

interface ImportModuleDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  userId: string;
  alreadyUsedModuleIds: string[];
  onImported: () => void;
}

export default function ImportModuleDialog({
  open,
  onClose,
  projectId,
  projectName,
  userId,
  alreadyUsedModuleIds,
  onImported,
}: ImportModuleDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [modules, setModules] = useState<ModuleCardData[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    listModules().then(setModules);
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
      setNote("");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return modules
      .filter((m) => !alreadyUsedModuleIds.includes(m.id))
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.slug.includes(q));
  }, [modules, query, alreadyUsedModuleIds]);

  if (!mounted || !open) return null;

  const handleSubmit = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    const ok = await declareModuleUsage({
      projectId,
      moduleId: selected,
      userId,
      note: note || null,
    });
    setSubmitting(false);
    if (ok) {
      onImported();
      onClose();
    }
  };

  return createPortal(
    <div className="red-dialog-root">
      <button type="button" onClick={onClose} aria-label="Cerrar" className="red-dialog-backdrop" />
      <div className="red-dialog-panel" role="dialog" aria-modal="true" aria-label="Importar módulo">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground mb-1">red · importar</p>
            <h3 className="font-semibold tracking-[-0.04em] text-foreground text-2xl leading-tight">Importar un módulo</h3>
            <p className="text-muted-foreground text-[0.78rem] mt-1 font-light">
              en <span className="text-white/75">{projectName}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-card transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground block mb-2">Buscar módulo</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre o slug…"
              className="red-input"
              autoFocus
            />
            <div className="mt-3 max-h-[260px] overflow-y-auto space-y-1.5 pr-1">
              {filtered.length === 0 ? (
                <p className="text-muted-foreground text-[0.78rem] font-light text-center py-6">
                  Sin módulos disponibles que coincidan.
                </p>
              ) : (
                filtered.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelected(m.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition-colors flex items-center gap-3 ${
                      selected === m.id
                        ? "border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.10)]"
                        : "border-white/[0.06] bg-white/[0.03] hover:bg-card"
                    }`}
                  >
                    <Boxes size={13} className="text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="text-white/90 text-sm font-light truncate">{m.name}</p>
                      <p className="text-white/40 text-[0.7rem] truncate">
                        {m.kind} · {m.slug}{m.version ? ` · v${m.version}` : ""}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground block mb-2">Nota (opcional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Para qué lo estás usando."
              rows={2}
              className="red-input resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full text-[0.78rem] text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected || submitting || !userId}
            className="px-4 py-1.5 rounded-full text-[0.78rem] text-foreground border border-border-strong bg-foreground text-background hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} /> Importar
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
