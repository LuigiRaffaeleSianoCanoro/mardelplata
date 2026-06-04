"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { CafeWithScore } from "@/lib/types/cafes";
import Link from "next/link";
import CafeCard from "./CafeCard";

interface Props {
  initialCafes: CafeWithScore[];
}

export default function CafesClient({ initialCafes }: Props) {
  const [cafes, setCafes] = useState<CafeWithScore[]>(initialCafes);
  const [user, setUser] = useState<User | null>(null);
  const [myVotes, setMyVotes] = useState<Map<string, 1 | -1>>(new Map());
  const [hood, setHood] = useState<string>("all");
  const [onlyWifi, setOnlyWifi] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const supabase = useMemo(() => createClient(), []);
  const quickVoteInFlight = useRef(false);

  const reloadScores = useCallback(async () => {
    const { data } = await supabase.from("cafe_scores").select("*");
    if (!data) return;
    const map = new Map<string, CafeWithScore["score"]>();
    for (const s of data) {
      const { cafe_id, ...rest } = s as { cafe_id: string } & CafeWithScore["score"];
      map.set(cafe_id, rest);
    }
    setCafes((prev) =>
      prev
        .map((c) => ({ ...c, score: map.get(c.id) ?? c.score }))
        .sort(
          (a, b) =>
            b.score.net_votes - a.score.net_votes ||
            b.score.votes_count - a.score.votes_count,
        ),
    );
  }, [supabase]);

  const loadMyVotes = useCallback(
    async (uid: string) => {
      const { data } = await supabase
        .from("cafe_votes")
        .select("cafe_id, vote")
        .eq("user_id", uid);
      const map = new Map<string, 1 | -1>();
      for (const r of (data ?? []) as { cafe_id: string; vote: 1 | -1 }[]) {
        map.set(r.cafe_id, r.vote);
      }
      setMyVotes(map);
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (cancelled) return;
      setUser(u);
      if (u) void loadMyVotes(u.id);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) void loadMyVotes(u.id);
      else setMyVotes(new Map());
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase.auth, loadMyVotes]);

  const handleQuickVote = useCallback(
    async (cafeId: string, dir: 1 | -1) => {
      if (!user) return;
      if (quickVoteInFlight.current) return;
      quickVoteInFlight.current = true;
      try {
        const existing = myVotes.get(cafeId);
        if (existing === dir) {
          const { error } = await supabase
            .from("cafe_votes")
            .delete()
            .eq("cafe_id", cafeId)
            .eq("user_id", user.id);
          if (error) {
            console.error("[cafes] quick-vote delete", error);
            return;
          }
        } else if (existing !== undefined) {
          // Ya votó este café: actualizar solo `vote`, preservando chips/comentario.
          const { error } = await supabase
            .from("cafe_votes")
            .update({ vote: dir })
            .eq("cafe_id", cafeId)
            .eq("user_id", user.id);
          if (error) {
            console.error("[cafes] quick-vote update", error);
            return;
          }
        } else {
          const { error } = await supabase
            .from("cafe_votes")
            .insert({ cafe_id: cafeId, user_id: user.id, vote: dir });
          if (error) {
            console.error("[cafes] quick-vote insert", error);
            return;
          }
        }
        await loadMyVotes(user.id);
        await reloadScores();
      } finally {
        quickVoteInFlight.current = false;
      }
    },
    [user, myVotes, supabase, loadMyVotes, reloadScores],
  );

  const hoods = useMemo(() => {
    const set = new Set<string>();
    for (const c of cafes) if (c.neighborhood) set.add(c.neighborhood);
    return Array.from(set).sort();
  }, [cafes]);

  const filtered = useMemo(() => {
    return cafes.filter((c) => {
      if (hood !== "all" && c.neighborhood !== hood) return false;
      if (onlyWifi && c.score.wifi_count === 0) return false;
      return true;
    });
  }, [cafes, hood, onlyWifi]);

  return (
    <div className="shell-section">
      <div className="shell-inner">
        <header className="cafes-x-header">
          <div>
            <p className="shell-eyebrow">CAFÉS · NÓMADES</p>
            <h1 className="shell-title">Cafés para <em>trabajar.</em></h1>
            <p className="shell-lead" style={{ marginTop: "0.6rem" }}>
              Recomendaciones de la comunidad: dónde hay buen WiFi, enchufes y lugar para abrir la laptop en Mar del Plata.
            </p>
          </div>
          <div className="cafes-x-filter">
            <div className="cafes-x-viewtoggle">
              <button type="button" className={`cafes-x-viewbtn ${view === "grid" ? "is-active" : ""}`} onClick={() => setView("grid")} aria-label="Vista grilla">▦</button>
              <button type="button" className={`cafes-x-viewbtn ${view === "list" ? "is-active" : ""}`} onClick={() => setView("list")} aria-label="Vista lista">☰</button>
            </div>
            <select
              aria-label="Filtrar por barrio"
              className="cafes-x-select"
              value={hood}
              onChange={(e) => setHood(e.target.value)}
            >
              <option value="all">Todos los barrios</option>
              {hoods.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <label className="cafes-x-toggle">
              <input
                type="checkbox"
                checked={onlyWifi}
                onChange={(e) => setOnlyWifi(e.target.checked)}
              />
              Con WiFi confirmado
            </label>
            {user && (
              <Link href="/cafes/nuevo" className="shell-btn-primary">+ Agregar café</Link>
            )}
          </div>
        </header>

        {filtered.length === 0 ? (
          <p className="cafes-x-empty">
            Todavía no hay cafés cargados. ¡Sé el primero en recomendar uno!
          </p>
        ) : (
          <div className={view === "list" ? "cafes-x-list" : "cafes-x-grid"}>
            {filtered.map((c) => (
              <CafeCard
                key={c.id}
                cafe={c}
                myVote={myVotes.get(c.id) ?? null}
                canVote={!!user}
                view={view}
                onOpen={() => {
                  window.location.href = `/cafes/${c.id}`;
                }}
                onVote={(dir) => void handleQuickVote(c.id, dir)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
