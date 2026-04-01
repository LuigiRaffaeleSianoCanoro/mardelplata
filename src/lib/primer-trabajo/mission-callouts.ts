import { SILVER_DEV_RESUME_CHECKER_HREF } from "./silver-dev";

export type MissionCalloutConfig = {
  title: string;
  explanation: string;
  checklist?: string[];
  badExample?: string;
  goodExample?: string;
  href: string;
  linkLabel: string;
  disclaimer: string;
};

/** Pregunta id → callout opcional (herramienta externa). Huevsite no va acá: solo checklist del plan. */
export const MISSION_CALLOUTS: Partial<Record<string, MissionCalloutConfig>> = {
  cv_silver_grade: {
    title: "Antes de seguir: pasá tu CV por el resume checker de Silver Dev",
    explanation:
      "Si tu CV no pasa un filtro básico, es muy probable que no llegues a entrevista. Usá la herramienta, corregí lo que marque y volvé acá con el resultado (S, A, B o C).",
    checklist: [
      "Subís el PDF que mandás en postulaciones.",
      "Anotás la calificación que te dio la herramienta.",
      "Respondés acá con honestidad: no evaluamos el texto del CV nosotros.",
    ],
    badExample: "Decís que no lo hiciste y seguís mandando el mismo PDF a todo.",
    goodExample: "Pasás el archivo, mejorás lo que marca y repetís hasta subir el puntaje.",
    href: SILVER_DEV_RESUME_CHECKER_HREF,
    linkLabel: "Abrir resume checker (Silver Dev) — nueva pestaña",
    disclaimer:
      "Herramienta externa; no estamos afiliados. El diagnóstico no puntúa el contenido del CV: solo registramos tu resultado honesto como señal de mercado.",
  },
  mkt_english: {
    title: "Misión inglés: test corto EF SET",
    explanation:
      "Un test de unos minutos te ubica en lectura y escritura. Después podés compararte con lo que piden muchas empresas.",
    checklist: [
      "Entrás al sitio del test.",
      "Completás el examen con calma.",
      "Volvé y elegís acá el nivel que te dio (o el más cercano).",
    ],
    badExample: "Inventar un nivel sin haber hecho ningún test.",
    goodExample: "Hacer el test y responder con el resultado real.",
    href: "https://www.efset.org/",
    linkLabel: "Abrir EF SET — nueva pestaña",
    disclaimer: "Sitio externo; sin afiliación. Si usás otro test serio, elegí la opción que mejor refleje tu nivel.",
  },
  pf_existen: {
    title: "Misión GitHub: mostrar un proyecto propio",
    explanation:
      "Entrá a tu perfil de GitHub y pensá qué vería alguien que te busca en 30 segundos. No evaluamos el código acá: importa tu lectura honesta.",
    checklist: [
      "¿Hay al menos un proyecto hecho por vos (no solo ejercicios iguales a un curso paso a paso)?",
      "¿Hay un texto que explique qué hace el proyecto y cómo probarlo?",
      "¿Se entiende qué rol tuviste vos?",
    ],
    badExample: "Solo repos copiados del curso, sin cambios tuyos claros.",
    goodExample: "Un proyecto tuyo con texto claro y link para abrirlo o clonarlo.",
    href: "https://github.com/",
    linkLabel: "Abrir GitHub — nueva pestaña",
    disclaimer: "No evaluamos repos desde acá: solo tu autopercepción como señal.",
  },
  mkt_certs_vs_build: {
    title: "Misión certificados (freeCodeCamp u otros)",
    explanation:
      "El mercado mira antes un proyecto online funcionando y un texto claro en el repo que un PDF de certificado. Contrastá qué tenés de cada lado.",
    checklist: [
      "¿Tenés certificados pero poco código propio publicado?",
      "¿O tenés proyecto propio con link aunque el certificado pese menos?",
    ],
    badExample: "Solo diplomas y cero proyecto que se pueda abrir.",
    goodExample: "Certificado + al menos un proyecto tuyo con link y explicación.",
    href: "https://www.freecodecamp.org/",
    linkLabel: "Abrir freeCodeCamp — nueva pestaña",
    disclaimer: "Referencia común de cursos online; sin afiliación. Respondé según tu situación real.",
  },
  mkt_leetcode: {
    title: "Misión práctica de problemas tipo entrevista",
    explanation:
      "Algunas empresas usan sitios como LeetCode o HackerRank en el proceso. Otros puestos no. Si el rol que buscás suele tener esa prueba, un poco de práctica suma.",
    checklist: [
      "¿Practicás de vez en cuando o nunca?",
      "Si no aplica a tu objetivo, podés ser honesto: la penalización acá es leve.",
    ],
    badExample: "Nunca abriste el sitio y el aviso pide prueba algorítmica.",
    goodExample: "Hacés algunos ejercicios cuando estás en búsqueda activa.",
    href: "https://leetcode.com/",
    linkLabel: "Abrir LeetCode — nueva pestaña",
    disclaimer:
      "Plataforma externa; sin afiliación. Si no aplica a tu stack, respondé con sinceridad: la regla asociada no bloquea por defecto.",
  },
};
