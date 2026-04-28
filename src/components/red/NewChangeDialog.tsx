"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { addProjectChange } from "@/lib/red/queries";
import type { ProjectChange, ChangeKind } from "@/lib/red/types";

interface NewChangeDialogProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  authorId: string;
  onCreated: (change: ProjectChange) => void;
}

const KINDS: { id: ChangeKind; label: string }[] = [
  { id: "feature", label: "feature" },
  { id: "fix", label: "fix" },
  { id: "chore", label: "chore" },
  { id: "note", label: "note" },
];

export default function NewChangeDialog({
  open,
  onClose,
  projectId,
  authorId,
  onCreated,
}: NewChangeDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [kind, setKind] = useState<ChangeKind>("feature");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [refUrl, setRefUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      setKind("feature");
      setTitle("");
      setBody("");
      setRefUrl("");
    }
  }, [open]);

  if (!mounted || !open) return null;

  const handleSubmit = async () => {
    if (!title.trim() || submitting) return;
    setSubmitting(true);
    const fresh = await addProjectChange({
      projectId,
      kind,
      title,
      body: body || null,
      refUrl: refUrl || null,
      authorId,
    });
    setSubmitting(false);
    if (fresh) {
      onCreated(fresh);
      onClose();
    }
  };

  return createPortal(
    <div className="red-dialog-root">
      <button type="button" onClick={onClose} aria-label="Cerrar" className="red-dialog-backdrop" />
      <div className="red-dialog-panel" role="dialog" aria-modal="true" aria-label="Nuevo cambio">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="kicker text-white/45 mb-1">red · cambio</p>
            <h3 className="display-thin text-white text-2xl leading-tight">Anotar un cambio</h3>
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
            <label className="kicker text-white/45 block mb-2">Tipo</label>
            <div className="flex items-center gap-1.5">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  className={`px-3 py-1.5 rounded-full text-[0.74rem] border transition-colors ${
                    kind === k.id
                      ? "text-white/95 border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.18)]"
                      : "text-white/65 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
                  }`}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Título">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Editor inline para páginas estáticas"
              className="red-input"
              autoFocus
            />
          </Field>

          <Field label="Detalle (opcional)">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Soporte de bloques tipo Notion con drag & drop."
              rows={3}
              className="red-input resize-none"
            />
          </Field>

          <Field label="Link (opcional)">
            <input
              value={refUrl}
              onChange={(e) => setRefUrl(e.target.value)}
              placeholder="https://github.com/…/pull/42"
              className="red-input"
            />
          </Field>
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
            disabled={!title.trim() || submitting || !authorId}
            className="px-4 py-1.5 rounded-full text-[0.78rem] text-white/95 border border-[rgba(59,130,246,0.45)] bg-[rgba(59,130,246,0.18)] hover:bg-[rgba(59,130,246,0.28)] disabled:opacity-50 inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} /> Crear
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="kicker text-white/45 block mb-2">{label}</label>
      {children}
    </div>
  );
}
