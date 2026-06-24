"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { trackWhatsappClick } from "@/lib/analytics";

type TrackedOutboundLinkProps = ComponentPropsWithoutRef<"a"> & {
  children: ReactNode;
  trackSource: string;
};

/** Outbound link with GA4 whatsapp_click when href is WhatsApp. */
export default function TrackedOutboundLink({
  href,
  trackSource,
  onClick,
  children,
  ...props
}: TrackedOutboundLinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (href?.includes("whatsapp.com")) {
          trackWhatsappClick(trackSource);
        }
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
