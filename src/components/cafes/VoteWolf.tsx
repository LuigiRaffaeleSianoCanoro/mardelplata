"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CAFE_AMENITIES,
  CAFE_COMMENT_MAX,
  type AmenityKey,
  type CafeVote,
} from "@/lib/types/cafes";

interface Props {
  cafeId: string;
  userId: string | null;
  onChanged?: () => void;
}

type Draft = {
  vote: 1 | -1 | null;
  has_wifi: boolean;
  has_power: boolean;
  good_seating: boolean;
  is_quiet: boolean;
  comment: string;
};

const EMPTY_DRAFT: Draft = {
  vote: null,
  has_wifi: false,
  has_power: false,
  good_seating: false,
  is_quiet: false,
  comment: "",
};

export default function VoteWolf({ cafeId, userId, onChanged }: Props) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void supabase
      .from("cafe_votes")
      .select("*")
      .eq("cafe_id", cafeId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        const v = data as CafeVote;
        setDraft({
          vote: v.vote,
          has_wifi: !!v.has_wifi,
          has_power: !!v.has_power,
          good_seating: !!v.good_seating,
          is_quiet: !!v.is_quiet,
          comment: v.comment ?? "",
        });
      });
    return () => {
      cancelled = true;
    };
  }, [cafeId, userId, supabase]);

  if (!userId) {
    return (
      <div className="cafes-x-gate">
        <p className="shell-lead">Iniciá sesión para votar 🐺 y comentar.</p>
        <div className="cafes-x-gate-actions">
          <a href="/auth/login" className="shell-btn-primary">Ingresar →</a>
          <a href="/auth/registro" className="shell-btn-ghost">Crear cuenta</a>
        </div>
      </div>
    );
  }

  const toggleAmenity = (k: AmenityKey) =>
    setDraft((d) => ({ ...d, [k]: !d[k] }));

  const save = async (vote: 1 | -1) => {
    setSaving(true);
    setError(null);

    // Segundo click en la misma dirección = des-votar (igual que en la tarjeta).
    if (draft.vote === vote) {
      const { error: err } = await supabase
        .from("cafe_votes")
        .delete()
        .eq("cafe_id", cafeId)
        .eq("user_id", userId);
      setSaving(false);
      if (err) {
        setError(err.message);
        return;
      }
      setDraft((d) => ({ ...d, vote: null }));
      onChanged?.();
      return;
    }

    const next: Draft = { ...draft, vote };
    setDraft(next);
    const { error: err } = await supabase.from("cafe_votes").upsert(
      {
        cafe_id: cafeId,
        user_id: userId,
        vote,
        has_wifi: next.has_wifi,
        has_power: next.has_power,
        good_seating: next.good_seating,
        is_quiet: next.is_quiet,
        comment: next.comment.trim() || null,
      },
      { onConflict: "cafe_id,user_id" },
    );
    setSaving(false);
    if (err) {
      setError(err.message);
      return;
    }
    onChanged?.();
  };

  return (
    <div className="cafes-x-voteform">
      <div className="cafes-x-vote">
        <button
          type="button"
          aria-label="Lobito arriba"
          className={`cafes-x-wolf ${draft.vote === 1 ? "is-up" : ""}`}
          disabled={saving}
          onClick={() => void save(1)}
        >
          🐺▲ Apto
        </button>
        <button
          type="button"
          aria-label="Lobito abajo"
          className={`cafes-x-wolf ${draft.vote === -1 ? "is-down" : ""}`}
          disabled={saving}
          onClick={() => void save(-1)}
        >
          🐺▼ No apto
        </button>
      </div>

      <div className="cafes-x-chips">
        {CAFE_AMENITIES.map((a) => (
          <button
            key={a.key}
            type="button"
            disabled={saving}
            className={`cafes-x-chip ${draft[a.key] ? "is-on" : ""}`}
            onClick={() => toggleAmenity(a.key)}
          >
            {a.emoji} {a.label}
          </button>
        ))}
      </div>

      <textarea
        className="cafes-x-comment"
        maxLength={CAFE_COMMENT_MAX}
        placeholder="Tu mini-review (opcional)…"
        value={draft.comment}
        disabled={saving}
        onChange={(e) => setDraft((d) => ({ ...d, comment: e.target.value }))}
        onBlur={() => {
          if (draft.vote !== null) void save(draft.vote);
        }}
      />

      {error && <p className="cafes-x-errmsg">Error al guardar: {error}</p>}
    </div>
  );
}
