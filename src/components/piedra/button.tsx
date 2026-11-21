"use client";

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button as UiButton } from "@ui-sdk/react/button";
import { cn } from "@/lib/utils";

/**
 * Botón Piedra: comportamiento de @ui-sdk/react/button (pending, foco,
 * `render` para links) + estilos de la marca (Óxido en el ring, press 160ms).
 */
const buttonVariants = cva(
  "v3-press inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover-device:hover:bg-primary/90",
        destructive: "bg-destructive text-white hover-device:hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border border-border-strong bg-background hover-device:hover:bg-accent hover-device:hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover-device:hover:bg-secondary/80",
        ghost: "hover-device:hover:bg-accent hover-device:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-5 has-[>svg]:px-4",
        xl: "h-12 rounded-[10px] px-5 text-[15px]",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        "icon-xl": "size-12 rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = Omit<ComponentProps<typeof UiButton>, "className"> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    href?: string;
    target?: string;
    rel?: string;
  };

function Button({
  className,
  variant,
  size,
  href,
  target,
  rel,
  render,
  ...props
}: ButtonProps) {
  const resolvedRender =
    href && !render ? (
      <a href={href} target={target} rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)} />
    ) : (
      render
    );

  return (
    <UiButton
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      render={resolvedRender}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
