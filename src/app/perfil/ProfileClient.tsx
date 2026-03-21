"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { QRCodeSVG } from "qrcode.react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  qr_code: string | null;
  bio: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  is_admin: boolean;
  created_at: string;
}

interface ProfileClientProps {
  user: User;
  profile: Profile | null;
  onRefresh?: () => void;
}

export default function ProfileClient({ user, profile, onRefresh }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(profile);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    bio: profile?.bio || "",
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    twitter_url: profile?.twitter_url || "",
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaveError(null);

    const qrCode = currentProfile?.qr_code || crypto.randomUUID();

    const { data: upserted, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          email: user.email,
          full_name: formData.full_name,
          bio: formData.bio,
          github_url: formData.github_url,
          linkedin_url: formData.linkedin_url,
          twitter_url: formData.twitter_url,
          qr_code: qrCode,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      setSaveError("Error al guardar el perfil. Por favor, intentá de nuevo.");
    } else {
      setCurrentProfile(upserted as Profile);
      setIsEditing(false);
      if (onRefresh) onRefresh();
    }
    setLoading(false);
  };

  const qrValue = currentProfile?.qr_code
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/miembro?code=${currentProfile.qr_code}`
    : "";

  return (
    <div className="min-h-screen hero-bg">
      {/* Header */}
      <header className="bg-ocean-800/80 backdrop-blur-md border-b border-ocean-600/30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-300 to-ocean-700 flex items-center justify-center">
              <SeaLionIcon />
            </div>
            <span className="font-display font-bold text-white">MdPDev</span>
          </Link>
          <div className="flex items-center gap-3">
            {currentProfile?.is_admin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 bg-ocean-600/50 hover:bg-ocean-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-ocean-300 hover:text-white transition-colors text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-ocean-800/50 backdrop-blur-xl rounded-3xl p-8 border border-ocean-600/30 shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-2xl font-display font-bold text-white">Mi Perfil</h1>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-ocean-400 hover:text-ocean-200 transition-colors text-sm font-medium"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                  </button>
                )}
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-ocean-700/50 border-2 border-ocean-500/30">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={formData.full_name || "Avatar"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ocean-300">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="8" r="4"/>
                            <path d="M20 21a8 8 0 1 0-16 0"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute inset-0 bg-ocean-900/70 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity"
                    >
                      <span className="text-white text-sm font-medium">
                        {uploadingAvatar ? "Subiendo..." : "Cambiar"}
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-ocean-200 mb-1">Nombre</label>
                        <input
                          type="text"
                          value={formData.full_name}
                          onChange={(e) => setFormData(f => ({ ...f, full_name: e.target.value }))}
                          className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-ocean-200 mb-1">Bio</label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData(f => ({ ...f, bio: e.target.value }))}
                          rows={3}
                          className="w-full px-4 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400 resize-none"
                          placeholder="Contanos sobre vos..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-ocean-200 mb-1">GitHub</label>
                          <input
                            type="url"
                            value={formData.github_url}
                            onChange={(e) => setFormData(f => ({ ...f, github_url: e.target.value }))}
                            className="w-full px-3 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white text-sm placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                            placeholder="URL de GitHub"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ocean-200 mb-1">LinkedIn</label>
                          <input
                            type="url"
                            value={formData.linkedin_url}
                            onChange={(e) => setFormData(f => ({ ...f, linkedin_url: e.target.value }))}
                            className="w-full px-3 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white text-sm placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                            placeholder="URL de LinkedIn"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ocean-200 mb-1">Twitter</label>
                          <input
                            type="url"
                            value={formData.twitter_url}
                            onChange={(e) => setFormData(f => ({ ...f, twitter_url: e.target.value }))}
                            className="w-full px-3 py-2 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white text-sm placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400"
                            placeholder="URL de Twitter"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="bg-ocean-400 hover:bg-ocean-300 disabled:bg-ocean-600 text-white font-medium py-2 px-6 rounded-xl transition-all"
                        >
                          {loading ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                          onClick={() => { setIsEditing(false); setSaveError(null); }}
                          className="text-ocean-300 hover:text-white transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                      {saveError && (
                        <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm">
                          {saveError}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          {currentProfile?.full_name || "Sin nombre"}
                        </h2>
                        <p className="text-ocean-300 text-sm">{currentProfile?.email || user.email}</p>
                      </div>
                      {currentProfile?.bio && (
                        <p className="text-ocean-200">{currentProfile.bio}</p>
                      )}
                      <div className="flex gap-3">
                        {currentProfile?.github_url && (
                          <a href={currentProfile.github_url} target="_blank" rel="noopener noreferrer" className="text-ocean-400 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {currentProfile?.linkedin_url && (
                          <a href={currentProfile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-ocean-400 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                        {currentProfile?.twitter_url && (
                          <a href={currentProfile.twitter_url} target="_blank" rel="noopener noreferrer" className="text-ocean-400 hover:text-white transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* QR Card */}
          <div>
            <div className="bg-ocean-800/50 backdrop-blur-xl rounded-3xl p-6 border border-ocean-600/30 shadow-2xl">
              <h2 className="text-lg font-display font-bold text-white mb-4 text-center">
                Tu QR de Miembro
              </h2>
              <div className="bg-white rounded-2xl p-4 mx-auto w-fit">
                {currentProfile?.qr_code ? (
                  <QRCodeSVG
                    value={qrValue}
                    size={180}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#03045E"
                  />
                ) : (
                  <div className="w-[180px] h-[180px] flex items-center justify-center text-ocean-400 text-xs text-center p-4">
                    Guardá tu perfil para generar tu QR
                  </div>
                )}
              </div>
              <p className="text-ocean-300 text-xs text-center mt-4">
                Mostrá este código en los eventos de la comunidad
              </p>
              <div className="mt-4 bg-ocean-900/50 rounded-xl p-3 text-center">
                <span className="text-ocean-400 font-mono text-sm">{currentProfile?.qr_code}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-ocean-800/50 backdrop-blur-xl rounded-3xl p-6 border border-ocean-600/30">
              <h3 className="text-lg font-display font-bold text-white mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-ocean-300">Miembro desde</span>
                  <span className="text-white font-medium">
                    {currentProfile?.created_at ? new Date(currentProfile.created_at).toLocaleDateString("es-AR", { month: "short", year: "numeric" }) : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-ocean-300">Eventos asistidos</span>
                  <span className="text-white font-medium">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SeaLionIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <ellipse cx="8" cy="7.5" rx="4" ry="3.5" stroke="white" strokeWidth="1.8" />
      <circle cx="7" cy="6.5" r="0.8" fill="white" />
      <path d="M11.5 8.5 C13 8 14 8.5 13.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 8 L14.5 7" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M11.5 9 L14.5 9.5" stroke="white" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M6 11 C5.5 13 6 15 7 16" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 16 C9 17.5 13 18 17 16.5 C19 15.5 20 13.5 18.5 12 C17 10.5 14 10.5 11 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 14.5 C3.5 15.5 3 17.5 5 18.5" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17.5 17 C19.5 16 21 17.5 19.5 19" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 17.5 C17 19.5 19 20.5 18 21.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
