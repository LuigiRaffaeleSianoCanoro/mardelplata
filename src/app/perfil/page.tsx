"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ProfileClient, { type Profile } from "./ProfileClient";
import type { User } from "@supabase/supabase-js";
import { IS_MOCK, mockUser, mockProfile } from "@/lib/devMock";
import AppShell from "@/components/app/AppShell";

export default function PerfilPage() {
  const [user, setUser] = useState<User | null>(null);
  // Antes era useState(null) y compilaba porque select("*") devolvia
  // tipo `any`. Al pasar a columnas explicitas el tipo se vuelve
  // concreto y hay que tiparlo explicito.
  const [profile, setProfile] = useState<Profile | null>(null);
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

    // Solo traemos las columnas que ProfileClient/AppShell usan, en vez
    // de select("*") — feedback Franco: el JSON tenia campos sobrantes
    // (ej. updated_at) y cualquier columna nueva del schema viajaba sola.
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, avatar_url, qr_code, bio, github_url, linkedin_url, twitter_url, is_admin, created_at",
      )
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
      <div className="perfil-x-error">
        <div className="shell-card perfil-x-error-card">
          <span className="perfil-x-error-icon" aria-hidden>⚠</span>
          <h2 className="shell-title" style={{ fontSize: "1.4rem" }}>Error de base de datos</h2>
          <p className="shell-lead" style={{ fontSize: "0.92rem" }}>
            La tabla de perfiles no está configurada correctamente. Ejecutá el script de
            configuración en el <strong>SQL Editor de Supabase</strong> y recargá la página.
          </p>
          <pre className="perfil-x-error-pre">{dbError}</pre>
          <p className="perfil-x-error-hint">
            Archivo: <code>scripts/001_create_profiles_and_events.sql</code>
          </p>
          <button
            type="button"
            onClick={async () => {
              setDbError(null);
              setLoading(true);
              await loadProfile();
            }}
            className="shell-btn-primary"
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
