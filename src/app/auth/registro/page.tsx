"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SIGNUP_RATE_LIMIT_COOLDOWN_MS = 60_000;
const SIGNUP_RATE_LIMIT_STORAGE_KEY = "auth-signup-rate-limit-until";
const SIGNUP_SUBMIT_GUARD_MS = 1_500;

type SupabaseAuthLikeError = {
  code?: string;
  status?: number;
  message: string;
};

function isRateLimitError(error: SupabaseAuthLikeError) {
  return (
    error.code === "over_email_send_rate_limit" ||
    error.status === 429 ||
    error.message.toLowerCase().includes("email rate limit exceeded")
  );
}

function getSignupErrorMessage(error: SupabaseAuthLikeError) {
  if (error.code === "over_email_send_rate_limit") {
    return "Ya enviamos un email de verificacion hace poco. Revisa tu inbox o spam, o espera un minuto antes de volver a intentar.";
  }

  if (error.status === 429) {
    return "El registro esta temporalmente saturado. Espera un momento y volve a intentar.";
  }

  return "No pudimos crear tu cuenta. Revisa los datos e intenta nuevamente.";
}

function readStoredCooldownUntil() {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(SIGNUP_RATE_LIMIT_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  const cooldownUntil = Number(rawValue);
  if (!Number.isFinite(cooldownUntil) || cooldownUntil <= Date.now()) {
    window.sessionStorage.removeItem(SIGNUP_RATE_LIMIT_STORAGE_KEY);
    return null;
  }

  return cooldownUntil;
}

function persistCooldownUntil(cooldownUntil: number | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (cooldownUntil) {
    window.sessionStorage.setItem(SIGNUP_RATE_LIMIT_STORAGE_KEY, String(cooldownUntil));
    return;
  }

  window.sessionStorage.removeItem(SIGNUP_RATE_LIMIT_STORAGE_KEY);
}

export default function RegistroPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);
  const submitGuardUntilRef = useRef(0);
  const router = useRouter();

  useEffect(() => {
    const storedCooldownUntil = readStoredCooldownUntil();
    if (storedCooldownUntil) {
      setCooldownUntil(storedCooldownUntil);
    }
  }, []);

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSecondsLeft(0);
      return;
    }

    const syncCooldown = () => {
      const millisecondsLeft = cooldownUntil - Date.now();
      if (millisecondsLeft <= 0) {
        setCooldownUntil(null);
        setCooldownSecondsLeft(0);
        persistCooldownUntil(null);
        return;
      }

      setCooldownSecondsLeft(Math.ceil(millisecondsLeft / 1000));
    };

    syncCooldown();
    const intervalId = window.setInterval(syncCooldown, 1000);

    return () => window.clearInterval(intervalId);
  }, [cooldownUntil]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) {
      return;
    }

    const now = Date.now();
    if (now < submitGuardUntilRef.current) {
      return;
    }

    submitGuardUntilRef.current = now + SIGNUP_SUBMIT_GUARD_MS;

    if (cooldownSecondsLeft > 0) {
      setError(`Espera ${cooldownSecondsLeft}s antes de volver a intentar el registro.`);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedFullName = fullName.trim();

    if (!normalizedFullName) {
      setError("Ingresa tu nombre completo.");
      return;
    }

    if (!normalizedEmail) {
      setError("Ingresa un email valido.");
      return;
    }

    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
        data: {
          full_name: normalizedFullName,
        },
      },
    });

    if (error) {
      if (isRateLimitError(error)) {
        const nextCooldownUntil = Date.now() + SIGNUP_RATE_LIMIT_COOLDOWN_MS;
        setCooldownUntil(nextCooldownUntil);
        persistCooldownUntil(nextCooldownUntil);
      }

      setError(getSignupErrorMessage(error));
      setLoading(false);
    } else {
      router.push("/auth/verificar");
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
              Unite a MdPDev
            </h1>
            <p className="text-ocean-200 text-sm">
              Crea tu perfil y conecta con la comunidad
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-ocean-200 mb-2">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-ocean-900/50 border border-ocean-600/40 rounded-xl text-white placeholder:text-ocean-400 focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:border-transparent transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {cooldownSecondsLeft > 0 && (
              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-100 px-4 py-3 rounded-xl text-sm">
                Revisa si ya te llego el email de verificacion. Podras intentar de nuevo en {cooldownSecondsLeft}s.
              </div>
            )}

            <button
              type="submit"
              disabled={loading || cooldownSecondsLeft > 0}
              className="w-full bg-ocean-400 hover:bg-ocean-300 disabled:bg-ocean-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all hover:shadow-lg hover:shadow-ocean-400/40"
            >
              {loading
                ? "Creando cuenta..."
                : cooldownSecondsLeft > 0
                  ? `Espera ${cooldownSecondsLeft}s`
                  : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-ocean-300 text-sm mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/auth/login" className="text-ocean-400 hover:text-ocean-200 font-medium transition-colors">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

