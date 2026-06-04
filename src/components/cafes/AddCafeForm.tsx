"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { CAFE_NAME_MAX } from "@/lib/types/cafes";

export default function AddCafeForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [name, setName] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [address, setAddress] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (cancelled) return;
      setUser(u);
      setAuthLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (name.trim().length === 0) {
      setError("El nombre es obligatorio.");
      return;
    }
    const trimmedMaps = mapsUrl.trim();
    if (trimmedMaps && !/^https?:\/\//i.test(trimmedMaps)) {
      setError("El link de Google Maps debe empezar con http:// o https://");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("cafes")
        .insert({
          name: name.trim().slice(0, CAFE_NAME_MAX),
          neighborhood: neighborhood.trim() || null,
          address: address.trim() || null,
          maps_url: trimmedMaps || null,
          source: "community",
          added_by: user.id,
        })
        .select("id")
        .single();
      if (err) {
        setError(err.message);
        return;
      }
      router.push(`/cafes/${data.id}`);
    } catch {
      setError("Error inesperado. Intentá de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="shell-section"><div className="shell-inner shell-inner--narrow" /></div>
    );
  }

  if (!user) {
    return (
      <div className="shell-section">
        <div className="shell-inner shell-inner--narrow cafes-x-gate">
          <p className="shell-eyebrow">CAFÉS · ACCESO REQUERIDO</p>
          <p className="shell-lead">Necesitás iniciar sesión para agregar un café.</p>
          <div className="cafes-x-gate-actions">
            <a href="/auth/login" className="shell-btn-primary">Ingresar →</a>
            <a href="/auth/registro" className="shell-btn-ghost">Crear cuenta</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell-section">
      <div className="shell-inner shell-inner--narrow">
        <Link href="/cafes" className="shell-btn-ghost">← Volver a cafés</Link>
        <h1 className="shell-title" style={{ marginTop: "1rem" }}>Agregar un <em>café.</em></h1>
        <form className="cafes-x-form" onSubmit={submit}>
          <label className="cafes-x-field">
            <span>Nombre *</span>
            <input value={name} maxLength={CAFE_NAME_MAX} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="cafes-x-field">
            <span>Barrio</span>
            <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Centro, Playa Grande…" />
          </label>
          <label className="cafes-x-field">
            <span>Dirección</span>
            <input value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          <label className="cafes-x-field">
            <span>Link de Google Maps</span>
            <input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} placeholder="https://maps.google.com/…" />
          </label>
          {error && <p className="cafes-x-errmsg">{error}</p>}
          <button type="submit" className="shell-btn-primary" disabled={saving}>
            {saving ? "Guardando…" : "Agregar café"}
          </button>
        </form>
      </div>
    </div>
  );
}
