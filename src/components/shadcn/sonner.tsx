"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

/**
 * shadcn/ui Toaster. El tema lo pasa el shell v3 (no usamos next-themes:
 * el resto del sitio es dark-only y no queremos tocar <html> globalmente).
 */
const Toaster = ({ theme = "dark", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border-strong)",
          "--border-radius": "10px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-sans border-l-2 !border-l-[var(--oxido)]",
          description: "!text-muted-foreground font-mono !text-[11px]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
