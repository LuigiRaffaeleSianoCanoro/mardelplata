import type { ReactNode } from "react";
import { AuthChrome } from "@/components/v3/AuthChrome";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthChrome>{children}</AuthChrome>;
}
