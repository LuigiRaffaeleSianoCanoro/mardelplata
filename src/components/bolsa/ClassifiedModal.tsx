"use client";

import type { ClassifiedListing, JobPosition } from "@/lib/types/classifieds";
import ShareButton from "./ShareButton";

function authorLabel(listing: ClassifiedListing): string {
  const p = listing.author;
  if (!p) return "Usuario";
  return p.full_name?.trim() || "Usuario";
}

function LinkRow({ href, label }: { href: string; label: string }) {
  const safe = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={safe}
      target="_blank"
      rel="noopener noreferrer"
      className="classified-modal-link"
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
    <div className="classified-modal-portal">
      <button
        type="button"
        className="classified-modal-backdrop"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        className="classified-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bolsa-modal-title"
      >
        <div className="classified-modal-head">
          <span className="classified-modal-kind">
            {listing.kind === "job" ? "Oferta laboral" : "Servicios freelance"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="classified-modal-close"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <h2 id="bolsa-modal-title" className="classified-modal-title">
          {listing.title}
        </h2>

        <p className="classified-modal-author">
          Publicado por <strong className="classified-modal-author-name">{authorLabel(listing)}</strong>
        </p>

        <div className="classified-modal-desc">
          {listing.description}
        </div>

        {listing.external_url?.trim() && (
          <p className="classified-modal-external">
            <span className="classified-modal-external-label">Enlace</span>
            <LinkRow href={listing.external_url.trim()} label={listing.external_url.trim()} />
          </p>
        )}

        {listing.kind === "job" && positions.length > 0 && (
          <div className="classified-modal-positions">
            <p className="classified-modal-positions-label">
              Posiciones
            </p>
            <ul className="classified-modal-positions-list">
              {positions.map((pos, i) => (
                <li key={i} className="classified-modal-position">
                  <p className="classified-modal-position-title">{pos.title || `Puesto ${i + 1}`}</p>
                  {pos.description?.trim() && (
                    <p className="classified-modal-position-desc">{pos.description}</p>
                  )}
                  {pos.link?.trim() && (
                    <LinkRow href={pos.link.trim()} label={pos.link.trim()} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="classified-modal-footer">
          <div className="classified-modal-votes">
            <button
              type="button"
              onClick={() => onVote(1)}
              className={`bolsa-vote-btn ${myVote === 1 ? "bolsa-vote-btn-active" : ""}`}
            >
              👍 {likes}
            </button>
            <button
              type="button"
              onClick={() => onVote(-1)}
              className={`bolsa-vote-btn ${myVote === -1 ? "bolsa-vote-btn-active" : ""}`}
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
              className="classified-modal-delete"
            >
              Borrar mi anuncio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
