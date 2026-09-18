"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { MarketplaceLeadKind } from "@/lib/types/marketplace";
import { LEAD_MESSAGE_MAX, LEAD_MESSAGE_MIN } from "@/lib/types/marketplace";

type Props =
  | { variant: "startup"; startupId: string; hasDeck: boolean }
  | { variant: "pedido"; pedidoId: string };

export default function LeadForm(props: Props) {
  const [kind, setKind] = useState<MarketplaceLeadKind>(
    props.variant === "pedido" ? "pedido_interest" : "startup_contact",
  );
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim()) {
      setState("done");
      return;
    }
    if (message.trim().length < LEAD_MESSAGE_MIN) {
      setError(`Contanos un poco más (mínimo ${LEAD_MESSAGE_MIN} caracteres).`);
      setState("error");
      return;
    }
    setState("saving");
    setError("");
    const supabase = createClient();
    const payload =
      props.variant === "startup"
        ? {
            kind,
            startup_id: props.startupId,
            from_name: fromName.trim(),
            from_email: fromEmail.trim(),
            message: message.trim(),
          }
        : {
            kind: "pedido_interest" as const,
            pedido_id: props.pedidoId,
            from_name: fromName.trim(),
            from_email: fromEmail.trim(),
            message: message.trim(),
          };
    const { error: insertError } = await supabase.from("marketplace_leads").insert(payload);
    if (insertError) {
      setState("error");
      setError("No se pudo enviar. Probá de nuevo en un rato.");
      return;
    }
    setState("done");
  };

  if (state === "done") {
    return (
      <div className="shell-card">
        <h2 className="shell-card__title">Mensaje enviado</h2>
        <p className="shell-card__desc">
          Quedó registrado para el equipo de MdPDev. Ellos lo pasan a la otra parte
          sin publicar tu email en la ficha.
        </p>
      </div>
    );
  }

  return (
    <form className="marketplace-form shell-card" onSubmit={submit}>
      <h2 className="shell-card__title">
        {props.variant === "startup" ? "Contactar" : "Me interesa"}
      </h2>
      <p className="shell-card__desc">
        No mostramos mails en la web. Un admin reenvía el lead a quien corresponde.
      </p>

      {props.variant === "startup" && (
        <div className="bolsa-x-filter" role="group" aria-label="Tipo de contacto">
          <button
            type="button"
            className={`bolsa-x-pill ${kind === "startup_contact" ? "is-active" : ""}`}
            onClick={() => setKind("startup_contact")}
          >
            Contactar
          </button>
          {props.hasDeck && (
            <button
              type="button"
              className={`bolsa-x-pill ${kind === "startup_deck" ? "is-active" : ""}`}
              onClick={() => setKind("startup_deck")}
            >
              Pedir deck
            </button>
          )}
        </div>
      )}

      <label className="marketplace-field" htmlFor="ld-name">
        Nombre *
        <input
          id="ld-name"
          className="bolsa-x-pill"
          value={fromName}
          onChange={(e) => setFromName(e.target.value)}
          required
          maxLength={80}
        />
      </label>
      <label className="marketplace-field" htmlFor="ld-email">
        Email *
        <input
          id="ld-email"
          className="bolsa-x-pill"
          type="email"
          value={fromEmail}
          onChange={(e) => setFromEmail(e.target.value)}
          required
        />
      </label>
      <label className="marketplace-field" htmlFor="ld-msg">
        Mensaje *
        <textarea
          id="ld-msg"
          className="bolsa-x-pill"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={LEAD_MESSAGE_MIN}
          maxLength={LEAD_MESSAGE_MAX}
          rows={4}
          placeholder={
            kind === "startup_deck"
              ? "Por qué te interesa el deck y en qué rol estás."
              : "Quién sos y qué estás buscando."
          }
        />
      </label>

      <div className="marketplace-honeypot" aria-hidden="true">
        <label htmlFor="ld-fax">Fax</label>
        <input id="ld-fax" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <button type="submit" className="shell-btn-primary" disabled={state === "saving"}>
        {state === "saving" ? "Enviando…" : "Enviar"}
      </button>
      {state === "error" && (
        <p className="shell-card__meta" style={{ color: "var(--shell-rose)" }}>
          {error}
        </p>
      )}
    </form>
  );
}
