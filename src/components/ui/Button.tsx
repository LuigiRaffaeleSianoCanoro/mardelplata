import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-app-primary shimmer-x-target",
  ghost: "btn-app-ghost",
  danger: "btn-app-danger",
};

const sizeClass: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "",
  lg: "text-base px-6 py-3",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function buildClassName(variant: Variant, size: Size, extra?: string) {
  return [variantClass[variant], sizeClass[size], extra].filter(Boolean).join(" ");
}

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin"
    />
  );
}

export default function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", loading, className, children } = props;
  const cls = buildClassName(variant, size, className);

  if ("href" in props && props.href !== undefined) {
    const { variant: _v, size: _s, loading: _l, className: _c, children: _ch, href, ...rest } = props;
    void _v; void _s; void _l; void _c; void _ch;
    return (
      <Link href={href} className={cls} {...rest}>
        {loading ? <Spinner /> : null}
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, loading: _l, className: _c, children: _ch, disabled, ...rest } =
    props as ButtonAsButton;
  void _v; void _s; void _l; void _c; void _ch;
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
