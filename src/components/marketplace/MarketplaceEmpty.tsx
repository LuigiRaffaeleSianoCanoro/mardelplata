import Link from "next/link";

export default function MarketplaceEmpty({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="shell-card" style={{ textAlign: "center", padding: "2rem 1.2rem" }}>
      <h2 className="shell-card__title">{title}</h2>
      <p className="shell-card__desc" style={{ marginInline: "auto", maxWidth: "36rem" }}>
        {body}
      </p>
      <div style={{ marginTop: "1.1rem" }}>
        <Link className="shell-btn-primary" href={href}>
          {cta}
        </Link>
      </div>
    </div>
  );
}
