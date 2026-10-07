export const TABS = [
  { id: "eventos", label: "Eventos" },
  { id: "comunidad", label: "Comunidad" },
  { id: "prensa", label: "Prensa" },
  { id: "empleos", label: "Empleos" },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function isTabId(v: string | null | undefined): v is TabId {
  return TABS.some((t) => t.id === v);
}
