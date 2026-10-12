import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cn } from "@/lib/utils";

/** Marco público Piedra: header + footer + main scrolleable. */
export function PageFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <Navbar />
      <main className={cn("relative z-10 mx-auto w-full max-w-[1100px] flex-1 px-4 pb-16 pt-10 lg:px-6 lg:pb-24 lg:pt-14", className)}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <header className={cn("mb-10 max-w-3xl lg:mb-14", align === "center" && "mx-auto text-center")}>
      {eyebrow ? (
        <p className="v3-label mb-3 text-muted-foreground">{eyebrow}</p>
      ) : null}
      <h1 className="text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.045em] leading-[1.05] text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground lg:text-[16px]">{description}</p>
      ) : null}
    </header>
  );
}

export function PageSection({
  title,
  muted,
  children,
  className,
}: {
  title?: string;
  muted?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-12 lg:mb-16", className)}>
      {title ? (
        <h2
          className={cn(
            "mb-5 font-mono text-[11px] font-medium tracking-[0.08em] uppercase",
            muted ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
      ) : null}
      {children}
    </section>
  );
}
