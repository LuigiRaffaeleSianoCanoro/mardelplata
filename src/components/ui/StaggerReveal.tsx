import type { ReactNode } from "react";
import { Children } from "react";

interface StaggerRevealProps {
  /** Delay before the first child reveals, in ms. */
  baseDelay?: number;
  /** Delay between each child, in ms. */
  stagger?: number;
  /** Animation class — "fade-up" (default) or "count-up". */
  animation?: "fade-up" | "count-up" | "tab-in";
  className?: string;
  children: ReactNode;
}

export default function StaggerReveal({
  baseDelay = 0,
  stagger = 70,
  animation = "fade-up",
  className,
  children,
}: StaggerRevealProps) {
  const items = Children.toArray(children);
  return (
    <>
      {items.map((child, i) => (
        <div
          key={i}
          className={[animation, className].filter(Boolean).join(" ")}
          style={{ animationDelay: `${baseDelay + i * stagger}ms` }}
        >
          {child}
        </div>
      ))}
    </>
  );
}
