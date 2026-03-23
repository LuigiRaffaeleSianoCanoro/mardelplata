"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/perfil");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-ocean-800/50 backdrop-blur-xl rounded-3xl p-8 border border-ocean-600/30 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <Image
                src="/mdpdev.png"
                alt="MdPDev logo"
                width={48}
                height={48}
                className="rounded-2xl shadow-lg"
              />
            </Link>
            <h1 className="text-2xl font-display font-bold text-white mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-ocean-200 text-sm">
              Ingresa a tu cuenta de MdPDev
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ocean-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ocean-200 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ocean-400 hover:bg-ocean-300 disabled:bg-ocean-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-ocean-400/40"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="text-center text-ocean-300 text-sm mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/auth/registro" className="text-ocean-400 hover:text-ocean-200 font-medium transition-colors">
              Registrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

