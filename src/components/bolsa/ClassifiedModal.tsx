"use client";

import type { ClassifiedListing, JobPosition } from "@/lib/types/classifieds";
import ShareButton from "./ShareButton";

function authorLabel(listing: ClassifiedListing): string {
  const p = listing.profiles;
  if (!p) return "Usuario";
  return p.full_name?.trim() || p.email?.trim() || "Usuario";
}

function LinkRow({ href, label }: { href: string; label: string }) {
  const safe = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={safe}
      target="_blank"
      rel="noopener noreferrer"
      className="text-ocean-700 underline break-all text-sm"
    >
      {label}
    </a>
  );
}

type ClassifiedModalProps = {
  listing: ClassifiedListing;
  open: boolean;
  onClose: () => void;
  likes: number;
  dislikes: number;
  myVote: number | null;
  onVote: (dir: 1 | -1) => void;
  canDelete: boolean;
  onDelete: () => void;
};

export default function ClassifiedModal({
  listing,
  open,
  onClose,
  likes,
  dislikes,
  myVote,
  onVote,
  canDelete,
  onDelete,
}: ClassifiedModalProps) {
  if (!open) return null;

  const positions: JobPosition[] = Array.isArray(listing.positions) ? listing.positions : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className="bolsa-modal-zoom relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded border-2 border-stone-600 bg-[#FEF9EE] shadow-2xl p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bolsa-modal-title"
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] uppercase tracking-widest text-stone-600">
            {listing.kind === "job" ? "Oferta laboral" : "Servicios freelance"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-600 hover:text-stone-900 text-xl leading-none px-1"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <h2 id="bolsa-modal-title" className="text-xl font-bold text-stone-900 mb-3 leading-tight">
          {listing.title}
        </h2>

        <p className="text-xs text-stone-500 mb-4 pb-3 border-b border-dotted border-stone-400">
          Publicado por <strong className="text-stone-800">{authorLabel(listing)}</strong>
        </p>

        <div className="text-stone-800 whitespace-pre-wrap text-sm leading-relaxed mb-4">
          {listing.description}
        </div>

        {listing.external_url?.trim() && (
          <p className="mb-4">
            <span className="text-xs text-stone-600 block mb-1">Enlace</span>
            <LinkRow href={listing.external_url.trim()} label={listing.external_url.trim()} />
          </p>
        )}

        {listing.kind === "job" && positions.length > 0 && (
          <div className="mb-4 space-y-4">
            <p className="text-[10px] uppercase tracking-wide text-stone-600 border-b border-stone-400 pb-1">
              Posiciones
            </p>
            <ul className="space-y-4">
              {positions.map((pos, i) => (
                <li key={i} className="border border-stone-400/80 p-3 bg-white/50">
                  <p className="font-semibold text-stone-900 text-sm mb-1">{pos.title || `Puesto ${i + 1}`}</p>
                  {pos.description?.trim() && (
                    <p className="text-sm text-stone-700 whitespace-pre-wrap mb-2">{pos.description}</p>
                  )}
                  {pos.link?.trim() && (
                    <LinkRow href={pos.link.trim()} label={pos.link.trim()} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-stone-400">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onVote(1)}
              className={`bolsa-vote-btn ${myVote === 1 ? "bg-stone-200" : ""}`}
            >
              👍 {likes}
            </button>
            <button
              type="button"
              onClick={() => onVote(-1)}
              className={`bolsa-vote-btn ${myVote === -1 ? "bg-stone-200" : ""}`}
            >
              👎 {dislikes}
            </button>
          </div>
          <ShareButton listingId={listing.id} title={listing.title} />
          {canDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="text-xs text-red-800 hover:underline ml-auto"
            >
              Borrar mi anuncio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
