import type { ReactNode } from "react";
import { PageFrame } from "@/components/v3/Page";
import GuiaSubnav from "@/components/guia/GuiaSubnav";

export default function GuiaLayout({ children }: { children: ReactNode }) {
  return (
    <PageFrame>
      <GuiaSubnav />
      {children}
    </PageFrame>
  );
}
