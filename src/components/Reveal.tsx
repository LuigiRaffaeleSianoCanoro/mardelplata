"use client";

// Reveal — fade+up cuando el elemento entra al viewport.
// Wrapper genérico: <Reveal delay={100}><Section /></Reveal>
// Respeta prefers-reduced-motion vía CSS.

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  delay?: number; // ms
  threshold?: number;
  className?: string;
  as?: "div" | "section";
};

export default function Reveal({
  children,
  delay = 0,
  threshold = 0.12,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement & HTMLElement>}
      className={`reveal ${seen ? "reveal--in" : ""} ${className}`}
      style={{ transitionDelay: seen ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
