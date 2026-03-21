"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface Profile {
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  created_at: string;
}

export default function MemberPageClient({ qrCode }: { qrCode: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("full_name, bio, avatar_url, github_url, linkedin_url, twitter_url, created_at")
        .eq("qr_code", qrCode)
        .single();

      if (!data) {
        setNotFound(true);
      } else {
        setProfile(data);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [qrCode]);

  if (loading) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-ocean-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-ocean-300 text-lg mb-4">Miembro no encontrado</p>
          <Link href="/" className="text-ocean-400 hover:text-ocean-200 transition-colors font-medium text-sm">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-ocean-800/50 backdrop-blur-xl rounded-3xl p-8 border border-ocean-600/30 shadow-2xl">
          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-ocean-700/50 border-2 border-ocean-500/30">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || "Miembro"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ocean-300">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold text-white mb-1">
              {profile.full_name || "Miembro MdPDev"}
            </h1>
            {profile.bio && (
              <p className="text-ocean-200 text-sm mt-3">{profile.bio}</p>
            )}
          </div>

          {/* Social Links */}
          {(profile.github_url || profile.linkedin_url || profile.twitter_url) && (
            <div className="flex justify-center gap-4 mb-6">
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ocean-700/50 flex items-center justify-center text-ocean-300 hover:text-white hover:bg-ocean-600 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ocean-700/50 flex items-center justify-center text-ocean-300 hover:text-white hover:bg-ocean-600 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              )}
              {profile.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-ocean-700/50 flex items-center justify-center text-ocean-300 hover:text-white hover:bg-ocean-600 transition-all"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* Member badge */}
          <div className="bg-ocean-900/50 rounded-2xl p-4 border border-ocean-600/30">
            <div className="flex items-center justify-center gap-2 text-ocean-400 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <span className="text-sm font-medium">Miembro verificado</span>
            </div>
            <p className="text-ocean-300 text-xs text-center">
              Miembro desde {new Date(profile.created_at).toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Link to community */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-ocean-400 hover:text-ocean-200 transition-colors font-medium text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Conoce MdPDev
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
