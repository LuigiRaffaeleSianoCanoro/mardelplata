"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeExternalUrl } from "@/lib/urls";
import { isUniqueViolation, MARKETPLACE_SECTOR_TAGS, PEDIDO_KIND_LABELS } from "@/lib/marketplace";
import type { PedidoKind, PedidoPreferredContact } from "@/lib/types/marketplace";
import {
  PEDIDO_DESCRIPTION_MAX,
  PEDIDO_DESCRIPTION_MIN,
  PEDIDO_TITLE_MAX,
} from "@/lib/types/marketplace";

const KINDS = Object.keys(PEDIDO_KIND_LABELS) as PedidoKind[];

export default function PedidoApplyForm() {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<PedidoKind>("necesito_producto");
  const [description, setDescription] = useState("");
  const [publisherDisplay, setPublisherDisplay] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [organization, setOrganization] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [preferredContact, setPreferredContact] = useState<PedidoPreferredContact>("email_via_platform");
  const [contactEmail, setContactEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : current.length >= 8 ? current : [...current, tag],
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim()) {
      setState("done");
      return;
    }
    const display = anonymous ? "Ángel anónimo vía MdPDev" : publisherDisplay.trim();
    if (!title.trim() || description.trim().length < PEDIDO_DESCRIPTION_MIN || !display || !contactEmail.trim()) {
      setError("Completá título, una descripción concreta (mín. 20 caracteres), quién publica y el email.");
      setState("error");
      return;
    }
    setState("saving");
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("marketplace_pedidos").insert({
      title: title.trim(),
      kind,
      description: description.trim(),
      publisher_display: display,
      organization: organization.trim() || null,
      tags,
      budget: budget.trim() || null,
      deadline: deadline.trim() || null,
      preferred_contact: preferredContact,
      contact_email: contactEmail.trim(),
      linkedin_url: linkedinUrl.trim() ? normalizeExternalUrl(linkedinUrl) : null,
    });
    if (insertError) {
      setState("error");
      setError(
        isUniqueViolation(insertError.message)
          ? "Ya recibimos un pedido con este email hoy. Mañana podés mandar otro."
          : "No se pudo enviar. Revisá los campos e intentá de nuevo.",
      );
      return;
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="shell-card" style={{ textAlign: "center" }}>
        <h2 className="shell-card__title">Pedido en revisión</h2>
        <p className="shell-card__desc">
          No se publica hasta que un admin lo apruebe. El email real queda solo para
          MdPDev, para pasarte los “me interesa” sin exponerlo en la web.
        </p>
      </div>
    );
  }

  return (
    <form className="marketplace-form" onSubmit={submit}>
      <p className="shell-card__meta">
        Estilo pedido concreto: problema, por qué ahora, qué se vería como éxito. Sin
        obligación de que venga de un fondo famoso.
      </p>

      <label className="marketplace-field" htmlFor="pd-title">
        Título *
        <input
          id="pd-title"
          className="bolsa-x-pill"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={PEDIDO_TITLE_MAX}
          placeholder="Buscamos startup de logística fría en MdP"
        />
      </label>

      <label className="marketplace-field" htmlFor="pd-kind">
        Tipo *
        <select
          id="pd-kind"
          className="bolsa-x-pill"
          value={kind}
          onChange={(e) => setKind(e.target.value as PedidoKind)}
        >
          {KINDS.map((k) => (
            <option key={k} value={k}>
              {PEDIDO_KIND_LABELS[k]}
            </option>
          ))}
        </select>
      </label>

      <label className="marketplace-field" htmlFor="pd-desc">
        Descripción * <span>{description.length}/{PEDIDO_DESCRIPTION_MAX}</span>
        <textarea
          id="pd-desc"
          className="bolsa-x-pill"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          minLength={PEDIDO_DESCRIPTION_MIN}
          maxLength={PEDIDO_DESCRIPTION_MAX}
          rows={7}
          placeholder="El problema, el contexto, por qué Mar del Plata, cómo se vería el éxito."
        />
      </label>

      <label className="marketplace-field" htmlFor="pd-who">
        Quién publica *
        <input
          id="pd-who"
          className="bolsa-x-pill"
          value={anonymous ? "Ángel anónimo vía MdPDev" : publisherDisplay}
          onChange={(e) => setPublisherDisplay(e.target.value)}
          required={!anonymous}
          disabled={anonymous}
          maxLength={80}
          placeholder="Tu nombre, o el de la organización"
        />
      </label>
      <label className="marketplace-check">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
        />
        Publicar como “Ángel anónimo vía MdPDev”
      </label>

      <label className="marketplace-field" htmlFor="pd-org">
        Organización (opcional)
        <input
          id="pd-org"
          className="bolsa-x-pill"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          maxLength={80}
        />
      </label>

      <fieldset className="marketplace-field">
        <legend>Sector / tags</legend>
        <div className="bolsa-x-filter">
          {MARKETPLACE_SECTOR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`bolsa-x-pill ${tags.includes(tag) ? "is-active" : ""}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="marketplace-field" htmlFor="pd-budget">
        Presupuesto / ticket
        <input
          id="pd-budget"
          className="bolsa-x-pill"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          maxLength={80}
          placeholder="hasta USD X, equity, pilot pago"
        />
      </label>

      <label className="marketplace-field" htmlFor="pd-deadline">
        Plazo
        <input
          id="pd-deadline"
          className="bolsa-x-pill"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          maxLength={80}
        />
      </label>

      <label className="marketplace-field" htmlFor="pd-pref">
        Contacto preferido
        <select
          id="pd-pref"
          className="bolsa-x-pill"
          value={preferredContact}
          onChange={(e) => setPreferredContact(e.target.value as PedidoPreferredContact)}
        >
          <option value="email_via_platform">Email vía la plataforma</option>
          <option value="form_reply">Respuesta al formulario</option>
        </select>
      </label>

      <label className="marketplace-field" htmlFor="pd-email">
        Email real * (solo admin)
        <input
          id="pd-email"
          className="bolsa-x-pill"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
      </label>

      <label className="marketplace-field" htmlFor="pd-li">
        LinkedIn (verificación, privado)
        <input
          id="pd-li"
          className="bolsa-x-pill"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          placeholder="https://linkedin.com/in/…"
        />
      </label>

      <div className="marketplace-honeypot" aria-hidden="true">
        <label htmlFor="pd-fax">Fax</label>
        <input id="pd-fax" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <button type="submit" className="shell-btn-primary" disabled={state === "saving"}>
        {state === "saving" ? "Enviando…" : "Enviar a revisión"}
      </button>
      {state === "error" && (
        <p className="shell-card__meta" style={{ color: "var(--shell-rose)" }}>
          {error}
        </p>
      )}
    </form>
  );
}
