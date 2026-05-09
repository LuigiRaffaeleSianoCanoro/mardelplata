import type { HTMLAttributes, ReactNode } from "react";

type Tone = "default" | "tight";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: Tone;
  as?: "div" | "section" | "article" | "aside";
  children: ReactNode;
};

export default function GlassCard({
  tone = "default",
  as: Tag = "div",
  className,
  children,
  ...rest
}: GlassCardProps) {
  const cls = ["glass-card", tone === "tight" ? "glass-card-tight" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}
