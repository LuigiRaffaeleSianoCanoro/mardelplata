import type { ReactNode } from "react";
import AppShell from "@/components/app/AppShell";

export default function RedLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
