"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus } from "lucide-react";
import { createModule } from "@/lib/red/queries";
import { slugify } from "@/lib/red/slugify";
import type { ModuleCardData, ModuleKind } from "@/lib/red/types";

interface NewModuleDialogProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onCreated: (mod: ModuleCardData) => void;
}

const KINDS: { id: ModuleKind; label: string }[] = [
  { id: "component", label: "componente" },
  { id: "hook", label: "hook" },
  { id: "helper", label: "helper" },
  { id: "integration", label: "integración" },
  { id: "pattern", label: "pattern" },
  { id: "snippet", label: "snippet" },
];

export default function NewModuleDialog({ open, onClose, userId, onCreated }: NewModuleDialogProps) {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<ModuleKind>("component");
  const [version, setVersion] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [license, setLicense] = useState("MIT");
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
      setKind("component");
      setVersion("");
      setSourceUrl("");
      setLicense("MIT");
      setError(null);
      setTouchedSlug(false);
    }
  }, [open]);

  useEffect(() => {
    if (touchedSlug) return;
    setSlug(slugify(name));
  }, [name, touchedSlug]);

  if (!mounted || !open) return null;

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim() || submitting) return;
    setError(null);
    setSubmitting(true);
    const fresh = await createModule({
      slug,
      name,
      description: description || null,
      kind,
      version: version || null,
      sourceUrl: sourceUrl || null,
      license: license || null,
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
      <div className="red-dialog-panel" role="dialog" aria-modal="true" aria-label="Nuevo módulo">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="kicker text-white/45 mb-1">red · módulo</p>
            <h3 className="display-thin text-white text-2xl leading-tight">Publicar un módulo</h3>
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
          <Field label="Nombre">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Low-poly waves SVG"
              className="red-input"
              autoFocus
            />
          </Field>

          <Field label="Slug" hint="se usa en /red/modulos?m=…">
            <input
              value={slug}
              onChange={(e) => {
                setTouchedSlug(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="low-poly-waves"
              className="red-input"
            />
          </Field>

          <div>
            <label className="kicker text-white/45 block mb-2">Tipo</label>
            <div className="flex items-center gap-1.5 flex-wrap">
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

          <Field label="Descripción (opcional)">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Para qué sirve y cómo se usa."
              rows={3}
              className="red-input resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Versión">
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="red-input font-mono"
              />
            </Field>
            <Field label="Licencia">
              <input
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="MIT"
                className="red-input"
              />
            </Field>
          </div>

          <Field label="Source URL (opcional)">
            <input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://github.com/…"
              className="red-input"
            />
          </Field>

          {error && <p className="text-[#ff8aa8] text-[0.78rem] font-light">{error}</p>}
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
            disabled={!name.trim() || !slug.trim() || submitting || !userId}
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

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="kicker text-white/45">{label}</label>
        {hint && <span className="text-white/35 text-[0.7rem] font-light">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
