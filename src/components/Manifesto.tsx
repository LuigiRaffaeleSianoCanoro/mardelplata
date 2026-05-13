// Manifesto — "Tecnología con propósito, comunidad con valores".
// Layout: bloque con eyebrow + título serif a la izquierda y 4 valores
// inline (icono + título + bajada) a la derecha, con onda decorativa.
import Image from "next/image";

type Valor = {
  title: string;
  desc: string;
  icon: string;
  glow: "violet" | "cyan" | "emerald" | "sky";
};

export default function Manifesto() {
  const valores: Valor[] = [
    {
      title: "Inclusiva",
      desc: "Espacio seguro y diverso donde todas las voces suman.",
      icon: "/icons/icon-heart-community.png",
      glow: "cyan",
    },
    {
      title: "Abierta",
      desc: "Compartimos conocimiento y recursos sin fronteras ni barreras.",
      icon: "/icons/icon-book.png",
      glow: "violet",
    },
    {
      title: "Sostenible",
      desc: "Construimos soluciones que cuidan nuestra ciudad y el planeta.",
      icon: "/icons/icon-wave.png",
      glow: "emerald",
    },
    {
      title: "Local y global",
      desc: "Raíces en Mar del Plata, mirada puesta en el mundo.",
      icon: "/icons/icon-lighthouse.png",
      glow: "sky",
    },
  ];

  return (
    <section className="manifesto-x" id="manifiesto">
      <div className="manifesto-x-inner">
        <div className="manifesto-x-wave" aria-hidden>
          <Image
            src="/manifesto-bg.webp"
            alt=""
            fill
            quality={65}
            sizes="100vw"
            className="manifesto-x-wave-img"
          />
        </div>
        <div className="manifesto-x-content">
          <header className="manifesto-x-header">
            <p className="manifesto-x-eyebrow">NUESTRO MANIFESTO</p>
            <h2 className="manifesto-x-title">
              Tecnología con propósito,
              <br />
              comunidad con <em>valores.</em>
            </h2>
          </header>
          <div className="manifesto-x-values">
            {valores.map((v) => (
              <div key={v.title} className="valor-card" data-glow={v.glow}>
                <span className="valor-card-icon">
                  <Image src={v.icon} alt="" width={52} height={52} className="valor-card-icon-img" />
                </span>
                <h3 className="valor-card-title">{v.title}</h3>
                <p className="valor-card-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
