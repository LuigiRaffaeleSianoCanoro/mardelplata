import { resolveAvatarDisplayUrl } from "@/lib/avatarPresets";
import { normalizeExternalUrl } from "@/lib/urls";
import { Whale, Splash, FishSchool } from "./OceanDoodles";

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
    <section id="colaboradores" className="relative py-28 bg-white overflow-hidden">
      {/* Reveal mask — opaque black at top of page, fades to transparent as
          user scrolls past the hero. Driven by --reveal-progress (1 → 0). */}
      <div
        className="absolute inset-0 pointer-events-none z-[40] bg-[#0A0A0F]"
        style={{ opacity: "var(--reveal-progress, 1)" }}
      />

      {/* Whale resting on the right-mid area (soft teal-gray) */}
      <div className="absolute right-[8%] top-[220px] w-[260px] pointer-events-none text-[#6b8593]/55 swim-bob">
        <Whale className="w-full h-auto" />
      </div>
      {/* Splash slightly to the inner-right of the whale */}
      <div className="absolute right-[24%] top-[180px] w-12 h-12 pointer-events-none text-[#7090a0]/55 splash-pop">
        <Splash className="w-full h-full" />
      </div>
      {/* Floating fish schools */}
      <div className="absolute left-[40%] top-[140px] w-[140px] pointer-events-none text-[#6b8593]/45 boat-drift-soft">
        <FishSchool className="w-full h-auto" />
      </div>
      <div className="absolute right-[14%] bottom-[120px] w-[120px] pointer-events-none text-[#7090a0]/45 boat-drift-soft" style={{ animationDelay: "-3s" }}>
        <FishSchool className="w-full h-auto" />
      </div>
      <div className="absolute left-[10%] bottom-[200px] w-[100px] pointer-events-none text-[#6b8593]/40 boat-drift-soft" style={{ animationDelay: "-6s" }}>
        <FishSchool className="w-full h-auto" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-6 items-end mb-14">
          <div className="col-span-12 md:col-span-8">
            <p className="kicker text-ocean-700/80 mb-4 flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full bg-[#3B82F6]"
                style={{ boxShadow: "0 0 8px rgba(59,130,246,0.7)" }}
              />
              comunidad · habitantes
            </p>
            <h2 className="display-thin text-ocean-900 text-[clamp(2.5rem,6vw,5rem)] leading-[1.05]">
              Quienes <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] via-ocean-700 to-[#FF2DAA]">la habitan.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right">
            <p className="text-slate-500 text-base leading-relaxed font-light">
              Devs, diseñadores, founders, QAs. Todos suman al ecosistema. Acá una muestra de quiénes están.
            </p>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="max-w-3xl mx-auto px-6">
          <div className="bento-tile text-center text-slate-500">
            Todavía no hay perfiles públicos para mostrar — sé el primero en sumarte.
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="community-marquee flex gap-5 w-max px-6">
            {loopMembers.map((member, index) => (
              <article
                key={`${member.id}-${index}`}
                className="bento-tile w-[260px] flex-shrink-0 flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-ocean-200 shadow-md shadow-ocean-700/10 mb-4 bg-white">
                  <img
                    src={resolveAvatarDisplayUrl(member.avatar_url, member.full_name || member.id)}
                    alt={member.full_name || "Miembro"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3
                  className="font-display font-bold text-ocean-900 text-base truncate w-full"
                  title={member.full_name || "Miembro"}
                >
                  {member.full_name || "Miembro"}
                </h3>
                <p
                  className="text-slate-500 text-xs leading-relaxed mt-1 mb-4 one-line-ellipsis w-full"
                  title={member.bio || "Miembro de la comunidad"}
                >
                  {member.bio || "Miembro de la comunidad"}
                </p>
                {(member.github_url || member.linkedin_url || member.twitter_url) && (
                  <div className="flex items-center gap-1.5 mt-auto">
                    {normalizeExternalUrl(member.github_url) && (
                      <SmallChip href={normalizeExternalUrl(member.github_url)!} label="GitHub">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      </SmallChip>
                    )}
                    {normalizeExternalUrl(member.linkedin_url) && (
                      <SmallChip href={normalizeExternalUrl(member.linkedin_url)!} label="LinkedIn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </SmallChip>
                    )}
                    {normalizeExternalUrl(member.twitter_url) && (
                      <SmallChip href={normalizeExternalUrl(member.twitter_url)!} label="X">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </SmallChip>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function SmallChip({
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
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-ocean-200 bg-white text-slate-600 hover:text-ocean-700 hover:border-ocean-400 hover:bg-ocean-50 transition-colors"
    >
      {children}
    </a>
  );
}
