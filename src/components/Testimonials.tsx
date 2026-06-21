import testimonials from "@/content/testimonials.json";

const AVATAR_MAP = [
  "/avatars/tech-01.svg",
  "/avatars/tech-02.svg",
  "/avatars/tech-03.svg",
  "/avatars/tech-04.svg",
];

export default function Testimonials() {
  return (
    <section className="shell-section" aria-label="Testimonios de la comunidad">
      <div className="shell-inner">
        <div style={{ textAlign: "center", marginBottom: "1.8rem" }}>
          <p className="shell-eyebrow">LA COMUNIDAD OPINA</p>
          <h2 className="shell-title">
            Voces del <em>ecosistema.</em>
          </h2>
        </div>
        <div className="shell-grid shell-grid--auto-280">
          {testimonials.map((t, i) => (
            <div key={t.name} className="shell-card" style={{ gap: "0.8rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <img
                  src={AVATAR_MAP[i % AVATAR_MAP.length]}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-lg"
                  style={{ borderRadius: "10px", flexShrink: 0 }}
                />
                <div>
                  <p className="shell-card__title" style={{ margin: 0, fontSize: "0.95rem" }}>
                    {t.name}
                  </p>
                  <p className="shell-card__meta" style={{ margin: 0, fontSize: "0.75rem" }}>
                    {t.role}
                  </p>
                </div>
              </div>
              <p className="shell-card__desc" style={{ fontStyle: "italic", opacity: 0.85 }}>
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
