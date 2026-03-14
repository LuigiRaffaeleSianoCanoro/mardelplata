const members = [
  {
    initials: "AC",
    name: "Ana Castillo",
    role: "Fundadora",
    bio: "Full Stack Engineer · UNMDP",
    badge: "⭐ Fundadora",
    badgeBg: "bg-ocean-100 text-ocean-700",
    avatarFrom: "from-ocean-400",
    avatarTo: "to-ocean-800",
    shadowColor: "shadow-ocean-600/30",
  },
  {
    initials: "MB",
    name: "Martín Bianchi",
    role: "Administrador",
    bio: "Dev Evangelist · Co-founder CoastalCode",
    badge: "🛠️ Administrador",
    badgeBg: "bg-teal-100 text-teal-700",
    avatarFrom: "from-teal-400",
    avatarTo: "to-ocean-700",
    shadowColor: "shadow-teal-600/30",
  },
  {
    initials: "LR",
    name: "Lucía Rodríguez",
    role: "Administradora",
    bio: "UX Designer · Project Manager",
    badge: "🎯 Administradora",
    badgeBg: "bg-cyan-100 text-cyan-700",
    avatarFrom: "from-cyan-400",
    avatarTo: "to-blue-700",
    shadowColor: "shadow-cyan-600/30",
  },
];

export default function Team() {
  return (
    <section id="staff" className="py-20 px-6 ocean-tint">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-ocean-200/60 text-ocean-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
            👥 El equipo
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ocean-900 mb-4">
            Quiénes Somos
          </h2>
          <p className="text-slate-600 text-lg max-w-md mx-auto">
            El equipo detrás de la organización de MdPDev.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {members.map((m) => (
            <div
              key={m.name}
              className="group bg-white rounded-3xl p-7 text-center border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-ocean-600/10"
            >
              <div
                className={`w-20 h-20 rounded-full bg-linear-to-br ${m.avatarFrom} ${m.avatarTo} flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold font-display shadow-lg ${m.shadowColor}`}
              >
                {m.initials}
              </div>
              <span className={`inline-flex items-center gap-1 ${m.badgeBg} rounded-full px-3 py-1 text-xs font-semibold mb-3`}>
                {m.badge}
              </span>
              <h3 className="font-display font-bold text-lg text-slate-800">{m.name}</h3>
              <p className="text-ocean-600 font-medium text-sm mb-1">{m.role}</p>
              <p className="text-slate-400 text-xs">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
