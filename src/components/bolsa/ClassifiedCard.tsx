"use client";

import type { ClassifiedListing } from "@/lib/types/classifieds";
import { CLASSIFIED_NEW_DAYS } from "@/lib/types/classifieds";

function authorLabel(listing: ClassifiedListing): string {
  const p = listing.profiles;
  if (!p) return "Usuario";
  return p.full_name?.trim() || p.email?.trim() || "Usuario";
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
    <article className="bolsa-card group flex flex-col p-2 sm:p-2.5">
      <button
        type="button"
        onClick={onOpen}
        className="text-left flex-1 min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 rounded-sm"
      >
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-[10px] uppercase tracking-wide text-stone-600 shrink-0">
            {listing.kind === "job" ? "Trabajo" : "Freelance"}
          </span>
          {isNew && (
            <span className="text-[9px] font-bold uppercase bg-stone-800 text-[#FEF9EE] px-1 py-0.5 leading-none">
              Nuevo
            </span>
          )}
        </div>
        <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-2 mb-1">
          {listing.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-stone-700 leading-snug line-clamp-3 mb-2">
          {previewText(listing.description, 140)}
        </p>
        <p className="text-[10px] text-stone-500 border-t border-stone-300/80 pt-1.5">
          <span className="text-stone-400">Por </span>
          {authorLabel(listing)}
        </p>
      </button>

      {listing.tags && listing.tags.length > 0 && (
        <div className="flex flex-wrap gap-0.5 mt-1 mb-1">
          {listing.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1 py-0 border border-stone-400/60 text-stone-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-1 mt-auto pt-1 border-t border-dotted border-stone-400/70">
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVote(1);
            }}
            className={`bolsa-vote-btn ${myVote === 1 ? "bg-stone-200" : ""}`}
            aria-label="Me gusta"
            title="Me gusta"
          >
            <span aria-hidden>👍</span>
            <span className="text-[10px] tabular-nums">{likes}</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onVote(-1);
            }}
            className={`bolsa-vote-btn ${myVote === -1 ? "bg-stone-200" : ""}`}
            aria-label="No me gusta"
            title="No me gusta"
          >
            <span aria-hidden>👎</span>
            <span className="text-[10px] tabular-nums">{dislikes}</span>
          </button>
        </div>
        {canDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-[10px] text-red-800 hover:underline"
          >
            Borrar
          </button>
        )}
      </div>
    </article>
  );
}
