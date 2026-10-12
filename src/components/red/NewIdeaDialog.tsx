"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { createIdea } from "@/lib/red/queries";
import { slugify } from "@/lib/red/slugify";
import type { IdeaCardData } from "@/lib/red/types";

interface NewIdeaDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onCreated: (idea: IdeaCardData) => void;
}

export default function NewIdeaDialog({ open, onClose, userId, onCreated }: NewIdeaDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touchedSlug, setTouchedSlug] = useState(false);

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
      setTitle("");
      setSlug("");
      setDescription("");
      setTagsRaw("");
      setError(null);
      setTouchedSlug(false);
    }
  }, [open]);

  useEffect(() => {
    if (touchedSlug) return;
    setSlug(slugify(title));
  }, [title, touchedSlug]);

  if (!mounted || !open) return null;

  const handleSubmit = async () => {
    if (!title.trim() || !slug.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 6);
    const fresh = await createIdea({
      slug,
      title,
      description: description || null,
      tags,
      userId,
    });
    setSubmitting(false);
    if (!fresh) {
      setError("No se pudo crear. ¿El slug ya existe?");
      return;
    }
    onCreated(fresh);
    onClose();
  };

  return createPortal(
    <div className="red-dialog-root">
      <button type="button" onClick={onClose} aria-label="Cerrar" className="red-dialog-backdrop" />
      <div className="red-dialog-panel" role="dialog" aria-modal="true" aria-label="Nueva idea">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground mb-1">red · idea</p>
            <h3 className="font-semibold tracking-[-0.04em] text-foreground text-2xl leading-tight">Tirar una idea</h3>
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
          <Field label="Título">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ranking de asistencia a eventos"
              className="red-input"
              autoFocus
            />
          </Field>

          <Field label="Slug" hint="se usa en /red/ideas?i=…">
            <input
              value={slug}
              onChange={(e) => {
                setTouchedSlug(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="ranking-asistencia"
              className="red-input"
            />
          </Field>

          <Field label="Descripción (opcional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mostrar top de miembros más activos del semestre con un toque editorial."
              rows={3}
              className="red-input resize-none"
            />
          </Field>

          <Field label="Tags" hint="separá por comas, hasta 6">
            <input
              value={tagsRaw}
              onChange={(e) => setTagsRaw(e.target.value)}
              placeholder="comunidad, gamificación"
              className="red-input"
            />
          </Field>

          {error && <p className="text-[#ff8aa8] text-[0.78rem] font-light">{error}</p>}
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
            disabled={!title.trim() || !slug.trim() || submitting || !userId}
            className="px-4 py-1.5 rounded-full text-[0.78rem] text-foreground border border-border-strong bg-foreground text-background hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus size={13} /> Crear
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground">{label}</label>
        {hint && <span className="text-muted-foreground text-[0.7rem] font-light">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
