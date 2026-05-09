"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IS_MOCK } from "@/lib/devMock";
import LoginShell from "@/components/app/LoginTransition";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!transitioning) return;
    const t = window.setTimeout(() => {
      router.push("/perfil");
      router.refresh();
    }, 1300);
    return () => window.clearTimeout(t);
  }, [transitioning, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (IS_MOCK) {
      setTransitioning(true);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setTransitioning(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden app-canvas">
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md flip-perspective">
          <div className={`flip-card ${transitioning ? "flipped" : ""}`}>
            {/* Front face — formulario */}
            <div className="flip-face glass-card glass-card-amber p-9">
              <div className="text-center mb-9">
                <Link href="/" className="inline-flex items-center gap-2 mb-6">
                  <span className="metal-chip w-12 h-12 rounded-2xl">
                    <Image
                      src="/mdpdev.png"
                      alt="MdPDev logo"
                      width={28}
                      height={28}
                      className="opacity-90"
                    />
                  </span>
                </Link>
                <p className="kicker kicker-amber mb-3 flex items-center justify-center gap-2">
                  <span className="dot-amber" />
                  acceso · bearing 000°
                </p>
                <h1 className="display-thin text-white text-2xl mb-2">
                  Bienvenido de vuelta
                </h1>
                <p className="text-white/55 text-sm font-light">
                  Ingresá a tu cuenta de MdPDev
                </p>
                <p className="coord-line mt-3">
                  MDP <span className="sep">·</span> <span className="num">38°00&apos;S</span> <span className="sep">·</span> <span className="num">057°33&apos;W</span>
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="kicker mb-2 block">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-ink-1/80 border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-neon-amber/40 focus:shadow-[inset_0_0_18px_rgba(59,130,246,0.05)] transition-all"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="kicker mb-2 block">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-ink-1/80 border border-white/[0.06] rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-neon-amber/40 focus:shadow-[inset_0_0_18px_rgba(59,130,246,0.05)] transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-[rgba(255,45,170,0.08)] border border-[rgba(255,45,170,0.32)] text-white/85 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-app-primary w-full"
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>
              </form>

              <p className="text-center text-white/45 text-sm mt-7 font-light">
                ¿No tenés cuenta?{" "}
                <Link href="/auth/registro" className="text-neon-amber/85 hover:text-neon-amber font-normal transition-colors">
                  Registrate
                </Link>
              </p>
            </div>

            {/* Back face — shell */}
            <div className="flip-face flip-face-back">
              {transitioning && <LoginShell />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
