"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeExternalUrl } from "@/lib/urls";
import {
  isUniqueViolation,
  LOOKING_FOR_LABELS,
  MARKETPLACE_SECTOR_TAGS,
  STARTUP_STAGE_LABELS,
} from "@/lib/marketplace";
import type { StartupLookingFor, StartupStage } from "@/lib/types/marketplace";
import {
  STARTUP_DESCRIPTION_MAX,
  STARTUP_NAME_MAX,
  STARTUP_ONE_LINER_MAX,
} from "@/lib/types/marketplace";

type FounderDraft = { name: string; role: string; linkedin: string; x: string };

const STAGES = Object.keys(STARTUP_STAGE_LABELS) as StartupStage[];
const LOOKING = Object.keys(LOOKING_FOR_LABELS) as StartupLookingFor[];

function optionalUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  return normalizeExternalUrl(value);
}

export default function StartupApplyForm() {
  const [name, setName] = useState("");
  const [oneLiner, setOneLiner] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<StartupStage>("mvp");
  const [tags, setTags] = useState<string[]>([]);
  const [city, setCity] = useState("Mar del Plata");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [lookingFor, setLookingFor] = useState<StartupLookingFor[]>([]);
  const [ticketRange, setTicketRange] = useState("");
  const [founders, setFounders] = useState<FounderDraft[]>([
    { name: "", role: "", linkedin: "", x: "" },
  ]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [deckUrl, setDeckUrl] = useState("");
  const [extraDocsUrl, setExtraDocsUrl] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const toggleTag = (tag: string) => {
    setTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : current.length >= 8 ? current : [...current, tag],
    );
  };

  const toggleLooking = (item: StartupLookingFor) => {
    setLookingFor((current) =>
      current.includes(item) ? current.filter((t) => t !== item) : [...current, item],
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim()) {
      setState("done");
      return;
    }
    if (!name.trim() || !oneLiner.trim() || !description.trim() || !contactEmail.trim()) return;
    setState("saving");
    setError("");
    const supabase = createClient();
    const { error: insertError } = await supabase.from("marketplace_startups").insert({
      name: name.trim(),
      one_liner: oneLiner.trim(),
      description: description.trim(),
      stage,
      tags,
      city: city.trim() || "Mar del Plata",
      website: optionalUrl(website),
      logo_url: optionalUrl(logoUrl),
      looking_for: lookingFor,
      ticket_range: ticketRange.trim() || null,
      founders: founders
        .filter((f) => f.name.trim())
        .map((f) => ({
          name: f.name.trim(),
          role: f.role.trim() || undefined,
          linkedin: optionalUrl(f.linkedin) ?? undefined,
          x: f.x.trim() || undefined,
        })),
      contact_email: contactEmail.trim(),
      contact_phone: contactPhone.trim() || null,
      deck_url: optionalUrl(deckUrl),
      extra_docs_url: optionalUrl(extraDocsUrl),
    });
    if (insertError) {
      setState("error");
      setError(
        isUniqueViolation(insertError.message)
          ? "Ya recibimos una startup con este email hoy. Mañana podés mandar otra, o escribinos si hace falta corregir."
          : "No se pudo enviar. Revisá los campos e intentá de nuevo.",
      );
      return;
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="shell-card" style={{ textAlign: "center" }}>
        <h2 className="shell-card__title">Quedó en cola 🦭</h2>
        <p className="shell-card__desc">
          Luigi o un admin de MdPDev revisan cada ficha antes de publicarla. No va a
          aparecer en el listado hasta que esté aprobada. El email y el deck quedan
          privados.
        </p>
      </div>
    );
  }

  return (
    <form className="marketplace-form" onSubmit={submit}>
      <p className="shell-card__meta">
        Campos con * van a la ficha pública (después del OK de admin). Email, WhatsApp
        y deck no se publican.
      </p>

      <label className="marketplace-field" htmlFor="st-name">
        Nombre *
        <input
          id="st-name"
          className="bolsa-x-pill"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={STARTUP_NAME_MAX}
        />
      </label>

      <label className="marketplace-field" htmlFor="st-liner">
        One-liner * <span>{oneLiner.length}/{STARTUP_ONE_LINER_MAX}</span>
        <input
          id="st-liner"
          className="bolsa-x-pill"
          value={oneLiner}
          onChange={(e) => setOneLiner(e.target.value)}
          required
          maxLength={STARTUP_ONE_LINER_MAX}
          placeholder="Qué hacen, en una frase"
        />
      </label>

      <label className="marketplace-field" htmlFor="st-desc">
        Descripción corta * <span>{description.length}/{STARTUP_DESCRIPTION_MAX}</span>
        <textarea
          id="st-desc"
          className="bolsa-x-pill"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength={STARTUP_DESCRIPTION_MAX}
          rows={5}
        />
      </label>

      <label className="marketplace-field" htmlFor="st-stage">
        Etapa *
        <select
          id="st-stage"
          className="bolsa-x-pill"
          value={stage}
          onChange={(e) => setStage(e.target.value as StartupStage)}
        >
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STARTUP_STAGE_LABELS[s]}
            </option>
          ))}
        </select>
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

      <label className="marketplace-field" htmlFor="st-city">
        Ciudad / ancla
        <input
          id="st-city"
          className="bolsa-x-pill"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          maxLength={80}
        />
      </label>

      <label className="marketplace-field" htmlFor="st-web">
        Website
        <input
          id="st-web"
          className="bolsa-x-pill"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          inputMode="url"
          placeholder="https://"
        />
      </label>

      <label className="marketplace-field" htmlFor="st-logo">
        Logo (URL)
        <input
          id="st-logo"
          className="bolsa-x-pill"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          inputMode="url"
          placeholder="https://… (opcional)"
        />
      </label>

      <fieldset className="marketplace-field">
        <legend>Fundadores (público: nombre y rol, sin emails)</legend>
        {founders.map((founder, index) => (
          <div key={index} className="marketplace-founder-row">
            <input
              className="bolsa-x-pill"
              value={founder.name}
              onChange={(e) =>
                setFounders((rows) => rows.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)))
              }
              placeholder="Nombre"
              maxLength={80}
              aria-label={`Fundador ${index + 1} nombre`}
            />
            <input
              className="bolsa-x-pill"
              value={founder.role}
              onChange={(e) =>
                setFounders((rows) => rows.map((row, i) => (i === index ? { ...row, role: e.target.value } : row)))
              }
              placeholder="Rol"
              maxLength={80}
              aria-label={`Fundador ${index + 1} rol`}
            />
            <input
              className="bolsa-x-pill"
              value={founder.linkedin}
              onChange={(e) =>
                setFounders((rows) =>
                  rows.map((row, i) => (i === index ? { ...row, linkedin: e.target.value } : row)),
                )
              }
              placeholder="LinkedIn"
              aria-label={`Fundador ${index + 1} LinkedIn`}
            />
            <input
              className="bolsa-x-pill"
              value={founder.x}
              onChange={(e) =>
                setFounders((rows) => rows.map((row, i) => (i === index ? { ...row, x: e.target.value } : row)))
              }
              placeholder="X / Twitter"
              aria-label={`Fundador ${index + 1} X`}
            />
          </div>
        ))}
        {founders.length < 8 && (
          <button
            type="button"
            className="bolsa-x-pill"
            onClick={() => setFounders((rows) => [...rows, { name: "", role: "", linkedin: "", x: "" }])}
          >
            Sumar fundador
          </button>
        )}
      </fieldset>

      <fieldset className="marketplace-field">
        <legend>Están buscando</legend>
        <div className="bolsa-x-filter">
          {LOOKING.map((item) => (
            <button
              key={item}
              type="button"
              className={`bolsa-x-pill ${lookingFor.includes(item) ? "is-active" : ""}`}
              onClick={() => toggleLooking(item)}
            >
              {LOOKING_FOR_LABELS[item]}
            </button>
          ))}
        </div>
      </fieldset>

      {lookingFor.includes("capital") && (
        <label className="marketplace-field" htmlFor="st-ticket">
          Ticket / rango (si capital)
          <input
            id="st-ticket"
            className="bolsa-x-pill"
            value={ticketRange}
            onChange={(e) => setTicketRange(e.target.value)}
            maxLength={80}
            placeholder="pre-seed, USD 20–50k, a conversar"
          />
        </label>
      )}

      <label className="marketplace-field" htmlFor="st-email">
        Email de contacto * (privado)
        <input
          id="st-email"
          className="bolsa-x-pill"
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          required
        />
      </label>

      <label className="marketplace-field" htmlFor="st-phone">
        Tel / WhatsApp (privado)
        <input
          id="st-phone"
          className="bolsa-x-pill"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          maxLength={40}
        />
      </label>

      <label className="marketplace-field" htmlFor="st-deck">
        Pitch deck (link Drive/PDF, privado)
        <input
          id="st-deck"
          className="bolsa-x-pill"
          value={deckUrl}
          onChange={(e) => setDeckUrl(e.target.value)}
          placeholder="https://drive.google.com/…"
        />
      </label>

      <label className="marketplace-field" htmlFor="st-docs">
        One-pager / docs extra (privado)
        <input
          id="st-docs"
          className="bolsa-x-pill"
          value={extraDocsUrl}
          onChange={(e) => setExtraDocsUrl(e.target.value)}
        />
      </label>

      <div className="marketplace-honeypot" aria-hidden="true">
        <label htmlFor="st-fax">Fax</label>
        <input id="st-fax" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
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
