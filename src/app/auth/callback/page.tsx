"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const supabase = createClient();
      const code = searchParams.get("code");
      const next = searchParams.get("next") ?? "/perfil";

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
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
  }, [searchParams, router]);

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
