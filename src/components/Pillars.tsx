// Pillars — banner row con 3 propósitos: De la costa al mundo,
// Aprender haciendo, Juntos es mejor. Iconos PNG del icon-pack.

import Image from "next/image";

type Pillar = {
  title: string;
  desc: string;
  icon: string;
  glow: "violet" | "cyan" | "emerald";
};

export default function Pillars() {
  const pillars: Pillar[] = [
    {
      title: "De la costa al mundo",
      desc: "Conectamos Mar del Plata con oportunidades globales.",
      icon: "/icons/icon-network.png",
      glow: "emerald",
    },
    {
      title: "Aprender haciendo",
      desc: "Conocimiento práctico, compartido y abierto.",
      icon: "/icons/icon-code.png",
      glow: "violet",
    },
    {
      title: "Juntos es mejor",
      desc: "Colaboración, diversidad y comunidad.",
      icon: "/icons/icon-people.png",
      glow: "cyan",
    },
  ];

  return (
    <section className="pillars-x" aria-label="Propósitos">
      <div className="pillars-x-inner">
        {pillars.map((p) => (
          <div key={p.title} className="pillar-card" data-glow={p.glow}>
            <span className="pillar-card-icon">
              <Image
                src={p.icon}
                alt=""
                width={56}
                height={56}
                className="pillar-card-icon-img"
              />
            </span>
            <div className="pillar-card-body">
              <h3 className="pillar-card-title">{p.title}</h3>
              <p className="pillar-card-desc">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
