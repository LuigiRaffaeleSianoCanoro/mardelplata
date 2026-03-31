"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const pendingCodeExchanges = new Map<string, Promise<void>>();
const completedCodeExchanges = new Set<string>();

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/perfil";
  }

  return next;
}

async function exchangeCodeOnce(code: string) {
  if (completedCodeExchanges.has(code)) {
    return;
  }

  const existingExchange = pendingCodeExchanges.get(code);
  if (existingExchange) {
    await existingExchange;
    return;
  }

  const supabase = createClient();
  const exchangePromise = supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
    if (error) {
      throw error;
    }

    completedCodeExchanges.add(code);
  });

  pendingCodeExchanges.set(code, exchangePromise);

  try {
    await exchangePromise;
  } finally {
    pendingCodeExchanges.delete(code);
  }
}

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const hasHandledCallback = useRef(false);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));

  useEffect(() => {
    if (hasHandledCallback.current) {
      return;
    }

    hasHandledCallback.current = true;

    async function handleCallback() {
      const supabase = createClient();

      if (code) {
        try {
          await exchangeCodeOnce(code);
        } catch (exchangeError) {
          if (exchangeError instanceof Error) {
            setError(exchangeError.message);
            return;
          }

          setError("No se pudo completar la verificacion. Por favor, intentá de nuevo.");
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("No se pudo verificar la sesión. Por favor, intentá de nuevo.");
        return;
      }

      // Ensure profile exists (creates one if the DB trigger hasn't run)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? "",
          qr_code: crypto.randomUUID(),
        });
        if (insertError) {
          // Non-fatal: the user is authenticated; they can still complete their
          // profile from the /perfil page which also handles upserts.
          console.error("Error creating profile:", insertError.message);
        }
      }

      router.replace(next);
    }

    handleCallback();
  }, [code, next, router]);

  if (error) {
    return (
      <div className="min-h-screen hero-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-300 text-lg mb-4">{error}</p>
          <a
            href="/auth/login"
            className="text-ocean-400 hover:text-ocean-200 transition-colors font-medium text-sm"
          >
            Volver al login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-ocean-500 border-t-transparent animate-spin" />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen hero-bg flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-ocean-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
