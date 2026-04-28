"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AppSidebar, { type AppSidebarUser } from "./AppSidebar";
import CommandPalette from "./CommandPalette";
import { createClient } from "@/lib/supabase/client";
import { IS_MOCK, mockProfile } from "@/lib/devMock";

interface AppShellProps {
  isAdmin?: boolean;
  /** Optional pre-fetched profile from a server component / page. When the
   *  containing page already loaded it (e.g. /perfil), pass it through to
   *  avoid a duplicate request. Otherwise the shell fetches a thin slice
   *  itself (qr_code, full_name, email, created_at, is_admin). */
  user?: AppSidebarUser | null;
  children: ReactNode;
}

export default function AppShell({ isAdmin, user: userProp, children }: AppShellProps) {
  const pathname = usePathname();
  const [scanning, setScanning] = useState(true);
  const [user, setUser] = useState<AppSidebarUser | null>(userProp ?? null);
  const [resolvedAdmin, setResolvedAdmin] = useState<boolean>(Boolean(isAdmin));
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Cmd+K / Ctrl+K toggles the global command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => setScanning(false), 1100);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (userProp) return;
    let cancelled = false;

    const load = async () => {
      if (IS_MOCK) {
        if (cancelled) return;
        setUser({
          fullName: mockProfile.full_name,
          email: mockProfile.email,
          qrCode: mockProfile.qr_code,
          memberSince: mockProfile.created_at,
        });
        setResolvedAdmin(mockProfile.is_admin);
        return;
      }
      try {
        const supabase = createClient();
        const { data: auth } = await supabase.auth.getUser();
        const authUser = auth?.user;
        if (!authUser) return;
        const { data } = await supabase
          .from("profiles")
          .select("full_name, email, qr_code, is_admin, created_at")
          .eq("id", authUser.id)
          .maybeSingle();
        if (cancelled) return;
        setUser({
          fullName: data?.full_name ?? authUser.user_metadata?.full_name ?? null,
          email: data?.email ?? authUser.email ?? null,
          qrCode: data?.qr_code ?? null,
          memberSince: data?.created_at ?? authUser.created_at ?? null,
        });
        if (typeof data?.is_admin === "boolean") setResolvedAdmin(data.is_admin);
      } catch {}
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [userProp]);

  return (
    <div className="min-h-screen app-canvas">
      {/* Sidebar lives outside the keyed wrapper, so it never re-mounts on
          route changes — feels like a fixed skeleton with the content panel
          swapping underneath. */}
      <AppSidebar
        isAdmin={resolvedAdmin}
        user={user}
        onOpenSearch={() => setPaletteOpen(true)}
      />
      <div key={pathname} className="app-shell-content shell-content-fade">
        {children}
      </div>
      {scanning && <div className="shell-scan-line" aria-hidden="true" />}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
