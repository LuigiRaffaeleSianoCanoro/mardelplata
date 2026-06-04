"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  CAFE_AMENITIES,
  CAFE_KIND_LABEL,
  type Cafe,
  type CafeComment,
  type CafeScore,
} from "@/lib/types/cafes";
import VoteWolf from "./VoteWolf";

interface Props {
  cafe: Cafe;
  score: Omit<CafeScore, "cafe_id">;
  comments: CafeComment[];
}

export default function CafeDetail({ cafe, score, comments }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (!cancelled) setUser(u);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <div className="shell-section">
      <div className="shell-inner shell-inner--narrow">
        <Link href="/cafes" className="shell-btn-ghost">← Volver a cafés</Link>
        <header className="cafes-x-detail-head">
          <span className="cafes-x-kind">{CAFE_KIND_LABEL[cafe.kind]}</span>
          <h1 className="shell-title">{cafe.name}</h1>
          {cafe.neighborhood && <p className="shell-lead">{cafe.neighborhood}</p>}
          {cafe.address && <p className="cafes-x-card-hood">{cafe.address}</p>}
          <p className="cafes-x-net">Lobitos netos: {score.net_votes} ({score.votes_count} votos)</p>
          <div className="cafes-x-chips">
            {CAFE_AMENITIES.map((a) => (
              <span key={a.key} className="cafes-x-chip">
                {a.emoji} {a.label} · {score[a.countKey]}
              </span>
            ))}
          </div>
          {cafe.maps_url && /^https?:\/\//i.test(cafe.maps_url) && (
            <p style={{ marginTop: "0.8rem" }}>
              <a href={cafe.maps_url} target="_blank" rel="noopener noreferrer" className="shell-btn-ghost">
                Ver en Google Maps ↗
              </a>
            </p>
          )}
          {cafe.source === "community" && (
            <span className="cafes-x-badge">agregado por la comunidad</span>
          )}
        </header>

        <section className="cafes-x-section">
          <h2 className="shell-eyebrow">TU VOTO</h2>
          <VoteWolf cafeId={cafe.id} userId={user?.id ?? null} onChanged={() => router.refresh()} />
        </section>

        <section className="cafes-x-section">
          <h2 className="shell-eyebrow">COMENTARIOS</h2>
          {comments.length === 0 ? (
            <p className="cafes-x-empty">Todavía no hay comentarios.</p>
          ) : (
            <ul className="cafes-x-comments">
              {comments.map((c) => (
                <li key={c.user_id} className="cafes-x-commentitem">
                  <span className="cafes-x-commentvote">{c.vote === 1 ? "🦭▲" : "🦭▼"}</span>
                  <div>
                    <strong>{c.author_name ?? "Miembro"}</strong>
                    <p>{c.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
