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
    <section id="staff" className="py-20 px-6 ocean-tint">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-ocean-200/60 text-ocean-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            👥 El equipo
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ocean-900 mb-4">
            Quiénes Somos
          </h2>
          <p className="text-slate-600 text-lg max-w-md mx-auto">
            Conocé a los fundadores de MarDelPlata.dev.ar.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {data.map((m) => (
            <div
              key={m.full_name || "miembro"}
              className="group bg-white rounded-3xl p-7 text-center border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ocean-600/10"
            >
              <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-slate-100 border border-slate-200 shadow-lg">
                <img
                  src={resolveAvatarDisplayUrl(m.avatar_url, m.full_name)}
                  alt={m.full_name || "Miembro"}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="inline-flex items-center gap-1 bg-ocean-100 text-ocean-700 rounded-full px-3 py-1 text-xs font-semibold mb-3">
                ⭐ Co-fundador
              </span>
              <h3 className="font-display font-bold text-xl text-slate-800">{m.full_name || "Miembro"}</h3>
              <p className="text-ocean-600 font-medium text-sm mb-2">Co-fundador</p>
              {m.bio && <p className="text-slate-500 text-sm mb-4">{m.bio}</p>}
              {(m.github_url || m.linkedin_url || m.twitter_url) && (
                <div className="flex items-center justify-center gap-3">
                  {m.github_url && (
                    <a href={m.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-ocean-700 transition-colors" aria-label="GitHub">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    </a>
                  )}
                  {m.linkedin_url && (
                    <a href={m.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-ocean-700 transition-colors" aria-label="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {m.twitter_url && (
                    <a href={m.twitter_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-ocean-700 transition-colors" aria-label="X">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
