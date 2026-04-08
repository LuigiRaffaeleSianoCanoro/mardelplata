import { getFallbackAvatar } from "@/lib/avatarPresets";
import { normalizeExternalUrl } from "@/lib/urls";

interface CommunityMember {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

export default function Collaborators({ members = [] }: { members?: CommunityMember[] }) {
  const loopMembers = members.length > 0 ? [...members, ...members] : [];

  return (
    <section id="colaboradores" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-ocean-50 text-ocean-700 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            👥 Comunidad
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ocean-900 mb-4">
            Nuestra comunidad tech
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Perfiles de miembros que comparten conocimiento y construyen el ecosistema de Mar del Plata.
          </p>
        </div>
        <div className="overflow-hidden pb-2">
          <div className="community-marquee flex gap-5 w-max">
            {loopMembers.map((member, index) => (
              <article
                key={`${member.id}-${index}`}
                className="w-[260px] bg-white rounded-3xl p-6 text-center border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ocean-600/10"
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-slate-100 border border-slate-200 shadow-lg">
                  <img
                    src={member.avatar_url || getFallbackAvatar(member.full_name || member.id)}
                    alt={member.full_name || "Miembro"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-800">{member.full_name || "Miembro"}</h3>
                <p className="text-ocean-600 font-medium text-sm mb-4">{member.bio || "Miembro de la comunidad"}</p>
                {(member.github_url || member.linkedin_url || member.twitter_url) && (
                  <div className="flex items-center justify-center gap-3">
                    {normalizeExternalUrl(member.github_url) && (
                      <a href={normalizeExternalUrl(member.github_url)!} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:text-ocean-700 hover:bg-ocean-50 transition-colors flex items-center justify-center" aria-label="GitHub">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </a>
                    )}
                    {normalizeExternalUrl(member.linkedin_url) && (
                      <a href={normalizeExternalUrl(member.linkedin_url)!} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:text-ocean-700 hover:bg-ocean-50 transition-colors flex items-center justify-center" aria-label="LinkedIn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {normalizeExternalUrl(member.twitter_url) && (
                      <a href={normalizeExternalUrl(member.twitter_url)!} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 hover:text-ocean-700 hover:bg-ocean-50 transition-colors flex items-center justify-center" aria-label="X">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </article>
            ))}
            {members.length === 0 && (
              <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-7 text-center text-slate-500">
                Todavía no hay perfiles públicos para mostrar.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
