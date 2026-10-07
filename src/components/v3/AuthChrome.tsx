"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND } from "@/lib/v3/brand";
import { Lockup } from "./Logo";
import { PiedraRoot } from "./Chrome";

export function AuthChrome({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
      <PiedraRoot page />
      <header className="relative z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
        <Link href="/" className="flex min-h-11 items-center rounded-lg" aria-label={`${BRAND} — inicio`}>
          <Lockup />
        </Link>
        <Link href="/" className="text-[13px] text-muted-foreground hover:text-foreground">
          Volver al inicio
        </Link>
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">{children}</main>
    </div>
  );
}
