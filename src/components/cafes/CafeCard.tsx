"use client";

import { CAFE_AMENITIES, type CafeWithScore } from "@/lib/types/cafes";

interface Props {
  cafe: CafeWithScore;
  myVote: 1 | -1 | null;
  onOpen: () => void;
  onVote: (dir: 1 | -1) => void;
  canVote: boolean;
}

export default function CafeCard({ cafe, myVote, onOpen, onVote, canVote }: Props) {
  const { score } = cafe;
  return (
    <article className="cafes-x-card">
      <button type="button" className="cafes-x-card-body" onClick={onOpen}>
        <h3 className="cafes-x-card-title">{cafe.name}</h3>
        {cafe.neighborhood && <p className="cafes-x-card-hood">{cafe.neighborhood}</p>}
        <div className="cafes-x-chips">
          {CAFE_AMENITIES.map((a) => {
            const n = score[a.countKey];
            if (!n) return null;
            return (
              <span key={a.key} className="cafes-x-chip" title={`${n} confirman ${a.label}`}>
                {a.emoji} {a.label} · {n}
              </span>
            );
          })}
        </div>
        {cafe.source === "community" && (
          <span className="cafes-x-badge">agregado por la comunidad</span>
        )}
      </button>
      <div className="cafes-x-vote">
        <button
          type="button"
          aria-label="Lobito arriba"
          disabled={!canVote}
          className={`cafes-x-wolf ${myVote === 1 ? "is-up" : ""}`}
          onClick={() => onVote(1)}
        >
          🐺▲
        </button>
        <span className="cafes-x-net">{score.net_votes}</span>
        <button
          type="button"
          aria-label="Lobito abajo"
          disabled={!canVote}
          className={`cafes-x-wolf ${myVote === -1 ? "is-down" : ""}`}
          onClick={() => onVote(-1)}
        >
          🐺▼
        </button>
      </div>
    </article>
  );
}
