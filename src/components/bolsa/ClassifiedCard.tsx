"use client";

import type { ClassifiedListing } from "@/lib/types/classifieds";
import { CLASSIFIED_NEW_DAYS } from "@/lib/types/classifieds";

function authorLabel(listing: ClassifiedListing): string {
  const p = listing.author;
  if (!p) return "Usuario";
  return p.full_name?.trim() || "Usuario";
}

function previewText(text: string, max = 100): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

type ClassifiedCardProps = {
  listing: ClassifiedListing;
  likes: number;
  dislikes: number;
  myVote: number | null;
  onOpen: () => void;
  onVote: (dir: 1 | -1) => void;
  canDelete: boolean;
  onDelete: () => void;
};

export default function ClassifiedCard({
  listing,
  likes,
  dislikes,
  myVote,
  onOpen,
  onVote,
  canDelete,
  onDelete,
}: ClassifiedCardProps) {
  const created = new Date(listing.created_at);
  const isNew =
    (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24) <= CLASSIFIED_NEW_DAYS;

  return (
    <article className="shell-card classified-card">
      <button
        type="button"
        onClick={onOpen}
        className="classified-card-body"
      >
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="classified-card-kind">
            {listing.kind === "job" ? "Trabajo" : "Freelance"}
          </span>
          {isNew && (
            <span className="classified-card-new">
              Nuevo
            </span>
          )}
        </div>
        <h3 className="classified-card-title">
          {listing.title}
        </h3>
        <p className="classified-card-desc">
          {previewText(listing.description, 140)}
        </p>
        <p className="classified-card-author">
          <span className="classified-card-author-prefix">Por </span>
          {authorLabel(listing)}
        </p>
      </button>

      {listing.tags && listing.tags.length > 0 && (
        <div className="classified-card-tags">
          {listing.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="classified-card-tag"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="classified-card-footer">
        <div className="classified-card-votes">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVote(1);
            }}
            className={`bolsa-vote-btn ${myVote === 1 ? "bolsa-vote-btn-active" : ""}`}
            aria-label="Me gusta"
            title="Me gusta"
          >
            <span aria-hidden>👍</span>
            <span className="classified-card-vote-count">{likes}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVote(-1);
            }}
            className={`bolsa-vote-btn ${myVote === -1 ? "bolsa-vote-btn-active" : ""}`}
            aria-label="No me gusta"
            title="No me gusta"
          >
            <span aria-hidden>👎</span>
            <span className="classified-card-vote-count">{dislikes}</span>
          </button>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="classified-card-delete"
          >
            Borrar
          </button>
        )}
      </div>
    </article>
  );
}
