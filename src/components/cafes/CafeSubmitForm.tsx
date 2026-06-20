"use client";

// Alta de café/coworking por la comunidad. Inserta en `cafes` con
// source='community' y added_by=usuario (lo exige la RLS). Requiere login.

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type State = "loading" | "anon" | "ready" | "saving" | "done" | "error";

export default function CafeSubmitForm() {
  const [state, setState] = useState<State>("loading");
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"cafe" | "cowork">("cafe");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setState(user ? "ready" : "anon");
    });
    return () => { cancelled = true; };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setState("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setState("anon");
      return;
    }
    const { error } = await supabase.from("cafes").insert({
      name: name.trim(),
      kind,
      neighborhood: neighborhood.trim() || null,
      address: address.trim() || null,
      description: description.trim() || null,
      source: "community",
      added_by: user.id,
    });
    if (error) {
      setState("error");
      return;
    }
    setState("done");
    setName("");
    setNeighborhood("");
    setAddress("");
    setDescription("");
    router.refresh();
  };

  if (state === "loading") return <p className="shell-card__meta">Cargando…</p>;

  if (state === "anon") {
    const next = encodeURIComponent(pathname);
    return (
      <div className="shell-card" style={{ textAlign: "center" }}>
        <h3 className="shell-card__title">¿Conocés un lugar que falta?</h3>
        <p className="shell-card__desc">Ingresá para sumar tu café o coworking favorito al mapa.</p>
        <a className="shell-btn-primary" href={`/auth/login?next=${next}`} style={{ marginTop: "0.4rem" }}>
          Ingresar para sumar
        </a>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="shell-card" style={{ textAlign: "center" }}>
        <h3 className="shell-card__title">¡Gracias! 🦭</h3>
        <p className="shell-card__desc">Tu lugar ya forma parte del mapa de la comunidad.</p>
      </div>
    );
  }

  return (
    <form className="shell-card" onSubmit={submit} style={{ gap: "0.8rem" }}>
      <label className="shell-card__desc" htmlFor="cf-name">Nombre del lugar *</label>
      <input id="cf-name" className="bolsa-x-pill" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} placeholder="Ej.: Mi café favorito" />

      <label className="shell-card__desc" htmlFor="cf-kind">Tipo</label>
      <select id="cf-kind" className="bolsa-x-pill" value={kind} onChange={(e) => setKind(e.target.value as "cafe" | "cowork")}>
        <option value="cafe">Café</option>
        <option value="cowork">Coworking</option>
      </select>

      <label className="shell-card__desc" htmlFor="cf-zona">Barrio / zona</label>
      <input id="cf-zona" className="bolsa-x-pill" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} maxLength={80} placeholder="Ej.: Güemes" />

      <label className="shell-card__desc" htmlFor="cf-address">Dirección</label>
      <input id="cf-address" className="bolsa-x-pill" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={200} placeholder="Ej.: San Martín 2900" />

      <label className="shell-card__desc" htmlFor="cf-desc">¿Por qué está bueno para trabajar?</label>
      <textarea id="cf-desc" className="bolsa-x-pill" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} style={{ resize: "vertical", fontFamily: "inherit" }} />

      <button type="submit" className="shell-btn-primary" disabled={state === "saving"}>
        {state === "saving" ? "Sumando…" : "Sumar lugar"}
      </button>
      {state === "error" && (
        <p className="shell-card__meta" style={{ color: "var(--shell-rose)" }}>No se pudo sumar. Probá de nuevo.</p>
      )}
    </form>
  );
}
