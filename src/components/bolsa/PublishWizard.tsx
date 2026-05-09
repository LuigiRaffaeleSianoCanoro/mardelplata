"use client";

import { useCallback, useState } from "react";
import type { ClassifiedKind, JobPosition } from "@/lib/types/classifieds";
import {
  CLASSIFIED_DESC_MAX,
  CLASSIFIED_TITLE_MAX,
} from "@/lib/types/classifieds";

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
    const t = title.trim();
    const d = description.trim();
    if (!t) {
      setError("El título es obligatorio.");
      return;
    }
    if (t.length > CLASSIFIED_TITLE_MAX) {
      setError(`El título no puede superar ${CLASSIFIED_TITLE_MAX} caracteres.`);
      return;
    }
    if (!d) {
      setError("La descripción es obligatoria.");
      return;
    }
    if (d.length > CLASSIFIED_DESC_MAX) {
      setError(`La descripción no puede superar ${CLASSIFIED_DESC_MAX} caracteres.`);
      return;
    }

    let posPayload: JobPosition[] = [];
    if (kind === "job") {
      posPayload = positions
        .map((p) => ({
          title: p.title.trim(),
          description: p.description.trim(),
          link: p.link.trim(),
        }))
        .filter((p) => p.title || p.description || p.link);
      if (posPayload.length === 0) {
        setError("Agregá al menos una posición con datos.");
        return;
      }
    }

    setSaving(true);
    try {
      await onSubmit({
        kind,
        title: t,
        description: d,
        external_url: externalUrl.trim() || null,
        positions: posPayload,
        tags,
      });
      close();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo publicar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="classified-modal-portal">
      <button
        type="button"
        className="classified-modal-backdrop"
        aria-label="Cerrar"
        onClick={close}
      />
      <div
        className="classified-modal-dialog"
        role="dialog"
        aria-modal="true"
      >
        <div className="wizard-head">
          <h2 className="wizard-title">Publicar aviso</h2>
          <button
            type="button"
            onClick={close}
            className="classified-modal-close"
          >
            ×
          </button>
        </div>

        {step === 0 && (
          <div className="wizard-step">
            <p className="wizard-question">¿Qué querés publicar?</p>
            <button
              type="button"
              onClick={() => {
                setKind("job");
                setStep(1);
              }}
              className="wizard-choice"
            >
              Estoy ofreciendo un puesto de trabajo
            </button>
            <button
              type="button"
              onClick={() => {
                setKind("freelance");
                setStep(1);
              }}
              className="wizard-choice"
            >
              Estoy ofreciendo servicios freelance
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="wizard-step">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="wizard-back-link"
            >
              ← Volver
            </button>

            <div>
              <label className="wizard-label">Título</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={CLASSIFIED_TITLE_MAX}
                className="wizard-input"
                placeholder="Breve y claro"
              />
              <p className="wizard-hint">
                {title.length}/{CLASSIFIED_TITLE_MAX}
              </p>
            </div>

            <div>
              <label className="wizard-label">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={CLASSIFIED_DESC_MAX}
                rows={5}
                className="wizard-input wizard-textarea"
                placeholder="Requisitos, modalidad, stack…"
              />
              <p className="wizard-hint">
                {description.length}/{CLASSIFIED_DESC_MAX}
              </p>
            </div>

            <div>
              <label className="wizard-label">
                Link externo (opcional)
              </label>
              <input
                type="url"
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                className="wizard-input"
                placeholder="https://…"
              />
            </div>

            {kind === "job" && (
              <div className="wizard-step">
                <p className="wizard-positions-label">
                  Posiciones (podés agregar varias)
                </p>
                {positions.map((pos, idx) => (
                  <div key={idx} className="wizard-position">
                    <div className="wizard-position-head">
                      <span className="wizard-position-label">Puesto {idx + 1}</span>
                      {positions.length > 1 && (
                        <button
                          type="button"
                          className="wizard-position-remove"
                          onClick={() => setPositions((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                    <input
                      className="wizard-input wizard-input--sm"
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
                      className="wizard-input wizard-input--sm wizard-textarea"
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
                      className="wizard-input wizard-input--sm"
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
                  className="wizard-add-position"
                >
                  + Agregar otra posición
                </button>
              </div>
            )}

            <div>
              <label className="wizard-label">
                Tags tech (opcional, separados por coma)
              </label>
              <input
                type="text"
                value={tagsRaw}
                onChange={(e) => setTagsRaw(e.target.value)}
                className="wizard-input"
                placeholder="React, Node, remoto…"
              />
            </div>

            {error && <p className="wizard-error">{error}</p>}

            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSubmit()}
              className="shell-btn-primary wizard-submit"
            >
              {saving ? "Publicando…" : "Publicar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
