"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileClient from "./ProfileClient";
import type { User } from "@supabase/supabase-js";

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
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
      <div className="min-h-screen hero-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-ocean-500 border-t-transparent animate-spin" />
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

  return <ProfileClient user={user} profile={profile} onRefresh={loadProfile} />;
}
