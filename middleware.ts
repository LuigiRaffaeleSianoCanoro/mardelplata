import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import {
  PROTECTED_PATH_PREFIXES,
  SESSION_MIDDLEWARE_MATCHER,
} from "@/lib/supabase/middleware-config";

export async function middleware(request: NextRequest) {
  return updateSession(request, {
    protectedPrefixes: [...PROTECTED_PATH_PREFIXES],
  });
}

export const config = {
  matcher: [...SESSION_MIDDLEWARE_MATCHER],
};
