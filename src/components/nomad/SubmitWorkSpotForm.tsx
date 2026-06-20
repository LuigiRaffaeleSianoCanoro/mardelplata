"use client";

// Form de sugerencia de café/coworking. POST a /api/work-spots (mismo patrón
// que el newsletter). Las sugerencias van a moderación, no se publican solas.

import { useState } from "react";

type SubmitState = "idle" | "loading" | "ok" | "error";

export default function SubmitWorkSpotForm() {
  const [name, setName] = useState("");
  const [kind, setKind] = useState("cafe");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitter, setSubmitter] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/work-spots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, kind, address, notes, submitter }),
      });
      if (res.ok) {
        setState("ok");
        setName("");
        setAddress("");
        setNotes("");
        setSubmitter("");
        setKind("cafe");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
    window.setTimeout(() => setState("idle"), 4000);
  };

  if (state === "ok") {
    return (
      <div className="shell-card" style={{ textAlign: "center" }}>
        <h3 className="shell-card__title">¡Gracias! 🦭</h3>
        <p className="shell-card__desc">
          Recibimos tu sugerencia. La revisamos y, si suma, la agregamos al mapa.
        </p>
      </div>
    );
  }

  return (
    <form className="shell-card" onSubmit={handleSubmit} style={{ gap: "0.8rem" }}>
      <label className="shell-card__desc" htmlFor="ws-name">
        Nombre del lugar *
      </label>
      <input
        id="ws-name"
        className="bolsa-x-pill"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ej.: Mi café favorito"
        required
        maxLength={120}
      />

      <label className="shell-card__desc" htmlFor="ws-kind">
        Tipo
      </label>
      <select
        id="ws-kind"
        className="bolsa-x-pill"
        value={kind}
        onChange={(e) => setKind(e.target.value)}
      >
        <option value="cafe">Café</option>
        <option value="coworking">Coworking</option>
        <option value="biblioteca">Biblioteca</option>
        <option value="hotel">Hotel / lobby</option>
        <option value="otro">Otro</option>
      </select>

      <label className="shell-card__desc" htmlFor="ws-address">
        Dirección o zona
      </label>
      <input
        id="ws-address"
        className="bolsa-x-pill"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Ej.: San Martín 2900, Centro"
        maxLength={200}
      />

      <label className="shell-card__desc" htmlFor="ws-notes">
        ¿Por qué está bueno para trabajar? (WiFi, enchufes, ruido…)
      </label>
      <textarea
        id="ws-notes"
        className="bolsa-x-pill"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        maxLength={1000}
        style={{ resize: "vertical", fontFamily: "inherit" }}
      />

      <label className="shell-card__desc" htmlFor="ws-submitter">
        Tu contacto (opcional)
      </label>
      <input
        id="ws-submitter"
        className="bolsa-x-pill"
        value={submitter}
        onChange={(e) => setSubmitter(e.target.value)}
        placeholder="Email o @usuario, por si queremos preguntarte algo"
        maxLength={160}
      />

      <button type="submit" className="shell-btn-primary" disabled={state === "loading"}>
        {state === "loading" ? "Enviando…" : "Sugerir lugar"}
      </button>
      {state === "error" && (
        <p className="shell-card__meta" style={{ color: "var(--shell-rose)" }}>
          No pudimos enviar tu sugerencia. Probá de nuevo en un rato.
        </p>
      )}
    </form>
  );
}
