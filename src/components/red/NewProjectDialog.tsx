"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { createProject } from "@/lib/red/queries";
import { slugify } from "@/lib/red/slugify";
import type { ProjectCardData } from "@/lib/red/types";

interface NewProjectDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onCreated: (project: ProjectCardData) => void;
}

export default function NewProjectDialog({ open, onClose, userId, onCreated }: NewProjectDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
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
      setName("");
      setSlug("");
      setDescription("");
      setRepoUrl("");
      setDemoUrl("");
      setError(null);
      setTouchedSlug(false);
    }
  }, [open]);

  // Auto-derive slug from name until the user touches the slug field manually.
  useEffect(() => {
    if (touchedSlug) return;
    setSlug(slugify(name));
  }, [name, touchedSlug]);

  if (!mounted || !open) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    const fresh = await createProject({
      slug,
      name,
      description: description || null,
      repo_url: repoUrl || null,
      demo_url: demoUrl || null,
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
      <div className="red-dialog-panel" role="dialog" aria-modal="true" aria-label="Nuevo proyecto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.08em] uppercase text-muted-foreground mb-1">red · proyecto</p>
            <h3 className="font-semibold tracking-[-0.04em] text-foreground text-2xl leading-tight">Crear un proyecto</h3>
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
          <Field label="Nombre">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Puerto CMS"
              className="red-input"
              autoFocus
            />
          </Field>

          <Field label="Slug" hint="se usa en /red?p=…">
            <input
              value={slug}
              onChange={(e) => {
                setTouchedSlug(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="puerto-cms"
              className="red-input"
            />
          </Field>

          <Field label="Descripción (opcional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Headless CMS minimalista para sitios de comunidad."
              rows={3}
              className="red-input resize-none"
            />
          </Field>

          <Field label="Repo (opcional)">
            <input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/…"
              className="red-input"
            />
          </Field>

          <Field label="Demo (opcional)">
            <input
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://…"
              className="red-input"
            />
          </Field>

          {error && (
            <p className="text-[#ff8aa8] text-[0.78rem] font-light">{error}</p>
          )}
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
            disabled={!name.trim() || !slug.trim() || submitting || !userId}
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

