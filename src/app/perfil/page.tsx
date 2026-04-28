"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileClient from "./ProfileClient";
import type { User } from "@supabase/supabase-js";
import { IS_MOCK, mockUser, mockProfile } from "@/lib/devMock";
import AppShell from "@/components/app/AppShell";

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    if (IS_MOCK) {
      setUser(mockUser);
      setProfile(mockProfile as never);
      setDbError(null);
      setLoading(false);
      return;
    }
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // PGRST116 means "no rows found" — the user just hasn't saved a profile yet.
    // Any other error (especially 500s) means the database schema is broken.
    if (profileError && profileError.code !== "PGRST116") {
      console.error("[perfil] Error fetching profile:", profileError);
      setDbError(profileError.message);
    } else {
      setDbError(null);
    }

    setUser(user);
    setProfile(profile);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading || !user) {
    return (
      <div className="min-h-screen app-canvas flex flex-col items-center justify-center gap-5">
        <div className="sonar-loader">
          <span className="grid" />
          <span className="sweep" />
          <span className="ring" />
          <span className="ring delay" />
          <span className="core" />
        </div>
        <p className="coord-line">
          PINGING <span className="sep">·</span> <span className="num">38°00&apos;S 057°33&apos;W</span> <span className="sep">·</span> <span className="num">DEPTH&nbsp;1200m</span>
        </p>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-ocean-800/60 backdrop-blur-xl rounded-3xl p-8 border border-red-500/40 shadow-2xl text-center space-y-4">
          <div className="text-red-300 text-4xl">⚠️</div>
          <h2 className="text-xl font-bold text-white">Error de base de datos</h2>
          <p className="text-ocean-200 text-sm">
            La tabla de perfiles no está configurada correctamente. Por favor ejecutá el script
            de configuración en el{" "}
            <strong>SQL Editor de Supabase</strong> y recargá la página.
          </p>
          <pre className="bg-ocean-900/70 text-red-300 text-xs rounded-xl px-4 py-3 text-left overflow-x-auto whitespace-pre-wrap break-words">
            {dbError}
          </pre>
          <p className="text-ocean-300 text-xs">
            Archivo: <code className="text-ocean-200">scripts/001_create_profiles_and_events.sql</code>
          </p>
          <button
            onClick={async () => {
              setDbError(null);
              setLoading(true);
              await loadProfile();
            }}
            className="mt-2 bg-ocean-500 hover:bg-ocean-400 text-white font-medium py-2 px-6 rounded-xl transition-all"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const isAdmin = Boolean((profile as { is_admin?: boolean } | null)?.is_admin);

  return (
    <AppShell isAdmin={isAdmin}>
      <ProfileClient user={user} profile={profile} onRefresh={loadProfile} />
    </AppShell>
  );
}
