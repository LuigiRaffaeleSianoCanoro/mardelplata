"use client";

// Voto de la comunidad sobre un café/coworking (cafe_votes). Requiere login.
// Permite confirmar amenities (WiFi/enchufes/asientos/silencio) y recomendar o no.
// Upsert por (cafe_id, user_id). Tras votar, refresca para actualizar las señales.

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface CafeVoteProps {
  cafeId: string;
}

type State = "loading" | "anon" | "ready" | "saving" | "done" | "error";

export default function CafeVote({ cafeId }: CafeVoteProps) {
  const [state, setState] = useState<State>("loading");
  const [recommend, setRecommend] = useState(true);
  const [wifi, setWifi] = useState(false);
  const [power, setPower] = useState(false);
  const [seating, setSeating] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setState("anon");
        return;
      }
      const { data } = await supabase
        .from("cafe_votes")
        .select("vote, has_wifi, has_power, good_seating, is_quiet")
        .eq("cafe_id", cafeId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setRecommend(data.vote >= 0);
        setWifi(Boolean(data.has_wifi));
        setPower(Boolean(data.has_power));
        setSeating(Boolean(data.good_seating));
        setQuiet(Boolean(data.is_quiet));
      }
      setState("ready");
    })();
    return () => { cancelled = true; };
  }, [cafeId]);

  const submit = async () => {
    setState("saving");
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setState("anon");
      return;
    }
    const { error } = await supabase.from("cafe_votes").upsert(
      {
        cafe_id: cafeId,
        user_id: user.id,
        vote: recommend ? 1 : -1,
        has_wifi: wifi,
        has_power: power,
        good_seating: seating,
        is_quiet: quiet,
      },
      { onConflict: "cafe_id,user_id" },
    );
    if (error) {
      setState("error");
      return;
    }
    setState("done");
    router.refresh();
  };

  if (state === "loading") {
    return <p className="shell-card__meta">Cargando…</p>;
  }

  if (state === "anon") {
    const next = encodeURIComponent(pathname);
    return (
      <div className="shell-card">
        <h3 className="shell-card__title">¿Trabajaste acá?</h3>
        <p className="shell-card__desc">Ingresá para confirmar el WiFi, los enchufes y sumar tu voto.</p>
        <a className="shell-btn-primary" href={`/auth/login?next=${next}`} style={{ marginTop: "0.4rem" }}>
          Ingresar para votar
        </a>
      </div>
    );
  }

  const Toggle = ({ label, value, set }: { label: string; value: boolean; set: (v: boolean) => void }) => (
    <button
      type="button"
      className={`bolsa-x-pill ${value ? "is-active" : ""}`}
      aria-pressed={value}
      onClick={() => set(!value)}
    >
      {label}
    </button>
  );

  return (
    <div className="shell-card">
      <h3 className="shell-card__title">Tu experiencia trabajando acá</h3>
      <p className="shell-card__desc">Marcá lo que confirmás:</p>
      <div className="bolsa-x-filter" style={{ marginTop: "0.4rem" }}>
        <Toggle label="WiFi" value={wifi} set={setWifi} />
        <Toggle label="Enchufes" value={power} set={setPower} />
        <Toggle label="Buenos asientos" value={seating} set={setSeating} />
        <Toggle label="Tranquilo" value={quiet} set={setQuiet} />
      </div>
      <div className="bolsa-x-filter" style={{ marginTop: "0.6rem" }}>
        <Toggle label="👍 Lo recomiendo" value={recommend} set={() => setRecommend(true)} />
        <Toggle label="👎 No tanto" value={!recommend} set={() => setRecommend(false)} />
      </div>
      <button
        type="button"
        className="shell-btn-primary"
        style={{ marginTop: "0.8rem" }}
        onClick={submit}
        disabled={state === "saving"}
      >
        {state === "saving" ? "Guardando…" : state === "done" ? "¡Guardado! 🦭" : "Guardar mi voto"}
      </button>
      {state === "error" && (
        <p className="shell-card__meta" style={{ color: "var(--shell-rose)" }}>
          No se pudo guardar. Probá de nuevo.
        </p>
      )}
    </div>
  );
}
