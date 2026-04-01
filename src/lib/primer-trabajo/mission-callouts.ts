import { SILVER_DEV_RESUME_CHECKER_HREF } from "./silver-dev";

export type MissionCalloutConfig = {
  title: string;
  body: string;
  href: string;
  linkLabel: string;
  disclaimer: string;
};

/** Pregunta id → callout opcional (herramienta externa). */
export const MISSION_CALLOUTS: Partial<Record<string, MissionCalloutConfig>> = {
  cv_silver_grade: {
    title: "Antes de seguir: pasá tu CV por el resume checker de Silver Dev.",
    body: "Si tu CV no pasa un filtro básico, es muy probable que no llegues a entrevista. Usá la herramienta, corregí lo que marque y volvé acá con el grade (S / A / B / C) que te dio.",
    href: SILVER_DEV_RESUME_CHECKER_HREF,
    linkLabel: "Abrir resume checker (Silver Dev) — nueva pestaña",
    disclaimer:
      "Herramienta externa; no estamos afiliados. El diagnóstico no puntúa el contenido del CV: solo registramos tu resultado honesto en Silver Dev como señal de mercado.",
  },
  mkt_english: {
    title: "Misión inglés: test rápido EF SET.",
    body: "Un benchmark de 15 minutos te ubica frente a otros juniors y te dice dónde apuntar (lectura, vocabulario). Volvé y respondé con el nivel que te dio o el más cercano.",
    href: "https://www.efset.org/",
    linkLabel: "Abrir EF SET — nueva pestaña",
    disclaimer: "Sitio externo; sin afiliación. Si usás otro test serio, elegí la opción que mejor refleje tu nivel real.",
  },
  pf_existen: {
    title: "Misión GitHub: perfil público.",
    body: "Abrí tu GitHub y mirá qué vería un recruiter en 30 segundos: ¿hay al menos un proyecto tuyo con README útil o solo cursos clon?",
    href: "https://github.com/",
    linkLabel: "Abrir GitHub — nueva pestaña",
    disclaimer: "No evaluamos repos desde acá: solo tu autopercepción honesta como señal.",
  },
  mkt_certs_vs_build: {
    title: "Misión freeCodeCamp / certificaciones.",
    body: "Si cursás freeCodeCamp u otros, el mercado mira proyecto deployado y README antes que el PDF del certificado. Contrastá certis vs builds propios.",
    href: "https://www.freecodecamp.org/",
    linkLabel: "Abrir freeCodeCamp — nueva pestaña",
    disclaimer: "Referencia común de certis online; sin afiliación. Respondé según tu situación real.",
  },
  pf_presentation: {
    title: "Misión presentación: referencia visual.",
    body: "Compará tu portfolio o sitio con galerías claras de referencia (layout, tipografía, jerarquía). No copiés: usalo para calibrar si lo tuyo se entiende en segundos.",
    href: "https://huev0.site/",
    linkLabel: "Abrir huev0.site — nueva pestaña",
    disclaimer: "Sitio de referencia visual; sin afiliación. La pregunta es sobre legibilidad y cuidado, no sobre copiar estilos.",
  },
  mkt_leetcode: {
    title: "Misión práctica algorítmica.",
    body: "Algunos procesos filtran con LeetCode / HackerRank; otros no. Si tu rol objetivo suele tener tests, un poco de práctica semanal cambia la señal.",
    href: "https://leetcode.com/",
    linkLabel: "Abrir LeetCode — nueva pestaña",
    disclaimer: "Plataforma externa; sin afiliación. Si no aplica a tu stack, respondé honesto: la regla asociada es leve y no bloquea por defecto.",
  },
};
