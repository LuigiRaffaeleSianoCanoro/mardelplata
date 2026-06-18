"use client";

// Huevsites — "huevsites de la comunidad". Toma los miembros que conectaron su
// huevsite (huevsite.io) y muestra una card custom por cada uno usando la API
// pública de perfiles. Al tocar "Ver huevsite" se abre el perfil completo en un
// iframe embebido (?embed=1), mandando tráfico de vuelta a cada builder.
//
// La idea está documentada en el blog de huevsite.io:
// https://huevsite.io/blog/api-publica-de-perfiles

import { useCallback, useEffect, useState } from "react";
import { resolveAvatarDisplayUrl } from "@/lib/avatarPresets";
import {
  fetchHuevsiteProfile,
  huevsiteEmbedUrl,
  huevsiteProfileUrl,
  normalizeHuevsiteUsername,
  type HuevsiteProfile,
} from "@/lib/huevsite";

export interface HuevsiteMember {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  huevsite_username: string | null;
}

type ResolvedCard = {
  id: string;
  username: string;
  // Datos finales ya con fallback al perfil local de MdPDev.
  name: string;
  headline: string | null;
  avatar: string | null;
  accentColor: string | null;
  builderScore: number | null;
  // true si los datos vienen de la API; false si es un fallback local.
  live: boolean;
};

const FALLBACK_ACCENT = "#0096C7"; // ocean-500

function buildCard(member: HuevsiteMember, username: string, api: HuevsiteProfile | null): ResolvedCard {
  const localName = member.full_name?.trim() || username;
  return {
    id: member.id,
    username,
    name: api?.name?.trim() || localName,
    headline: api?.headline?.trim() || null,
    avatar: api?.avatar || resolveAvatarDisplayUrl(member.avatar_url, localName),
    accentColor: api?.accentColor || null,
    builderScore: api?.builderScore ?? null,
    live: api != null,
  };
}

export default function Huevsites({ members = [] }: { members?: HuevsiteMember[] }) {
  const [cards, setCards] = useState<ResolvedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<ResolvedCard | null>(null);

  const candidates = members
    .map((m) => ({ member: m, username: normalizeHuevsiteUsername(m.huevsite_username) }))
    .filter((c): c is { member: HuevsiteMember; username: string } => c.username != null);

  useEffect(() => {
    if (candidates.length === 0) {
      setCards([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    setLoading(true);

    (async () => {
      const results = await Promise.all(
        candidates.map(async ({ member, username }) => {
          const res = await fetchHuevsiteProfile(username, controller.signal);
          if (res.status === "not_found") return null; // username inválido → ocultar
          // ok → card live; error de red → fallback con datos locales.
          return buildCard(member, username, res.status === "ok" ? res.profile : null);
        }),
      );

      if (cancelled) return;
      setCards(results.filter((c): c is ResolvedCard => c !== null));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  const closeModal = useCallback(() => setActive(null), []);

  // Lock de scroll + Escape mientras el modal está abierto.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, closeModal]);

  // Si no hay candidatos válidos, no renderizamos la sección.
  if (candidates.length === 0) return null;
  // Terminó de cargar y todos resultaron 404 → tampoco mostramos nada.
  if (!loading && cards.length === 0) return null;

  return (
    <section className="huevsites-x" id="huevsites">
      <div className="huevsites-x-inner">
        <header className="huevsites-x-header">
          <div>
            <h2 className="huevsites-x-title">huevsites de la comunidad</h2>
            <p className="huevsites-x-sub">
              Builders de MdPDev con su{" "}
              <a href="https://huevsite.io" target="_blank" rel="noopener noreferrer" className="huevsites-x-link">
                huevsite
              </a>{" "}
              conectado. Tocá una card para ver el perfil completo.
            </p>
          </div>
          <span className="huevsites-x-pill">{cards.length || candidates.length} conectados</span>
        </header>

        <div className="huevsites-x-grid">
          {loading
            ? candidates.slice(0, 8).map(({ username }) => (
                <div key={username} className="huevsite-card huevsite-card--skeleton" aria-hidden>
                  <div className="huevsite-card-top">
                    <div className="huevsite-skel-avatar" />
                    <div className="huevsite-skel-lines">
                      <span className="huevsite-skel-line" />
                      <span className="huevsite-skel-line short" />
                    </div>
                  </div>
                </div>
              ))
            : cards.map((card) => {
                const accent = card.accentColor || FALLBACK_ACCENT;
                return (
                  <article
                    key={card.id}
                    className="huevsite-card"
                    style={{ ["--huevsite-accent" as string]: accent }}
                  >
                    <div className="huevsite-card-top">
                      <div className="huevsite-card-avatar">
                        {card.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={card.avatar} alt={card.name} loading="lazy" />
                        ) : (
                          <span className="huevsite-card-avatar-fallback">{card.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="huevsite-card-id">
                        <h3 className="huevsite-card-name">{card.name}</h3>
                        <span className="huevsite-card-handle">@{card.username}</span>
                      </div>
                      {card.builderScore != null && (
                        <span className="huevsite-card-score" title="Builder Score">
                          <EggIcon />
                          {card.builderScore}
                        </span>
                      )}
                    </div>

                    {card.headline && <p className="huevsite-card-headline">{card.headline}</p>}

                    <div className="huevsite-card-actions">
                      <button
                        type="button"
                        className="huevsite-card-btn"
                        onClick={() => setActive(card)}
                      >
                        Ver huevsite
                      </button>
                      <a
                        href={huevsiteProfileUrl(card.username)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="huevsite-card-open"
                        aria-label={`Abrir el huevsite de ${card.name} en huevsite.io`}
                      >
                        <OpenIcon />
                      </a>
                    </div>
                  </article>
                );
              })}
        </div>
      </div>

      {active && (
        <div
          className="huevsite-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`huevsite de ${active.name}`}
          onClick={closeModal}
        >
          <div className="huevsite-modal" onClick={(e) => e.stopPropagation()}>
            <header className="huevsite-modal-head">
              <div className="huevsite-modal-id">
                <strong>{active.name}</strong>
                <span>@{active.username}</span>
              </div>
              <div className="huevsite-modal-tools">
                <a
                  href={huevsiteProfileUrl(active.username)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="huevsite-modal-open"
                >
                  Abrir en huevsite.io <OpenIcon />
                </a>
                <button type="button" className="huevsite-modal-close" onClick={closeModal} aria-label="Cerrar">
                  <CloseIcon />
                </button>
              </div>
            </header>
            <iframe
              key={active.username}
              src={huevsiteEmbedUrl(active.username)}
              title={`huevsite de ${active.name}`}
              className="huevsite-modal-frame"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      )}
    </section>
  );
}

function EggIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c3.6 0 7 5.5 7 11a7 7 0 0 1-14 0C5 7.5 8.4 2 12 2z" />
    </svg>
  );
}

function OpenIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
