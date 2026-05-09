"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { IS_MOCK } from "@/lib/devMock";
import AppShell from "@/components/app/AppShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      if (IS_MOCK) {
        setAuthorized(true);
        setLoading(false);
        return;
      }
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/auth/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) {
        router.replace("/perfil");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    }

    checkAdmin();
  }, [router]);

  if (loading || !authorized) {
    return (
      <div className="min-h-screen app-canvas flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-ocean-300/30 border-t-ocean-300 animate-spin" />
      </div>
    );
  }

  // Envolvemos en AppShell para tener el bottom bar mobile coherente
  // con /perfil y /red. isAdmin=true porque el chequeo de arriba ya
  // garantiza que estamos en /admin como admin.
  return <AppShell isAdmin>{children}</AppShell>;
}
