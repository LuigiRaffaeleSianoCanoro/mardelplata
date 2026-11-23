export type GuiaGroup =
  | "empezar"
  | "ecosistema"
  | "ciudad"
  | "contexto";

export type GuiaPageMeta = {
  slug: string;
  title: string;
  description: string;
  navLabel: string;
  group: GuiaGroup;
  eyebrow: string;
};

export const GUIA_REVISED = "23 de noviembre de 2026";
export const GUIA_WHATSAPP_MEMBERS = 850;
export const GUIA_WHATSAPP_CONFIRMED = "27 de octubre de 2026";

export const GUIA_GROUPS: { id: GuiaGroup; label: string }[] = [
  { id: "empezar", label: "Empezá por acá" },
  { id: "ecosistema", label: "El ecosistema" },
  { id: "ciudad", label: "La ciudad" },
  { id: "contexto", label: "Contexto" },
];

export const GUIA_PAGES: GuiaPageMeta[] = [
  {
    slug: "comunidades",
    title: "Comunidades tech de Mar del Plata",
    description:
      "Dónde está la gente: mardelplata.dev.ar, GameDev MDQ, IxDF, IEEE UNMdP y lo que todavía no existe en público.",
    navLabel: "Comunidades",
    group: "empezar",
    eyebrow: "La puerta de entrada",
  },
  {
    slug: "calendario",
    title: "Calendario tech del año en Mar del Plata",
    description:
      "De la Global Game Jam a la Tech Week. El año público se concentra de marzo a noviembre.",
    navLabel: "Calendario",
    group: "empezar",
    eyebrow: "El año, mes a mes",
  },
  {
    slug: "coworkings",
    title: "Coworkings en Mar del Plata",
    description:
      "Indie, Bix y Line Up, con dirección y el precio que se pudo citar. Más las salas donde se junta la comunidad.",
    navLabel: "Coworkings",
    group: "empezar",
    eyebrow: "Una mesa para mañana",
  },
  {
    slug: "por-que-mdp",
    title: "¿Por qué Mar del Plata?",
    description:
      "Tercer polo tech del país, con números citados y tres casos que ya pasaron: Globant, Innova Space y Roomix.",
    navLabel: "Por qué MdP",
    group: "ecosistema",
    eyebrow: "El tamaño, con fuente",
  },
  {
    slug: "ia",
    title: "IA en Mar del Plata",
    description:
      "El clúster de inteligencia artificial, casos con fuente, formación y lo que dejó la Tech Week 2026.",
    navLabel: "IA",
    group: "ecosistema",
    eyebrow: "El clúster frente al mar",
  },
  {
    slug: "empresas",
    title: "Empresas y startups de Mar del Plata",
    description:
      "Cómo leer el directorio: socio de ATICMA no es lo mismo que oficina en la ciudad. Link a la bolsa de mardelplata.dev.ar.",
    navLabel: "Empresas",
    group: "ecosistema",
    eyebrow: "Quién labura acá",
  },
  {
    slug: "programas",
    title: "Programas, incubadoras y premios",
    description:
      "ATICMA Emprende, Impulso Líder, Atlantis, Neutrón, UCIP, INTECMAR y los Sadosky.",
    navLabel: "Programas",
    group: "ecosistema",
    eyebrow: "Por dónde entrar",
  },
  {
    slug: "inversion",
    title: "Inversión en el tech de Mar del Plata",
    description:
      "Neutrón, el capítulo local de ángeles, instrumentos públicos y el caso de Roomix.",
    navLabel: "Inversión",
    group: "ecosistema",
    eyebrow: "Plata y programas",
  },
  {
    slug: "educacion",
    title: "Estudiar tech en Mar del Plata",
    description:
      "Universidades, tecnicaturas, CFP 402 y formación gratuita. La oferta completa está en /estudiar.",
    navLabel: "Educación",
    group: "ecosistema",
    eyebrow: "Dónde formarte",
  },
  {
    slug: "cafes",
    title: "Cafés para laburar en Mar del Plata",
    description:
      "No publicamos una lista de wifi y enchufes sin chequeo en persona. El mapa vivo está en /trabajar.",
    navLabel: "Cafés",
    group: "ciudad",
    eyebrow: "Con la compu",
  },
  {
    slug: "barrios",
    title: "Barrios y alquiler en Mar del Plata",
    description:
      "Perfil de los barrios y una mediana de alquiler anual, con fecha y método. El verano cambia las reglas.",
    navLabel: "Barrios",
    group: "ciudad",
    eyebrow: "Dónde vivir",
  },
  {
    slug: "transporte",
    title: "Moverse y llegar a Mar del Plata",
    description:
      "Colectivo, Bondi MDP, tren, micro y avión. Los tiempos se mantienen. Los precios cambian.",
    navLabel: "Transporte",
    group: "ciudad",
    eyebrow: "Cómo llegar",
  },
  {
    slug: "temporadas",
    title: "Temporadas en Mar del Plata",
    description:
      "El verano llena la ciudad. El calendario tech se concentra de marzo a noviembre.",
    navLabel: "Temporadas",
    group: "ciudad",
    eyebrow: "El ritmo del año",
  },
  {
    slug: "visita",
    title: "Si venís de visita",
    description:
      "Qué mes conviene, cómo conectar rápido y la visa nacional de nómade, que no es un programa de la ciudad.",
    navLabel: "De visita",
    group: "ciudad",
    eyebrow: "Una semana en la ciudad",
  },
  {
    slug: "historia",
    title: "Historia corta del polo tech",
    description:
      "De ATICMA en 2006 a la Tech Week 2026 y los Sadosky. Una línea de tiempo con fuente.",
    navLabel: "Historia",
    group: "contexto",
    eyebrow: "Cómo se armó esto",
  },
  {
    slug: "medios",
    title: "Medios y canales",
    description:
      "Dónde leer lo que pasa y los grupos públicos que se pueden citar. Si conocés un newsletter, sumalo.",
    navLabel: "Medios",
    group: "contexto",
    eyebrow: "Cómo enterarte",
  },
  {
    slug: "gente",
    title: "Cuentas para seguir",
    description:
      "Solo cuentas institucionales, hasta que cada persona dé permiso para figurar con su perfil.",
    navLabel: "Cuentas",
    group: "contexto",
    eyebrow: "Sin perfiles personales",
  },
  {
    slug: "contribuir",
    title: "Sumá a la guía",
    description:
      "Si falta algo o está desactualizado, lo revisamos con fuente pública y fecha.",
    navLabel: "Sumá",
    group: "contexto",
    eyebrow: "Esta guía es de la comunidad",
  },
];

export function getGuiaPage(slug: string): GuiaPageMeta | undefined {
  return GUIA_PAGES.find((page) => page.slug === slug);
}

export function guiaPath(slug?: string): string {
  return slug ? `/guia/${slug}` : "/guia";
}
