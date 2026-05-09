"use client";

import { useEffect, useState } from "react";
import { IS_MOCK, mockUser } from "@/lib/devMock";
import { createClient } from "@/lib/supabase/client";

// Tiny hook used by Red sheets and dialogs. Returns the current user id,
// or "" while loading / when signed out. In mock mode resolves immediately
// to the demo user so the dev experience matches the real flow.

export function useCurrentUserId(): string {
  const [userId, setUserId] = useState<string>(IS_MOCK ? mockUser.id : "");

  useEffect(() => {
    if (IS_MOCK) return;
    let cancelled = false;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUserId(data?.user?.id ?? "");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return userId;
}
