import { cn } from "@/lib/utils";
import { BRAND, BRAND_NAME, BRAND_TLD } from "@/lib/v3/brand";

/**
 * Logo del lobo marino. Un solo lugar para cambiar de marca:
 * - `rambla` (01): silueta del lobo de la Rambla sentado → logo principal.
 * - `ficha`  (03): tile tipo app-icon con el lobo en negativo → favicon/avatar.
 * Para probar otra variante alcanza con cambiar `PRIMARY_MARK`.
 */
export type MarkVariant = "rambla" | "ficha";
export const PRIMARY_MARK: MarkVariant = "rambla";

const PATHS: Record<MarkVariant, string> = {
  rambla:
    "M 2.60 47.60 C 4.00 46.40 6.00 46.80 7.60 48.00 C 9.20 49.20 10.60 50.40 12.60 50.80 C 18.20 49.60 22.80 46.40 26.20 42.00 C 30.20 36.80 31.60 31.20 32.20 26.00 C 33.00 18.00 38.00 12.60 44.60 12.40 C 48.20 12.30 50.80 13.40 52.60 14.80 C 54.20 14.00 56.20 13.40 57.80 14.00 C 59.60 14.80 59.60 17.80 57.80 18.80 C 55.40 20.20 52.40 20.80 49.80 22.60 C 46.60 26.40 46.00 31.60 47.80 36.60 C 49.60 41.40 49.40 46.00 48.00 48.60 C 51.00 49.60 54.20 50.80 56.80 52.60 C 58.80 53.30 58.40 55.00 56.60 55.00 L 14.60 55.00 C 9.60 55.00 5.40 52.60 3.00 49.80 C 2.40 49.10 2.20 48.20 2.60 47.60 Z M43.00 17.60 a2.20 2.20 0 1 0 4.40 0 a2.20 2.20 0 1 0 -4.40 0 Z",
  ficha:
    "M16 4 H48 A12 12 0 0 1 60 16 V48 A12 12 0 0 1 48 60 H16 A12 12 0 0 1 4 48 V16 A12 12 0 0 1 16 4 Z M 7.14 49.97 C 8.29 48.99 9.93 49.32 11.24 50.30 C 12.55 51.28 13.70 52.27 15.34 52.60 C 19.93 51.61 23.70 48.99 26.49 45.38 C 29.77 41.12 30.92 36.52 31.41 32.26 C 32.07 25.70 36.17 21.27 41.58 21.11 C 44.53 21.03 46.66 21.93 48.14 23.08 C 49.45 22.42 51.09 21.93 52.40 22.42 C 53.88 23.08 53.88 25.54 52.40 26.36 C 50.44 27.50 47.98 28.00 45.84 29.47 C 43.22 32.59 42.73 36.85 44.20 40.95 C 45.68 44.89 45.52 48.66 44.37 50.79 C 46.83 51.61 49.45 52.60 51.58 54.07 C 53.22 54.65 52.90 56.04 51.42 56.04 L 16.98 56.04 C 12.88 56.04 9.44 54.07 7.47 51.78 C 6.98 51.20 6.81 50.46 7.14 49.97 Z M40.17 25.37 a1.90 1.90 0 1 0 3.80 0 a1.90 1.90 0 1 0 -3.80 0 Z",
};

export function LogoMark({
  variant = PRIMARY_MARK,
  className,
  title,
}: {
  variant?: MarkVariant;
  className?: string;
  /** Si se pasa, el SVG deja de ser decorativo. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className={cn("size-[26px] shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path fillRule="evenodd" d={PATHS[variant]} />
    </svg>
  );
}

/** Lockup: marca + «mardelplata» (Geist 600) + «.dev.ar» (Geist Mono, apagado). */
export function Lockup({
  className,
  textClassName,
  markClassName,
  variant = PRIMARY_MARK,
}: {
  className?: string;
  textClassName?: string;
  markClassName?: string;
  variant?: MarkVariant;
}) {
  return (
    <span className={cn("flex items-center gap-2 select-none", className)} aria-label={BRAND} role="img">
      <LogoMark variant={variant} className={markClassName} />
      <span aria-hidden className={cn("text-[15px] font-semibold tracking-[-0.035em] text-foreground", textClassName)}>
        {BRAND_NAME}
        <span className="font-mono font-normal tracking-[-0.04em] text-muted-foreground">{BRAND_TLD}</span>
      </span>
    </span>
  );
}
