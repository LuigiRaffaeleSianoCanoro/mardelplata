export default function CodeOfConduct() {
  return (
    <section id="reglamento" className="relative py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="relative bento-card overflow-hidden p-10 md:p-16">
          {/* Subtle accent — diagonal sand stroke (boat-drift + parallax) */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-sand-300/40 blur-[80px] pointer-events-none boat-drift-soft parallax-back" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-ocean-200/40 blur-[80px] pointer-events-none boat-drift-soft parallax-rise" style={{ animationDelay: "-4s" }} />

          <div className="relative grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-7">
              <span className="eyebrow">Cómo nos llevamos</span>
              <h2 className="display-h2 mt-5 text-ocean-900 text-[clamp(2.2rem,5vw,4rem)]">
                Un espacio <br />
                <span className="gradient-text">seguro e inclusivo.</span>
              </h2>
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mt-6 max-w-xl">
                Respeto mutuo, colaboración y aprendizaje compartido. Eso es todo lo que pedimos para que
                la comunidad funcione. Las 7 reglas están escritas en simple y se respetan.
              </p>
            </div>

            <div className="col-span-12 md:col-span-5 flex md:justify-end">
              <a
                href="/reglamento"
                className="cta-primary"
              >
                Leer reglamento
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
