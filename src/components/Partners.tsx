import partners from "@/content/partners.json";

export default function Partners() {
  return (
    <section className="shell-section shell-section--soft" aria-label="Socios y aliados">
      <div className="shell-inner">
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <p className="shell-eyebrow">ALIADOS DEL ECOSISTEMA</p>
          <h2 className="shell-title">
            Socios y <em>colaboradores.</em>
          </h2>
        </div>
        <div
          style={{
            overflow: "hidden",
            maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          }}
        >
          <div className="partners-marquee-track">
            {[...partners, ...partners].map((p, i) => (
              <a
                key={`${p.name}-${i}`}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shell-tag shell-tag--violet"
                style={{
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  padding: "0.5rem 1.2rem",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
