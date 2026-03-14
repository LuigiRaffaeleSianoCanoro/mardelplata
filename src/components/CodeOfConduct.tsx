export default function CodeOfConduct() {
  return (
    <section id="reglamento" className="py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-ocean-50 text-ocean-700 rounded-full px-4 py-2 text-sm font-semibold mb-5">
          📋 Código de Conducta
        </div>
        <h2 className="font-display font-bold text-3xl md:text-4xl text-ocean-900 mb-4">
          Reglamento de la Comunidad
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          En MdPDev creemos en un espacio seguro, inclusivo y respetuoso para todos los miembros. La
          comunidad se basa en el respeto mutuo, la colaboración y el aprendizaje compartido.
        </p>
        <a
          href="/reglamento"
          className="inline-flex items-center gap-2 bg-ocean-800 hover:bg-ocean-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:shadow-xl hover:shadow-ocean-800/30"
        >
          Leer código de conducta completo →
        </a>
      </div>
    </section>
  );
}
