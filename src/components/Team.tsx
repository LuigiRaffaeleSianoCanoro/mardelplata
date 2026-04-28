import { resolveAvatarDisplayUrl } from "@/lib/avatarPresets";

interface TeamMember {
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

const fallbackMembers: TeamMember[] = [
  {
    full_name: "Luigi Canoro",
    bio: "Co-fundador",
    avatar_url: null,
    github_url: null,
    linkedin_url: null,
    twitter_url: null,
  },
  {
    full_name: "Franco Petruccelli",
    bio: "Co-fundador",
    avatar_url: null,
    github_url: null,
    linkedin_url: null,
    twitter_url: null,
  },
];

export default function Team({ members = [] }: { members?: TeamMember[] }) {
  const data = members.length > 0 ? members : fallbackMembers;
  return (
    <section id="staff" className="relative py-28 px-6 ocean-tint overflow-hidden">
      {/* Drifting glow — boat metaphor + scroll parallax */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-ocean-200/40 blur-[120px] pointer-events-none boat-drift-soft parallax-back" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-6 items-end mb-14">
          <div className="col-span-12 md:col-span-8">
            <span className="eyebrow">Equipo</span>
            <h2 className="display-h2 mt-5 text-ocean-900 text-[clamp(2.5rem,6vw,5rem)]">
              Quiénes <span className="gradient-text">somos.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <p className="text-slate-600 text-base leading-relaxed">
              Dos QA Engineers marplatenses construyendo el club tech que les hubiera gustado tener.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((m, i) => (
            <article
              key={m.full_name || `member-${i}`}
              className="bento-card p-8 md:p-10 flex flex-col gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-ocean-200 shadow-lg shadow-ocean-700/10 flex-shrink-0 bg-white">
                  <img
                    src={resolveAvatarDisplayUrl(m.avatar_url, m.full_name)}
                    alt={m.full_name || "Miembro"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ocean-600 mb-2">
                    / 0{i + 1} · co-founder
                  </p>
                  <h3 className="font-display font-bold text-2xl md:text-3xl text-ocean-900 leading-tight">
                    {m.full_name || "Miembro"}
                  </h3>
                </div>
              </div>

              {m.bio && (
                <p className="text-slate-600 text-base leading-relaxed border-t border-ocean-100 pt-5">
                  {m.bio}
                </p>
              )}

              {(m.github_url || m.linkedin_url || m.twitter_url) && (
                <div className="flex items-center gap-2 mt-auto">
                  {m.github_url && (
                    <SocialChip href={m.github_url} label="GitHub">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </SocialChip>
                  )}
                  {m.linkedin_url && (
                    <SocialChip href={m.linkedin_url} label="LinkedIn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </SocialChip>
                  )}
                  {m.twitter_url && (
                    <SocialChip href={m.twitter_url} label="X">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </SocialChip>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialChip({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-ocean-200 bg-white text-slate-600 hover:text-ocean-700 hover:border-ocean-400 hover:bg-ocean-50 transition-all"
    >
      {children}
    </a>
  );
}
