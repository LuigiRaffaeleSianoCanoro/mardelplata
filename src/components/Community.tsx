"use client";

// Community — "Nuestra comunidad". Grid de 5 miembros + 1 CTA card
// "Sumate vos también". Cada miembro: avatar, nombre, rol, ubicación,
// y links sociales (GitHub / LinkedIn / Twitter) si los declaró en el
// perfil. Si hay > 5 miembros en DB, rotamos los visibles cada 5s
// (pausa on hover) para que no se vean siempre los mismos.

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import { WHATSAPP_COMMUNITY_URL } from "@/lib/community";
import { resolveAvatarDisplayUrl } from "@/lib/avatarPresets";

interface CommunityMember {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

type DisplayMember = {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
};

const PLACEHOLDER_MEMBERS: DisplayMember[] = [
  { id: "p1", name: "Florencia G.", role: "Frontend Developer", location: "MDQ", avatar: "/avatars/tech-01.svg", github: null, linkedin: null, twitter: null },
  { id: "p2", name: "Martín P.",    role: "DevOps Engineer",    location: "MDQ", avatar: "/avatars/tech-02.svg", github: null, linkedin: null, twitter: null },
  { id: "p3", name: "Camila R.",    role: "UX/UI Designer",     location: "Batán", avatar: "/avatars/tech-03.svg", github: null, linkedin: null, twitter: null },
  { id: "p4", name: "Lucas T.",     role: "Backend Developer",  location: "Mar del Plata", avatar: "/avatars/tech-04.svg", github: null, linkedin: null, twitter: null },
  { id: "p5", name: "Agustina L.",  role: "Data Scientist",     location: "MDQ", avatar: "/avatars/tech-05.svg", github: null, linkedin: null, twitter: null },
];

function extractRole(bio: string | null): string {
  if (!bio) return "Miembro de la red";
  // Toma primera línea / primer fragmento corto del bio
  const first = bio.split(/[·\n.]/)[0].trim();
  return first.length > 36 ? first.slice(0, 33) + "…" : first;
}

function shortName(name: string | null): string {
  if (!name) return "Anónimo";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return parts[0] + " " + parts[parts.length - 1].charAt(0) + ".";
}

const VISIBLE = 5;
const ROTATE_MS = 5000;

function toDisplay(m: CommunityMember): DisplayMember {
  return {
    id: m.id,
    name: shortName(m.full_name),
    role: extractRole(m.bio),
    location: "MDQ",
    avatar: resolveAvatarDisplayUrl(m.avatar_url) ?? null,
    github: m.github_url,
    linkedin: m.linkedin_url,
    twitter: m.twitter_url,
  };
}

export default function Community({
  members = [],
}: {
  members?: CommunityMember[];
}) {
  const [offset, setOffset] = useState(0);
  const [paused, setPaused] = useState(false);

  // Rotacion: si hay mas miembros de los visibles, avanza el offset cada
  // ROTATE_MS milisegundos. Pausa on hover. Si no hay suficientes, no hay
  // rotacion y mostramos lo que tengamos.
  useEffect(() => {
    if (members.length <= VISIBLE || paused) return;
    const id = setInterval(() => {
      setOffset((o) => (o + 1) % members.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [members.length, paused]);

  const display: DisplayMember[] = useMemo(() => {
    if (members.length === 0) return PLACEHOLDER_MEMBERS;
    if (members.length <= VISIBLE) return members.map(toDisplay);
    const out: DisplayMember[] = [];
    for (let i = 0; i < VISIBLE; i++) {
      out.push(toDisplay(members[(offset + i) % members.length]));
    }
    return out;
  }, [members, offset]);

  return (
    <section className="community-x" id="colaboradores">
      <div className="community-x-inner">
        <header className="community-x-header">
          <h2 className="community-x-title">Nuestra comunidad</h2>
          <span className="community-x-pill">
            {members.length >= 100 ? members.length + "+" : "1200+"} miembros
          </span>
        </header>

        <div
          className="community-x-grid"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {display.map((m) => {
            const socials = [
              m.github && { kind: "github" as const, url: m.github, label: "GitHub" },
              m.linkedin && { kind: "linkedin" as const, url: m.linkedin, label: "LinkedIn" },
              m.twitter && { kind: "twitter" as const, url: m.twitter, label: "Twitter" },
            ].filter(Boolean) as Array<{ kind: "github" | "linkedin" | "twitter"; url: string; label: string }>;

            return (
              <article key={m.id} className="member-card">
                <div className="member-card-avatar">
                  {m.avatar ? (
                    <Image
                      src={m.avatar}
                      alt={m.name}
                      width={68}
                      height={68}
                      className="member-card-avatar-img"
                    />
                  ) : (
                    <span className="member-card-avatar-fallback">
                      {m.name.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="member-card-name">{m.name}</h3>
                <p className="member-card-role">{m.role}</p>
                <p className="member-card-loc">
                  <PinIcon /> {m.location}
                </p>
                {socials.length > 0 && (
                  <div className="member-card-socials">
                    {socials.map((s) => (
                      <a
                        key={s.kind}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${m.name} en ${s.label}`}
                        className="member-social"
                      >
                        <SocialIcon kind={s.kind} />
                      </a>
                    ))}
                  </div>
                )}
              </article>
            );
          })}

          <TrackedOutboundLink
            className="member-card member-card--cta"
            href={WHATSAPP_COMMUNITY_URL}
            trackSource="community_cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h3 className="member-card-cta-title">¡Sumate vos también!</h3>
            <p className="member-card-cta-desc">
              Sé parte de una red de talento y amistad.
            </p>
            <span className="member-card-cta-btn">
              Unirme a la comunidad <span aria-hidden>→</span>
            </span>
          </TrackedOutboundLink>
        </div>
      </div>
    </section>
  );
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function SocialIcon({ kind }: { kind: "github" | "linkedin" | "twitter" }) {
  if (kind === "github") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-.99-.02-1.95-3.2.69-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.96 10.96 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13 0 1.54-.01 2.79-.01 3.17 0 .31.21.66.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    );
  }
  if (kind === "linkedin") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.92-2.07 2.06-2.07s2.07.93 2.07 2.07c0 1.14-.93 2.07-2.07 2.07zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    );
  }
  // twitter / X
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
