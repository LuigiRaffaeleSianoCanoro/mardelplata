// Community — "Nuestra comunidad". Grid de 5 miembros + 1 CTA card
// "Sumate vos también". Cada miembro: avatar, nombre, rol, ubicación,
// y row de iconos skills. Si la DB tiene profiles los usa, si no
// muestra placeholders.

import Image from "next/image";
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
};

const PLACEHOLDER_MEMBERS: DisplayMember[] = [
  { id: "p1", name: "Florencia G.", role: "Frontend Developer", location: "MDQ", avatar: "/avatars/tech-01.svg" },
  { id: "p2", name: "Martín P.", role: "DevOps Engineer", location: "MDQ", avatar: "/avatars/tech-02.svg" },
  { id: "p3", name: "Camila R.", role: "UX/UI Designer", location: "Batán", avatar: "/avatars/tech-03.svg" },
  { id: "p4", name: "Lucas T.", role: "Backend Developer", location: "Mar del Plata", avatar: "/avatars/tech-04.svg" },
  { id: "p5", name: "Agustina L.", role: "Data Scientist", location: "MDQ", avatar: "/avatars/tech-05.svg" },
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

export default function Community({
  members = [],
}: {
  members?: CommunityMember[];
}) {
  const display: DisplayMember[] =
    members.length >= 5
      ? members.slice(0, 5).map((m) => ({
          id: m.id,
          name: shortName(m.full_name),
          role: extractRole(m.bio),
          location: "MDQ",
          avatar: resolveAvatarDisplayUrl(m.avatar_url) ?? null,
        }))
      : PLACEHOLDER_MEMBERS;

  return (
    <section className="community-x" id="colaboradores">
      <div className="community-x-inner">
        <header className="community-x-header">
          <h2 className="community-x-title">Nuestra comunidad</h2>
          <span className="community-x-pill">
            {members.length >= 100 ? members.length + "+" : "1200+"} miembros
          </span>
        </header>

        <div className="community-x-grid">
          {display.map((m) => (
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
              <div className="member-card-skills" aria-hidden>
                <span className="member-skill">⌘</span>
                <span className="member-skill">◌</span>
                <span className="member-skill">◇</span>
                <span className="member-skill">◉</span>
              </div>
            </article>
          ))}

          <a
            className="member-card member-card--cta"
            href="https://chat.whatsapp.com/LZEZd0oV7mD50PuESX4ybs"
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
          </a>
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
