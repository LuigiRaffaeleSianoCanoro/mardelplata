"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// URL-driven open-sheet state. The query param (`?p=`, `?i=`, `?m=`) is the
// source of truth so that:
//   - copy/paste of the address bar reopens the same sheet
//   - the global CommandPalette can navigate with router.push and the
//     destination page picks it up reactively
//   - the back button works (router.replace keeps history sane)
//
// Returns a tuple `[slug, setSlug]`. Call setSlug(null) to close.

export function useSheetSlugParam(
  key: string,
): [string | null, (slug: string | null) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const slug = params?.get(key) ?? null;

  const setSlug = useCallback(
    (next: string | null) => {
      const u = new URLSearchParams(params?.toString() ?? "");
      if (next) u.set(key, next);
      else u.delete(key);
      const qs = u.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, params, key],
  );

  return [slug, setSlug];
}
