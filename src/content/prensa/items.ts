import type { PressItem } from "./types";

/** Clippings curados de prensa sobre la comunidad Mar del Plata Dev. */
export const pressItems: PressItem[] = [
  // —— Café Cursor (26 abr 2026, Hotel Konke) ——
  {
    id: "cafe-cursor-municipio",
    title: "Mar del Plata recibe a Café Cursor, un espacio para desarrolladores e interesados en inteligencia artificial",
    outlet: "Municipalidad de General Pueyrredón",
    date: "2026-04-23",
    url: "https://www.mardelplata.gob.ar/Noticias/mar-del-plata-recibe-caf%C3%A9-cursor-un-espacio-para-desarrolladores-e-interesados-en",
    excerpt:
      "Gacetilla oficial que invita a la primera edición de Café Cursor el 26 de abril en el Hotel Konke, organizada junto a mardelplata.dev.ar.",
    events: ["cafe-cursor"],
    type: "gacetilla",
    archivePath: "cafe-cursor-municipio.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "cafe-cursor-mi8",
    title: "Coworking para desarrolladores e interesados en IA: se viene la primera edición de Café Cursor en Mar del Plata",
    outlet: "Mi 8",
    date: "2026-04-23",
    url: "https://mi8.com.ar/coworking-para-desarrolladores-e-interesados-en-ia-se-viene-la-primera-edicion-de-cafe-cursor-en-mar-del-plata/",
    excerpt:
      "La propuesta gratuita reunirá a la comunidad tech local en el Hotel Konke para networking, demos y coworking con herramientas de IA.",
    events: ["cafe-cursor"],
    type: "reportaje",
    archivePath: "cafe-cursor-mi8.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "cafe-cursor-arrobamdp",
    title: "Mar del Plata recibe Café Cursor, un encuentro sobre inteligencia artificial",
    outlet: "Arroba MDP",
    date: "2026-04-23",
    url: "https://arrobamdp.com.ar/mar-del-plata-recibe-cafe-cursor-un-encuentro-sobre-inteligencia-artificial/",
    excerpt:
      "Primera edición en la ciudad, organizada con mardelplata.dev.ar: networking, lightning demos y coworking con cupo de 80 personas.",
    events: ["cafe-cursor"],
    type: "reportaje",
    archivePath: "cafe-cursor-arrobamdp.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "cafe-cursor-mardelmakers",
    title: "Programar con inteligencia artificial desde Mar del Plata: Café Cursor y la comunidad tech",
    outlet: "Mardel Makers",
    date: "2026-04-26",
    url: "https://mardelmakers.com.ar/cafe-cursor-programar-ia-mar-del-plata/",
    excerpt:
      "Crónica del encuentro con ~80 personas en sala y más de 200 inscriptos; menciona el capítulo local del Aleph Hackathon con mayor participación del país.",
    events: ["cafe-cursor", "aleph"],
    type: "reportaje",
    archivePath: "cafe-cursor-mardelmakers.md",
    capturedAt: "2026-09-03",
  },

  // —— Alianza ATICMA (may 2026) ——
  {
    id: "aticma-linkedin",
    title: "Alianza estratégica uniendo el talento de Mar del Plata Dev y ATICMA",
    outlet: "ATICMA (LinkedIn)",
    date: "2026-05-20",
    url: "https://es.linkedin.com/posts/aticma_alianza-estrat%C3%A9gica-uniendo-el-talento-de-activity-7462842264344645634-gyQo",
    excerpt:
      "Publicación oficial de ATICMA anunciando la alianza con la comunidad. El cuerpo completo requiere inicio de sesión en LinkedIn.",
    events: ["aticma"],
    type: "institucional",
    archivePath: "aticma-linkedin.md",
    capturedAt: "2026-09-03",
    archivePartial: true,
  },
  {
    id: "aticma-puntonoticias",
    title: "Mar del Plata Dev consolida su crecimiento mediante una alianza estratégica con ATICMA",
    outlet: "Punto Noticias",
    date: "2026-05-21",
    url: "https://puntonoticias.com/mar-del-plata-dev-consolida-su-crecimiento-mediante-una-alianza-estrategica-con-aticma/",
    excerpt:
      "La comunidad tech local y el polo tecnológico formalizan una alianza para impulsar talento y eventos conjuntos en la ciudad.",
    events: ["aticma"],
    type: "reportaje",
    archivePath: "aticma-puntonoticias.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "aticma-elretrato",
    title: "Mar del Plata Dev se alía con ATICMA y lleva tecnología, música e inteligencia artificial en un solo evento",
    outlet: "El Retrato de Hoy",
    date: "2026-05-26",
    url: "https://elretratodehoy.com.ar/2026/05/26/mar-del-plata-dev-se-alia-con-aticma-y-lleva-tecnologia-musica-e-inteligencia-artificial-en-un-solo-evento/",
    excerpt:
      "Historia de origen de la comunidad con Luigi Canoro y Franco Petruccelli, la alianza con ATICMA y la previa de Bit & Beat.",
    events: ["aticma", "bit-beat"],
    type: "reportaje",
    archivePath: "aticma-elretrato.md",
    capturedAt: "2026-09-03",
  },

  // —— Bit & Beat (6 jun 2026, Espacio Núcleo) ——
  {
    id: "bit-beat-infobrisas",
    title: "Tecnología y cultura en clave local: llega Bit & Beat con charlas de IA y música en vivo",
    outlet: "Infobrisas",
    date: "2026-05-26",
    url: "https://www.infobrisas.com/noticias/2026/05/26/96243-tecnologia-y-cultura-en-clave-local-llega-bit--beat-con-charlas-ia-y-musica-en-vivo",
    excerpt:
      "Previa del encuentro interdisciplinario de Mar del Plata Dev y ATICMA en Espacio Núcleo, con charlas y música en vivo.",
    events: ["bit-beat"],
    type: "reportaje",
    archivePath: "bit-beat-infobrisas.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "bit-beat-0223",
    title: "Bit & Beat: el evento tecnológico que busca impulsar el talento IT en Mar del Plata",
    outletTitle: "Bit a Bit: el evento tecnológico que busca impulsar el talento IT en Mar del Plata",
    outlet: "0223",
    date: "2026-05-26",
    url: "https://www.0223.com.ar/nota/2026-5-26-15-40-0-bit-a-bit-el-evento-tecnologico-que-busca-impulsar-el-talento-it-en-mar-del-plata",
    excerpt:
      "Entrevista a Luigi Canoro sobre la alianza con ATICMA y el evento del 6 de junio. El medio tituló el evento como «Bit a Bit».",
    events: ["bit-beat", "aticma"],
    type: "reportaje",
    archivePath: "bit-beat-0223.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "bit-beat-municipio",
    title: '"Bit & Beat": encuentro interdisciplinario de tecnología y música',
    outlet: "Municipalidad de General Pueyrredón",
    date: "2026-05-28",
    url: "https://www.mardelplata.gob.ar/Noticias/bit-beat-encuentro-interdisciplinario-de-tecnolog%C3%ADa-y-música",
    excerpt:
      "Gacetilla oficial con el programa completo de charlas y música en vivo del 6 de junio en Independencia 3251.",
    events: ["bit-beat"],
    type: "gacetilla",
    archivePath: "bit-beat-municipio.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "bit-beat-portal-universidad",
    title: "Bit & Beat: un evento que une arte y tecnología",
    outlet: "Portal Universidad (UNMDP)",
    date: "2026-05-30",
    url: "https://portaluniversidad.org.ar/2026/05/30/bit-beat-un-evento-que-une-arte-y-tecnologia/",
    excerpt:
      "Cobertura universitaria del encuentro que combina charlas de IA, música y espacios de creación colaborativa.",
    events: ["bit-beat"],
    type: "reportaje",
    archivePath: "bit-beat-portal-universidad.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "bit-beat-mi8",
    title: "Bit & Beat: el encuentro que une arte, música e inteligencia artificial en Mar del Plata",
    outlet: "Mi 8",
    date: "2026-05-27",
    url: "https://mi8.com.ar/bit-beat-el-encuentro-que-une-arte-musica-e-inteligencia-artificial-en-mar-del-plata/",
    excerpt:
      "Previa del evento gratuito en Espacio Núcleo, con la participación de Mar del Plata Dev y ATICMA.",
    events: ["bit-beat"],
    type: "reportaje",
    archivePath: "bit-beat-mi8.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "bit-beat-mardelmakers-previa",
    title: "Mar del Plata Dev presenta Bit & Beat: tecnología y música en un mismo escenario",
    outlet: "Mardel Makers",
    date: "2026-06-01",
    url: "https://mardelmakers.com.ar/mar-del-plata-dev-bit-and-beat-tecnologia-musica/",
    excerpt:
      "Anticipo del encuentro interdisciplinario que une desarrolladores, artistas y charlas de IA.",
    events: ["bit-beat"],
    type: "reportaje",
    archivePath: "bit-beat-mardelmakers-previa.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "bit-beat-ahora",
    title: "Desarrolladores y artistas se unieron en una jornada de innovación y experimentación tecnológica",
    outlet: "AHORA MdP",
    date: "2026-06-09",
    url: "https://ahoramardelplata.com.ar/5/desarrolladores-y-artistas-se-unieron-en-una-jornada-de-innovacion-y-experimentacion-tecnologica",
    excerpt:
      "Cobertura posterior a Bit & Beat: charlas, música en vivo y trabajo colaborativo en Espacio Núcleo.",
    events: ["bit-beat"],
    type: "reportaje",
    archivePath: "bit-beat-ahora.md",
    capturedAt: "2026-09-03",
  },
  {
    id: "bit-beat-mardelmakers-post",
    title: "La comunidad de desarrolladores Mar del Plata Dev en Bit & Beat",
    outlet: "Mardel Makers",
    date: "2026-06-10",
    url: "https://mardelmakers.com.ar/comunidad-desarrolladores-mar-del-plata-dev-bit-and-beat/",
    excerpt:
      "Reseña del evento y del rol de la comunidad en la jornada que unió tecnología y cultura local.",
    events: ["bit-beat"],
    type: "reportaje",
    archivePath: "bit-beat-mardelmakers-post.md",
    capturedAt: "2026-09-03",
  },

  // —— Aleph Hackathon (capítulo Mar del Plata) ——
  {
    id: "aleph-chapter-oficial",
    title: "Aleph Hackathon — capítulo Mar del Plata",
    outlet: "Crecimiento / Aleph Hackathon",
    date: "2026-03-21",
    url: "https://alephhackathon.crecimiento.build/",
    excerpt:
      "Mar del Plata figura como capítulo IRL del hackathon global. La cobertura periodística local más citada está en la nota de Mardel Makers sobre Café Cursor.",
    events: ["aleph"],
    type: "institucional",
    primarySource: true,
  },

  // —— Cursor Hackathon (22 ago 2026, Line Up) ——
  {
    id: "cursor-hackathon-luma",
    title: "Cursor Hackathon Mar del Plata",
    outlet: "Luma (fuente primaria)",
    date: "2026-08-22",
    url: "https://luma.com/cursor-myvz",
    excerpt:
      "Página oficial del hackathon en Line Up Coworking. No se encontró cobertura periodística local archivada; se conserva como respaldo.",
    events: ["cursor-hackathon"],
    type: "institucional",
    archivePath: "cursor-hackathon-luma.md",
    capturedAt: "2026-09-03",
    primarySource: true,
  },

  // —— Respaldo institucional — intendente Neme (31 may 2026) ——
  {
    id: "neme-x-2026-05-31",
    title:
      "Agustín Neme respaldó públicamente a Mar del Plata DEV",
    outlet: "X / Twitter — @agustin_neme",
    date: "2026-05-31",
    url: "https://x.com/agustin_neme/status/2061182050581827836",
    excerpt:
      "El intendente publicó un video el 31 de mayo de 2026 respaldando a la comunidad y citando más de 500 desarrolladores (cifra del post oficial, no del sitio).",
    events: ["municipio-neme"],
    type: "institucional",
    archivePath: "neme-x-2026-05-31.md",
    capturedAt: "2026-09-03",
    thumbnailPath: "/prensa/neme-x-2026-05-31-poster.jpg",
    videoUrl: "https://x.com/agustin_neme/status/2061182050581827836",
  },
];
