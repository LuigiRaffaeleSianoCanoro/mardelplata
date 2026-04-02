import bundleBase from "./bundle-base.json";
import bundleSections from "./bundle-sections.json";
import bundleChecklist from "./bundle-checklist.json";

export const primerTrabajoData = {
  ...bundleBase,
  sections: bundleSections.sections,
  checklistModules: bundleChecklist.checklistModules,
} as const;

export type PrimerTrabajoData = typeof primerTrabajoData;
