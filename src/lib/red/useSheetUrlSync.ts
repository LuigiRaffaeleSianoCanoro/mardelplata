"use client";

import { useEffect } from "react";

// Reflects the currently-open sheet slug into the URL via history.replaceState
// so that copy/pasting the address bar gives back the open sheet. Uses
// replaceState (not pushState) so the back button doesn't have to walk through
// every sheet a user opened during the session.

export function useSheetUrlSync(paramKey: string, slug: string | null) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const current = url.searchParams.get(paramKey);
    if (slug) {
      if (current === slug) return;
      url.searchParams.set(paramKey, slug);
    } else {
      if (current === null) return;
      url.searchParams.delete(paramKey);
    }
    window.history.replaceState(null, "", url.toString());
  }, [paramKey, slug]);
}
