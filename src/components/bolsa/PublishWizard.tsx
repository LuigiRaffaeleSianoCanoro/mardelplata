"use client";

import { useCallback, useState } from "react";
import type { ClassifiedKind, JobPosition } from "@/lib/types/classifieds";
import { CLASSIFIED_DESC_MAX, CLASSIFIED_TITLE_MAX } from "@/lib/types/classifieds";
import { validateClassifiedPublishPayload } from "@/lib/classifieds/validateClassifiedPublishPayload";

type Step = 0 | 1;

const emptyPosition = (): JobPosition => ({
  title: "",
  description: "",
  link: "",
});

type PublishWizardProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    kind: ClassifiedKind;
    title: string;
    description: string;
    external_url: string | null;
    positions: JobPosition[];
    tags: string[];
  }) => Promise<void>;
};

export default function PublishWizard({ open, onClose, onSubmit }: PublishWizardProps) {
  const [step, setStep] = useState<Step>(0);
  const [kind, setKind] = useState<ClassifiedKind>("freelance");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [positions, setPositions] = useState<JobPosition[]>([emptyPosition()]);
  const [tagsRaw, setTagsRaw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const reset = useCallback(() => {
    setStep(0);
    setKind("freelance");
    setTitle("");
    setDescription("");
    setExternalUrl("");
    setPositions([emptyPosition()]);
    setTagsRaw("");
    setError(null);
  }, []);

  const close = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  if (!open) return null;

  const tags = tagsRaw
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);

  const handleSubmit = async () => {
    setError(null);
    const validated = validateClassifiedPublishPayload({
      kind,
      title,
      description,
      external_url: externalUrl.trim() || null,
      positions,
      tags,
    });
    if (!validated.ok) {
      setError(validated.error);
      return;
    }

    setSaving(true);
    try {
      await onSubmit(validated.payload);
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo publicar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-ocean-900/45 backdrop-blur-[1px]"
        aria-label="Cerrar"
        onClick={close}
      />
      <div
        className="bolsa-modal-zoom relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-ocean-300/50 bg-sand-100 shadow-2xl shadow-ocean-900/15 p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-lg font-bold text-slate-900">Publicar aviso</h2>
          <button
            type="button"
            onClick={close}
            className="text-slate-500 hover:text-ocean-800 text-xl leading-none rounded-lg hover:bg-white/60 px-1"
          >
            ×
          </button>
        </div>

        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">¿Qué querés publicar?</p>
            <button
              type="button"
              onClick={() => {
                setKind("job");
                setStep(1);
              }}
              className="bolsa-choice w-full text-left"
            >
              Estoy ofreciendo un puesto de trabajo
            </button>
            <button
              type="button"
              onClick={() => {
                setKind("freelance");
                setStep(1);
              }}
              className="bolsa-choice w-full text-left"
            >
              Estoy ofreciendo servicios freelance
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="text-xs font-medium text-ocean-700 hover:text-ocean-600 hover:underline"
            >
              ← Volver
            </button>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={CLASSIFIED_TITLE_MAX}
                className="bolsa-input w-full"
                placeholder="Breve y claro"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                {title.length}/{CLASSIFIED_TITLE_MAX}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={CLASSIFIED_DESC_MAX}
                rows={5}
                className="bolsa-input w-full resize-y min-h-[100px]"
                placeholder="Requisitos, modalidad, stack…"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                {description.length}/{CLASSIFIED_DESC_MAX}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Link externo (opcional)
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="bolsa-input w-full"
                placeholder="https://…"
              />
            </div>

            {kind === "job" && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-800 border-b border-ocean-200 pb-1">
                  Posiciones (podés agregar varias)
                </p>
                {positions.map((pos, idx) => (
                  <div key={idx} className="border border-ocean-200 rounded-xl p-2 space-y-2 bg-white/60">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase text-ocean-700">Puesto {idx + 1}</span>
                      {positions.length > 1 && (
                        <button
                          type="button"
                          className="text-[10px] text-red-700 hover:text-red-800"
                          onClick={() => setPositions((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                    <input
                      className="bolsa-input w-full text-sm"
                      placeholder="Título del puesto"
                      value={pos.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPositions((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, title: v } : p)),
                        );
                      }}
                    />
                    <textarea
                      className="bolsa-input w-full text-sm resize-y min-h-[60px]"
                      placeholder="Descripción"
                      value={pos.description}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPositions((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, description: v } : p)),
                        );
                      }}
                    />
                    <input
                      className="bolsa-input w-full text-sm"
                      placeholder="Link (opcional)"
                      value={pos.link}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPositions((prev) =>
                          prev.map((p, i) => (i === idx ? { ...p, link: v } : p)),
                        );
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setPositions((p) => [...p, emptyPosition()])}
                  className="bolsa-btn-secondary text-xs w-full"
                >
                  + Agregar otra posición
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags tech (opcional, separados por coma)
              </label>
              <input
                type="text"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                className="bolsa-input w-full"
                placeholder="React, Node, remoto…"
              />
            </div>

            {error && <p className="text-xs text-red-700">{error}</p>}

            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSubmit()}
              className="w-full bolsa-btn-primary py-2.5 disabled:opacity-50"
            >
              {saving ? "Publicando…" : "Publicar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
